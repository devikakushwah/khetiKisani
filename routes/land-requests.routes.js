const express = require('express');
const router = express.Router();
const requests = require('../model/landrequests');

router.post("/booked/:fid", (request, response) => {
    requests.updateOne({ _id: request.params.fid }).then(result => {
            return response.status(200).json({ message: "Farm booked" })
        })
        .catch(error => {
            return response.status(500).json({ message: "Error occured" })
        })
})

router.get("/booked-list", (request, response) => {
    requests.find().populate("userId").populate("contractId").then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
})

module.exports = router;