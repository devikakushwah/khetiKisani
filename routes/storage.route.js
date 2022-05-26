const router = require('express').Router();
const multer = require('multer');
const fireBase = require("../middleware/firebase");
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });

const Storage = require('../model/storage.model');


router.post("/add", upload.single('image'),
    fireBase.fireBaseStorage,
    (request, response) => {

        console.log(request.body);
        console.log(request.file);
        Storage.create({
                storageId: request.body.storageId,
                name: request.body.name,
                capacity: request.body.capacity,
                location: request.body.location,
                video: request.body.video,
                storage_description: request.body.storage_description,
                images: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba",

                duration: request.body.duration,
            })
            .then(result => {
                console.log(result);
                return response.status(200).json(result);
            }).catch(err => {
                console.log(err);
                return response.status(500).json({ err: "server err.." })
            });
    });
// router.post("/add-items", async(request, response) => {
//     const item = {
//         name: request.body.name,
//         charges: request.body.charges,
//         description: request.body.description,
//         temperature: request.body.temperature,
//         weight: request.body.weight,
//         bookingDate: request.body.bookingDate,
//         durationNo: request.body.durationNo,
//         durationDay: request.body.durationDay
//     }
//     let storage = await Storage.findOne({ _id: request.body.sid });
//     console.log(storage);
//     storage.items.push(item);
//     storage.save().then(result => {
//         return response.status(200).json(result)
//     }).catch(
//         err => {
//             return response.status(500).json(err);
//         })
// })


router.post("/add-items", async(request, response) => {
    const item = {
        name: request.body.name,
        charges: request.body.charges,
        description: request.body.description,
        temperature: request.body.temperature
    }
    let storage = await Storage.findOne({ _id: request.body.sid });
    console.log(storage);
    storage.items.push(item);
    storage.save().then(result => {
        return response.status(200).json(result)
    }).catch(
        err => {
            return response.status(500).json(err);
        })
})


// router.put("/items/:sid/:item_id", async(request, response) => {
//     var storage = await Storage.findOne({ _id: request.params.sid });
//     var result = storage.items.filter(obj => {
//         return obj._id == (request.params.item_id)
//     })
//     const { charges, name, description, temperature } = request.body;
//     if (name) {
//         result[0].name = name
//     }
//     if (charges) {
//         result[0].charges = charges
//     }
//     if (description) {
//         result[0].description = description
//     }
//     if (temperature) {
//         result[0].temperature = temperature
//     }
//     for (let i = 0; i < storage.items.length; i++) {
//         if (storage.items[i]._id == request.body.id) {
//             storage.items.pull({ _id: request.body.id });
//             storage.items.push({
//                 name: result[0].name,
//                 charges: result[0].charges,
//                 temperature: result[0].temperature,
//                 description: result[0].description,
//                 _id: result[0]._id
//             })
//         }
//     }
//     storage.save().then((result) => {
//         response.status(200).json(result)
//     }).catch((err) => {
//         response.status(500).json(err)

//     })
// })


router.put("/update-items/:sid", async(request, response) => {
    var storage = await Storage.findOne({ _id: request.params.sid });
    var result = storage.items.filter(obj => {
        return obj._id == (request.body.item_id)
    })
    const { charges, name, description, temperature, weight } = request.body;
    if (name) {
        result[0].name = name
    }
    if (charges) {
        result[0].charges = charges
    }
    if (description) {
        result[0].description = description
    }
    if (temperature) {
        result[0].temperature = temperature
    }
    if (weight) {
        result[0].weight = weight
    }
    for (let i = 0; i < storage.items.length; i++) {
        if (storage.items[i]._id == request.body.id) {
            storage.items.pull({ _id: request.body.id });
            storage.items.push({
                name: result[0].name,
                charges: result[0].charges,
                temperature: result[0].temperature,
                description: result[0].description,
                _id: result[0]._id,
                weight: result[0].weight
            })
        }
    }
    storage.save().then((result) => {
        response.status(200).json(result)
    }).catch((err) => {
        response.status(500).json(err)

    })
})

router.delete("/delete-items", async(request, response) => {
    let storage = await Storage.findOne({ _id: request.body.sid });
    console.log(storage);
    storage.items.pull({ _id: request.body.item_id });
    storage.save().then(result => {
        console.log(result);
        return response.status(201).json(result)
    }).catch(
        err => {
            console.log(err);
            return response.status(500).json(err);
        })
})


// router.delete("/delete-items/:item_id/:sid", async(request, response) => {
//     let storage = await Storage.findOne({ _id: request.params.sid });
//     console.log(storage);
//     storage.items.pull({ _id: request.params.item_id });
//     storage.save().then(result => {
//         console.log(result);
//         return response.status(201).json(result)
//     }).catch(
//         err => {
//             console.log(err);
//             return response.status(500).json(err);
//         })
// })


router.get("/view-storage/:sid", (request, response) => {
    console.log(request.params.sid);

    Storage.find({storageId:request.params.sid}).populate("items").then(result=>
    {
        console.log(result);
        return response.status(200).json(result)
    }).catch(
        err => {
            return response.status(500).json(err);
        })
});

router.get("/view/:sid",(request,response)=>{
    console.log(request.params.sid);
    Storage.find({_id:request.params.sid}).populate("storageId").populate("items").then(result=>{

        console.log(result);
        return response.status(200).json(result)
    }).catch(
        err => {
            return response.status(500).json(err);
        })
})

// router.get("/view-storage/:sid", (request, response) => {
//     Storage.findOne({ _id: request.params.sid }).then(result => {
//         return response.status(200).json(result)
//     }).catch(
//         err => {
//             return response.status(500).json(err);
//         })
// })


router.get("/view-storage", (request, response) => {
    Storage.find().then(result => {

        return response.status(200).json(result)
    }).catch(
        err => {
            return response.status(500).json(err);
        })
});

router.post("/delete-storage", async(request, response) => {

    Storage.deleteOne({ _id: request.body.store_id }).then(result => {
        return response.status(200).json({ message: "Storage Deleted" })
    }).catch(error => {
        return response.status(500).json({ error: "Unable to delete" })
    })

})


router.post('/review/:sid', async(request, response) => {
    const reviews = {
        user: request.body.id,
        feedback: request.body.feedback,
    }
    let storage = await Storage.findOne({ _id: request.params.sid });
    console.log("storage  " + storage);
    storage.reviews.push(reviews);
    storage.save().then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(
        err => {
            return response.status(500).json(err);
        })

})
module.exports = router;