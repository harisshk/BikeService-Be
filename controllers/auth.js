const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
    try {
        //Checking for a user with same email Id
        let preUser = await User.findOne({ email: req.body.email });
        if (preUser) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "DUPLICATE_USER",
            });
        }
        const userData = {
            ...req?.body,
            isActive: false
        }

        const newUser = await new User(userData).save();
        newUser.password = undefined;
        res.status(StatusCodes.OK).json(({
            success: true,
            data: newUser
        }))

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Account",
            success: false,
            err: error.message,
        });
    }
};


//TODO : Make the Secret Code Private .
const login = async (req, res) => {
    try {
        //Finding if an account is created with the provided email .
        const isUserExisting = await User.findOne({ email: req.body.email })
        if (!isUserExisting) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "No account found using this email Id",
            });
        }
        const isCorrectPassword = await bcrypt.compare(req.body.password, isUserExisting.password)
        if (!isCorrectPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Mismatch email / password",
            });
        }
        let token = jwt.sign(
            { _id: isUserExisting._id, role: isUserExisting.role },
            process.env.JWTCODE,
        );
        let userInfoWithToken = await User.findOneAndUpdate({ _id: isUserExisting._id }, { jwtToken: token }).select('-password')
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Successfully Logged in",
            user: userInfoWithToken,
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Error in Login",
        });
    }
};

module.exports = { register, login }