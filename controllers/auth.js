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
            error: true,
            err: error.message,
        });
    }
};


//TODO : Make the Secret Code Private .
const login = (req, res) => {
    //Finding if an account is created with the provided email .
    User.findOne({ email: req.body.email }, (error, userInfo) => {
        if (error || !userInfo) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: "No account found using this email Id",
            });
        }
        bcrypt.compare(req.body.password, userInfo.password, function (err, check) {
            if (err || !check) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: true,
                    message: "Mismatch email / password",
                });
            }

            let token = jwt.sign(
                { _id: userInfo._id, role: userInfo.role },
                process.env.JWTCODE,
            );

            User.findOneAndUpdate(
                { _id: userInfo._id },
                { jwtToken: token },
                (e, userInfoWithToken) => {
                    if (e) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            error: true,
                            message: "Error in getting the JWT Tokens",
                        });
                    }
                    //Hiding the password
                    userInfoWithToken.password = undefined;

                    userInfoWithToken.jwtToken = token;

                    return res.status(StatusCodes.ACCEPTED).json({
                        error: false,
                        message: "Successfully Logged in",
                        user: userInfoWithToken,
                    });
                },
            );
        });
    });
};

exports.generateOTP = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then((userExists) => {
            if (userExists) {
                const generatedOTP = generateRandom4DigitOTP();
                let otpDetails = {
                    otp: generatedOTP,
                    user: userExists,
                    username: req.body.email,
                };
                let newOtpDetails = new OTP(otpDetails);
                newOtpDetails
                    .save()
                    .then(() => {
                        mailer(req.body.email, generatedOTP, "login");
                        res.status(StatusCodes.OK).send({
                            success: true,
                            userExists: true,
                            message: "OTP successfully sent",
                        });
                    })
                    .catch((error) => {
                        res.status(StatusCodes.BAD_REQUEST).send({
                            error: StatusCodes.BAD_REQUEST,
                            success: false,
                            message: error,
                        });
                    });
            } else {
                res.status(StatusCodes.OK).send({
                    success: true,
                    userExists: false,
                    message: "User doesn't Exist",
                });
            }
        })
        .catch((error) => {
            res.status(StatusCodes.BAD_REQUEST).send({
                error: StatusCodes.BAD_REQUEST,
                success: false,
                message: error,
            });
        });
};

/**
 * @todo change collection name -OTP as OTP
 *
 */
exports.validateLoginOTP = (req, res) => {
    const { email, otp } = req.body;
    OTP.findOne({ username: email })
        .populate("user", { password: 0, jwtToken: 0 })
        .sort("-createdAt")
        .then((userInfo) => {
            if (userInfo.otp === otp) {
                let token = jwt.sign(
                    { _id: userInfo._id, role: userInfo.role },
                    process.env.JWTCODE,
                );
                User.findOneAndUpdate({ email: email }, { $set: { jwtToken: token } }, { new: true })
                    .then((updatedUser) => {
                        return res.status(StatusCodes.OK).json({
                            message: "OTP validated success",
                            token: token,
                            userInfo: updatedUser,
                            error: false,
                        });
                    })
                    .catch((error) => {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            errorMessage: error,
                            error: true,
                            message: "OTP cannot be validated",
                        });
                    });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid OTP",
                    error: true,
                });
            }
        })
        .catch((error) => {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: error,
                error: true,
            });
        });
};

