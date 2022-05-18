const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const Admin = require('../model/admin.model');
const config = require('config');
let jwt = require("jsonwebtoken");
const { error } = require('winston');
var algo = "aes256";
var key = "password";
exports.adminSignup = async(request, response, next) => {
   
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    const { email, password} = request.body;
    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return response.status(400).json({ msg: "already exists" })
        }
        admin = new Admin({ email, password});
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        admin.save().then(result => {
            console.log(result);
     
            console.log(result);
            return response.status(200).json({ status: 'Success', result: result, });
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ status: 'SignUp failed' });
        })
     }catch(err) {
        console.log(err);
        return response.status(500).json(error);

     }
}
exports.adminSignIn =async(request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    const { email, password } = request.body;

    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("invalid password");
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Password' }] });
        }

        const payload = {
            admin: {
                id: admin._id,
                email:admin.email
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
                response.status(200).json(token);
            }
        );
    } catch (err) {
        console.error(err.message);
        response.status(500).json({msg:'Server error'});
    }


}