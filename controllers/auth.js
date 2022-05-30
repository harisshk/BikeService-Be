const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { sendMailToOne } = require('../utils/mail')
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
        res.status(StatusCodes.CREATED).json(({
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
        let userInfoWithToken = await User.findOneAndUpdate({ _id: isUserExisting._id }, { jwtToken: token }, { new: true }).select('-password')
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Successfully Logged in",
            user: userInfoWithToken,
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Error in Login",
        });
    }
};

const setUser = (req, res, next, id) => {
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: "user Id Not Available",
        });
    }
    User.findOne({ _id: id }, (error, userInfo) => {
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: "Error in finding the user Id",
            });
        }
        //userInfo.password = undefined;
        req.user = userInfo;
        next();
    });
};
const isSignedIn = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        if (!req.user || bearerToken !== req.user.jwtToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: true,
                message: "Un authorized access ---",
            });
        }
        next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: "No token found",
        });
    }
};

module.exports = { register, login, isSignedIn, setUser }