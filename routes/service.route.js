const router = require('express').Router();
const Service = require('../model/service.model');
const multer = require('multer');
const cloudinary = require('cloudinary');
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
cloudinary.config({
    cloud_name: "divfjsxkj",
    api_key: "519969236375722",
    api_secret: "GqRAukfL0NlrKKrsyA0prw_9wKM",
})

var upload = multer({ storage: storage });

router.post("/add", upload.single('image'), async(request, response) => {

    var result = await cloudinary.v2.uploader.upload(request.file.path);
    let pic = result.url;
    console.log("cloudinary Url" + pic);

    Service.create({
        name: request.body.name,
        charges: request.body.charges,
        travellingCharge: request.body.travellingCharge,
        description: request.body.description,
        adminDescription: request.body.adminDescription,
        images: pic,
        video: request.body.video
    }).then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
})


router.get("/view-services", (request, response) => {
    Service.find().then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
})

router.get("/view-services/:sid", (request, response) => {
    Service.findOne({ _id: request.params.sid }).then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
})

router.post("/update", upload.single('image'),
    async(request, response) => {
        var result = await cloudinary.v2.uploader.upload(request.file.path);
        let pic = result.url;
        console.log("cloudinary Url" + pic);

        Service.updateOne({ _id: request.body.sid }, {
                $set: {
                    name: request.body.name,
                    charges: request.body.charges,
                    travellingCharge: request.body.travellingCharge,
                    description: request.body.description,
                    adminDescription: request.body.adminDescription,
                    images: pic,
                    video: request.body.video
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

router.post("/delete", (request, response) => {
    console.log(request.body);
    Service.deleteOne({ _id: request.body.id }).then(result => {
        console.log(result)
        return response.status(200).json({ message: "Deleted successfully" })
    }).catch(error => {
        console.log(error)
        return response.status(500).json(error)
    })
})


router.post('/review/:sid', async(request, response) => {
    const reviews = {
        user: request.body.id,
        feedback: request.body.feedback,
    }
    let service = await Service.findOne({ _id: request.params.sid });
    console.log("storage  " + storage);
    service.reviews.push(reviews);
    service.save().then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(
        err => {
            console.log(err);
            return response.status(500).json(err);
        })

})
module.exports = router;