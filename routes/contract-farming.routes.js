const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require("../controller/contract-farming.controller");
const multer = require('multer');
const fireBase = require("../middleware/firebase");
const Contract = require('../model/contract_farming.model')

var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });

const contract = require('../model/contract_farming.model')
router.get("/approve", (request, response) => {
    contract.find({}, { isApproved: false }).then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    })
});

router.post("/contract-farming", upload.single('image'), fireBase.fireBaseStorage, userController.contract);

router.get("/view-requests", userController.viewList);

router.post("/update/:cid", userController.approved);

router.post("/cancel/:cid", userController.aborted);

router.get("/viewOne/:cid", userController.lookanyone);

router.get("/accepted-req", userController.verified);

router.get("/cancelled", userController.abortedlist);


module.exports = router;