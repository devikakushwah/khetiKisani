const express = require('express');
const router = express.Router();
const requests = require('../model/landrequests');

router.post("/booked/:fid", async(request, response) => {
    const data = await requests.findOne({ _id: request.params.fid })
    console.log(data)
    requests.updateOne({ _id: request.params.fid }, {
            $set: {
                isAccepted: request.body.accept
            }

        }).then(result => {
            console.log(result);
            if (result.isAccepted == true)
                return response.status(200).json({ message: "Farm booked" })
            else
                return response.status(200).json({ message: "Farm not booked" });
        })
        .catch(error => {
            return response.status(500).json({ message: "Error occured" })
        })
})


router.post("/deal/:uid/:cid", (request, response) => {
    requests.create({
        userId: request.params.uid,
        contractId: request.params.cid
    }).then(result => {
        return response.status(200).json({ message: "request created" })
    }).catch(error => {
        return response.status(500).json({ message: "Something went wrong" });
    })
})

router.get("/booked-list", (request, response) => {
    requests.find().populate("userId").populate("contractId").then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
})

router.get("/book-list/:uid", (request, response) => {
    requests.find({ _id: request.params.uid }).populate("contractId").then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
})

module.exports = router;