exports.validateForgotPasswordOTP = (req, res) => {
    const { email, otp } = req.body;
    OTP.findOne({ username: email })
        .populate("user", { password: 0, jwtToken: 0 })
        .sort("-createdAt")
        .then((userInfo) => {
            if (userInfo.otp === otp) {
                res.status(StatusCodes.OK).json({
                    message: "OTP validated successfully",
                    error: false,
                    valid: true,
                    userId: userInfo.user._id,
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid OTP",
                    error: true,
                    valid: false,
                });
            }
        })
        .catch((error) => {
            res.status(StatusCodes.BAD_REQUEST).json({
                errorMessage: error,
                message: "Invalid OTP",
                error: true,
            });
        });
};
exports.updateNewPassword = (req, res) => {
    bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
        if (err) {
            return res.status(400).json({
                error: true,
                message: `Error in updating the password`,
            });
        }
        User.findByIdAndUpdate(
            { _id: req.body.userId },
            { password: hash },
            (e, updateUserInfo) => {
                if (e) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        error: true,
                        message: "Error in updating the Password",
                    });
                }

                //Hiding the password
                updateUserInfo.password = undefined;

                return res.status(StatusCodes.ACCEPTED).json({
                    error: false,
                    message: "Password updated successfully",
                    user: updateUserInfo,
                });
            },
        );
    });
};
exports.updatePassword = async (req, res) => {
    try {
        const userInfo = await User.findOne({ _id: req.body.userId, isActive: true })
        if (!userInfo) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: "No account found using this email Id",
            });
        }
        const check = await bcrypt.compare(req.body.oldPassword, userInfo.password)
        if (!check) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: "Mismatch old password",
            });
        }
        else {
            bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        message: `Error in updating the password`,
                    });
                }
                User.findByIdAndUpdate(
                    { _id: req.body.userId },
                    { password: hash },
                    (e, updateUserInfo) => {
                        if (e) {
                            return res.status(StatusCodes.BAD_REQUEST).json({
                                error: true,
                                message: "Error in updating the Password",
                            });
                        }

                        //Hiding the password
                        updateUserInfo.password = undefined;

                        return res.status(StatusCodes.ACCEPTED).json({
                            error: false,
                            message: "Password updated successfully",
                            user: updateUserInfo,
                        });
                    },
                );
            });
        }
    }
    catch (error) {
        console.log(error)
    }
};

exports.getOTPForPassword = async (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email })
        .then((userInfo) => {
            if (userInfo) {
                const generatedOTP = generateRandom4DigitOTP();
                let otpDetails = {
                    otp: generatedOTP,
                    user: userInfo,
                    username: req.body.email,

                };
                let newOtpDetails = new OTP(otpDetails);
                newOtpDetails
                    .save()
                    .then(() => {
                        mailer(req.body.email, generatedOTP, "forgot password");
                        res.status(StatusCodes.OK).send({
                            userExists: true,
                            error: false,
                            message: "OTP successfully sent",
                        });
                    })
                    .catch((error) => {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            error: true,
                            err: error.message,
                            message: "Error in sending the OTP",
                        });
                    });
            }
            else {
                res.status(StatusCodes.OK).send({
                    userExists: false,
                    error: false,
                    message: "User doesn't exist",
                });
            }

        })
        .catch((error) => {
            res.status(StatusCodes.BAD_REQUEST).json({
                userExists: false,
                error: true,
                message: "Internal server error",
            });
        });
};

exports.createAccountByAdmins = async (req, res) => {
    const { email, phoneNumber, name, role } = req.body
    try {
        //Checking for a user with same email Id
        let preUser = await User.findOne({ email: email });
        if (preUser) {
            return res.status(StatusCodes.CONFLICT).json({
                error: true,
                message: "DUPLICATE_USER",
            });
        }
        const password = generatePassword(8, false);
        var razorPayCustomerDetails
        if (role === "owner") {
            razorPayCustomerDetails = await createRazorPayCustomer({
                email: email,
                name: name,
                phoneNumber: phoneNumber
            })

        }
        let user = {
            ...req.body,
            password: password,
            payoutsContactId: razorPayCustomerDetails?.id
        };
        let newUser = await new User(user).save();
        sendPasswordMailer(email, password);
        // 	let body = `<p>New User Created</p>
        // 	<p>Name: ${newUser.name}</p>
        // 	<p>Role: ${newUser.role}</p>
        // 	<p>&nbsp;</p>
        // 	<p>- Account Created By ${req.user.name}</p>`;
        // let subject = `!! PROPY New User Added`;
        // let allAdmins = await User.find({role: "admin", isActive: true });
        // if (role === "regional-admin"){
        // 		// for(let i = 0 ; i < allAdmins.length ; i++){
        // 			sendMail ('hari850800@gmail.com', subject ,body);
        // 		// }
        // 	}
        const userId = newUser?._id
        const adminId = req.user?._id
        const region = newUser?.regions[0]
        const message = newUser?.role === "tenant" ? `New ${newUser?.role} ${newUser?.name}  added` : `New ${newUser?.role} added `
        addActivitiesUser(
            userId,
            adminId,
            region,
            message
        )
        return res.status(StatusCodes.ACCEPTED).json({
            error: false,
            message: "Account is created Successfully",
            user: newUser,
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in creating the Account",
            error: true,
            err: error.message,
        });
    }
};

