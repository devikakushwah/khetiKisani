const router = require('express').Router();
const { validator, validationResult } = require('express-validator');
const Social = require('../model/googleLogin.model');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');
const gravatar = require("gravatar");
const nodemailer = require('nodemailer');
const config = require('config');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { printLogger } = require('../core/utility');
const { query } = require('express');
const multer = require('multer');
const fireBase = require("../middleware/firebase");


var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post("/googleSignin", async(request, response) => {
    let username = request.body.name;
    let email = request.body.email;
    let provider = request.body.provider;

    let social = await Social.findOne({ email: email });
    if (!social) {
        User.create({ name: username, email: email, provider: provider }).then(result => {
            console.log(result);
            const payload = {
                user: {
                    id: user._id,
                    email:user.email
                }
            };
            console.log(payload);
    
            jwt.sign(
                payload,
                config.get('jwtSecret'), { expiresIn: '5 days' },
                (err, token) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(token);
                    response.status(200).json( token);
                }
            );
        
        }).catch(error => {
            return response.status(200).json(error)
        });
    } else
    {
        console.log("does not exists");
        return response.status(500).json({msg:"user does not exists"});
    }
})
module.exports = router;