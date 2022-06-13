const router = require('express').Router();
const { validator, validationResult } = require('express-validator');
const User = require('../model/customer.model');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');
const gravatar = require("gravatar");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const config = require('config');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { printLogger } = require('../core/utility');
const { query } = require('express');
const multer = require('multer');
const fireBase = require("../middleware/firebase");
const Service = require("../model/service.model");
const Storage = require('../model/storage.model');
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
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountsid, authToken);
router.post('/signup', async(request, response) => {


    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json(err);
    }
    const { name, email, password, mobile, occupation, address, } = request.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log("already exists");
            return response.status(400).json({ msg: "This email is already assigned with another account, Please try another one!" })
        }
        user = new User({ name, email, mobile, password, occupation, address });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        const image = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user.image = image;
        user.save().then(result => {
            console.log(result);

            var options = {
                authorization: "jbKmfDycSI0QUAankG5pruwXetOsiYPVJvE1zCx7d6oLg2NZFMthPWGFymDc0uKIzTVZ5482EsaQvi19",
                message: ' Welcome to krishi junction! You have successfully registered',
                numbers: [result.mobile]
            }
            console.log(options);
            fast2sms.sendMessage(options) //Asynchronous Function.


            var mailOptions = {
                from: '"Krishi Junction "<devikakushwah29@gmail.com>',
                to: result.email,
                subject: 'Email verification!',
                text: 'Registration',
                html: "<b>Congratulations " + result.name + "! Your account has been created successfully on</b>" +
                    "<h3><a href='https://krishi-junction.herokuapp.com'>Krishi Junction</a></h3>" +
                    " <b>This link will be expired within 24 Hours," +
                    " Please Click on the <a href=" + ">Link</a> to verify your email to activate your account.</b>" +
                    "<b><br><br><br>Regards<br><h5>Krishi Junction</h5></b>"
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'signup');
                    console.log("send sms");

                    return response.status(200).json({ msg: "Congratulations :" + result.name + ", Your account has been created successfully, Please check your inbox to activate your account." });

                }
            })

        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** signup *************${JSON.stringify(err)}`, 'signup');
            return response.status(500).json({ msg: 'not saved' });
        })
    } catch (err) {
        console.log(err);
        printLogger(4, `*********** signup error  *************${JSON.stringify(err)}`, 'signup');
        return response.status(500).json({ msg: 'error find...' });
    }
});


router.post("/signin", async(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("invalid password");
            return response
                .status(404)
                .json({ errors: [{ msg: 'Invalid Password' }] });
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };
        console.log(payload);

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: '5 days' },
            (err, token) => {
                if (err) {
                    console.log(err);
                }
                console.log(token);
                response.status(200).json({ token: token, user: user });
            }
        );
    } catch (err) {
        console.error(err.message);
        response.status(500).json({ msg: 'Server error' });
    }

});

router.post("/googleSignin", async(request, response) => {

    const { email } = request.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            console.log("user not exists");
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }


        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };
        console.log(payload);

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: '5 days' },
            (err, token) => {
                if (err) {
                    console.log(err);
                }
                console.log(token);
                response.status(200).json({ token: token, user: user });
            }
        );
    } catch (err) {
        console.error(err.message);
        response.status(500).json({ msg: 'Server error' });
    }

});
router.get('/view/:id', (request, response) => {
    User.findOne({ _id: request.params.id }).then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    })
})
router.get("/view", (request, response) => {
    User.find().then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    })
});
router.post('/edit-profile/:id', async(request, response) => {

    const { name, email, address, mobile } = request.body;
    var profile = {};
    if (name)
        profile.name = name;
    if (email) {
        profile.email = email;
    }
    if (address) {
        profile.address = address;
    }
    if (mobile) {
        profile.mobile = mobile;
    }
    try {
        let objectProfile = await User.findOne({ _id: request.params.id });
        if (objectProfile) {
            objectProfile = await User.findOneAndUpdate({ _id: request.params.id }, { $set: profile }, { new: true });
            return response.status(200).json(objectProfile);
        }
    } catch (error) {
        return response.status(500).json({ error: error.array });
    }
});

router.post("/search-product", async(request, response) => {
    try {
        var regex = new RegExp(request.body.text, "i");
        console.log(regex); {
            $or: [{ branch: "ECE" },
                { joiningYear: 2017 }
            ]
        }
        var result = await Service.find({
            $or: [{ name: regex },
                { description: regex }
            ]
        })
        var data = await Storage.find({
            $or: [{ name: regex },
                { storage_description: regex }
            ]
        }).populate("items");
        console.log(result);
        console.log(data);
        return response.status(200).json({ service: result, storage: data });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ message: "Something went wrong" });
    }
});

router.get("/search", (request, response) => {
    var dbcourse = [];
    Service.find().then(result => {
        for (var i = 0; i < result.length; i++) {
            dbcourse.push(result[i]);
        }
        // result.map((d, k) => {
        //     dbcourse.push(d._id);
        // })

        Storage.find().populate("items").then(data => {
            console.log(dbcourse.length);
            for (var i = 0; i <= data.length; i++) {
                console.log("data" + data[i])
                dbcourse.push(data[i]);
            }
            console.log(dbcourse);
            return response.status(200).json(dbcourse);
        }).catch(err => {
            return response.status(500).json(err);
        })

    })
})


module.exports = router;