exports.resetPasswordByAdmin = async (req, res) => {
    const { email } = req?.body
    try {
        const password = generatePassword(8, false);
        const hashPassword = await bcrypt.hash(password, 10)
        const newData = await User.findOneAndUpdate({ email: email }, { $set: { password: hashPassword } });
        sendPasswordMailer(email, password);
        return res.status(StatusCodes.ACCEPTED).json({
            error: false,
            message: "Password reset is done Successfully",
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Error in password reset",
            error: true,
            err: error.message,
        });
    }
}

const getAllUsersByRoles = async (req, res) => {
    try {
        const { role } = req.params
        const users = await User.find({
            isDeleted: false,
            //_id: { $nin: req.user._id },
            role: role,
        });
        return res.status(StatusCodes.ACCEPTED).json({
            error: false,
            message: "user fetched successfully",
            data: users,
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: false,
            err: error.message,
            message: "Error finding users",
        });
    }
};

exports.getUsersByRegionAdmin = async (req, res) => {
    try {
        const { regions } = req.user
        const { role } = req.query
        const results = await User.find({ role: role, regions: { $in: regions[0] } })
        return res.status(StatusCodes.ACCEPTED).json({
            error: false,
            message: "user fetched successfully",
            results: results,
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: false,
            err: error.message,
            message: "Error finding users",
        });
    }
}
exports.logout = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        { jwtToken: null },
        (error, user) => {
            if (!user) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: true, message: "Error in finding the user Id" });
            }
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: true,
                    message: "Error in Logging out",
                });
            }
            res.status(StatusCodes.ACCEPTED).json({
                error: false,
                message: "Sign Out Successfully",
            });
        },
    );
};

exports.updateUser = (req, res) => {
    const { name, phoneNumber, role, regions } = req.body
    User.findByIdAndUpdate({ _id: req.body.userId }, { $set: req.body }, { name: 1, email: 1, role: 1, regions: 1, phoneNumber: 1 })
        .then((updatedUserInfo) => {
            let changes = []

            /**
             * Iterating Object one by one and comparing it with the body if any changes found push them to changes array.
             */
            // for (const item in updatedUserInfo?._doc) {
            // 	if (req?.body[item] && updatedUserInfo[item] !== req?.body[item]) {
            // 		if (item === "regions") {
            // 			if (updatedUserInfo?._doc[item][0] !== req?.body[item][0]) {
            // 				changes.push(item);
            // 			}
            // 		} else {
            // 			changes.push(item);
            // 		}
            // 	};
            // };
            if (role !== updatedUserInfo?.role && role) {
                changes.push(" Role")
            }
            if (phoneNumber !== updatedUserInfo?.phoneNumber && phoneNumber) {
                changes.push(" Phone Number")
            }
            if (name !== updatedUserInfo?.name && name) {
                changes.push(" Name")
            }
            if (regions?.toString() !== updatedUserInfo?.regions?.toString() && regions) {
                changes.push(" Region")
            }
            if (changes.length !== 0) {
                const userId = updatedUserInfo?._id;
                const adminId = req.user?._id;
                const region = updatedUserInfo?.regions[0];
                const newActivity = updatedUserInfo?.name + " Profile has been updated by " + req?.user?.name + "(" + req?.user?.role + ")." + (changes.length !== 0 ? "\nChanges : " + changes.toString() : "");
                addActivitiesUser(
                    userId,
                    adminId,
                    region,
                    newActivity
                );
            }
            res.status(StatusCodes.OK).json({
                error: false,
                message: "User updated successfully",
            });
        })
        .catch((error) => {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                errorMessage: error.message,
                message: "User not updated"
            });
        });
};

exports.updateUserInfo = async (req, res) => {
    try {
        let updatedUser = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: req.body },
            { new: true }
        );
        updatedUser.password = undefined;
        return res.status(StatusCodes.ACCEPTED).json({
            error: false,
            message: "Updated Info Successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: "Error in updating the User Info ",
            err: error.message,
        });
    }
};


exports.getUserInfo = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id }).populate("rejectedBy")
        req.user.jwtToken = undefined;
        return res.status(StatusCodes.OK).json({
            message: "success",
            error: false,
            user: req.user,
            profile: profile
        });
    } catch (error) {
        return res.status(StatusCodes.OK).json({
            error: true,
            err: error.message,
            message: "Error in getting user profile ."
        });
    };
}

module.exports = { register, login }