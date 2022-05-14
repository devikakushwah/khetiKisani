const router = require('express').Router();
const Service = require('../model/service.model');
const multer = require('multer');
const fireBase = require("../middleware/firebase");
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });
 
 router.post("/add",
  upload.single('image'),
   fireBase.fireBaseStorage,
   (request,response) => {
     console.log(request.body);
     console.log(request.file);
    Service.create({
        name: request.body.name,
        charges: request.body.charges,
        travellingCharge: request.body.travellingCharge,
        description :request.body.description,
        adminDescription: request.body.adminDescription,
       images: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" 
       + request.file.filename + "?alt=media&token=abcddcba",
        video:request.body.video,

    }).then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
 })
 router.get("/view-services",(request,response)=>{
     Service.find().then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
 })

 router.get("/view-services/:sid",(request,response)=>{
    Service.findOne({_id:request.params.sid}).then(result => {
       console.log(result);
       return response.status(200).json(result)
   }).catch(error => {
       console.log(error);
       return response.status(500).json(error)
   })
})
router.put("/update/:sid", upload.single('image'),
fireBase.fireBaseStorage,
(request,response)=>{
    Service.updateOne({ _id: request.params.sid }, {
        $set: {
            name: request.body.name,
            charges: request.body.charges,
            travellingCharge: request.body.travellingCharge,
            description :request.body.description,
            adminDescription: request.body.adminDescription,
            image: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba",
            video:request.body.video,
        }
    })
    .then(result => {
        console.log(result);
        return response.status(201).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ err: "server err.." })
    });
})

module.exports = router;