const User = require('../../../../model/index').user;
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const jwtSecret = require('../../../../config/jwtConfig/jwtconfig')
const cookies = require('cookies-parser')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const auth = {}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mnhetz999@gmail.com',
        pass: 'gpah btjo zfjb aglb'
    }
});

auth.register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const cryptotoken = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() * 100
        const existingUser = await User.findOne({ email: req.body.email })
        console.log(existingUser)
        if (existingUser) {
            return ApiResponse(res, 400, { status: false, msg: 'Email already exist', data: null })
        }
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password:  req.body.password,
            token: cryptotoken,
            tokenExpiration: expirationTime 
        });

        const { password, ...rest } = newUser._doc

        const mailOptions = {
            from: 'mnhetz999@gmail.com',
            to: req.body.email,
            subject: 'Account Verification',
            text: `Click the following link to verify your account: http://localhost:5050/api/vi/auth/verify?token=${cryptotoken}`,
        };

        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Failed to send verification email');
            } else {
                console.log('Verification email sent:', info.response);
                res.status(200).send('Verification email sent');
            }
        })

        
        return ApiResponse(res, 200, { status: true, msg: 'User created Succesfully and verification email has been sent', data: rest })
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }

}

auth.login = async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }


        const findUser = await User.findOne({ email: req.body.email })
        console.log(findUser)
        if (!findUser ||req.body.password!==findUser.password  ) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid credentials', data: null })
        }
        if(!findUser.isVerified){
            return ApiResponse(res, 400, { status: false, msg: 'User not verify', data: null })
        }
        const { password, ...rest } = findUser._doc

        const payload = {_id: findUser._id, name: findUser.name, role: findUser.role, isVerified:  findUser.isVerified, email: findUser.email}
        const token = jwt?.sign(payload, jwtSecret.secret, {expiresIn: jwtSecret.expiresIn} )
        return   ApiResponse(res, 200, { status: true, msg: 'User succesfully login', data: rest, token })
    }catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

auth.verify = async (req, res) => {

    const { token } = req.query;
    try {
        if (!token) {
            return res.status(404).json({ err: "token not provided" })
        }

        const user = await User.findOne({ token });

        if (user) {
            if (user.tokenExpiration < Date.now()) {
                return res.status(400).send('Verification link has expired. Please request a new verification email.');
            }
            if (user.isVerified) {
                return res.status(400).send('Verification link has already been used');
            }
            user.isVerified = true;
            await user.save();
            res.status(200).send('Account verified successfully now you can login on http://localhost:3000/login');
        } else {
            res.status(400).send('Invalid verification token');
        }
    } catch (error) {
        console.error('Error verifying account:', error);
        res.status(500).send('Failed to verify account');
    }


}



module.exports = auth