const UserModels = require('../models/user.model');
const crypto = require('crypto');
var CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs')
const { base64encode, base64decode } = require('nodejs-base64');
var nodemailer = require('nodemailer')
var config = require('../core/config/db.config')
var sendNotification = require('../core/sendmedia');
const EnquiryModel = require('../models/Enquiry.model');
const e = require('cors');
const usercoinsModel = require('../models/usercoins.model');
const currencyModel = require('../models/currency.model');
const newsletterModel = require('../models/newsletter.model')
const transactionHIstoryModel = require('../models/transactionHIstory.model')
const tradeHistoryModel = require('../models/tradeHistory.model')
const helpdeskModel = require('../models/helpdesk.model')
const { stringify } = require('querystring');
exports.userRegister = async (req, res) => {
    try {
        var user = new UserModels()
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.email = req.body.email
        user.phone = req.body.phone
        /*password*/
        var password = req.body.password
        encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword
        // var existUser = await UserModels.find({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
        var existUser = await UserModels.find({ email: req.body.email })

        // sendNotification.mailtransporter(mailObject)

        console.log(existUser)
        if (existUser && existUser.length > 0) {
            return res.json({
                success: false,
                message: 'User already registered',
                response: {}
            })
        } else {
            user.save((err, data) => {
                if (err) throw err
                else {
                    var emailToken = JSON.stringify(req.body.email)
                    Token = base64encode(emailToken)

                    console.log(Token)
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: `nilesh.espsofttech@gmail.com`,
                          pass: `Nilesh123#`
                        }
                      });

                    // var transporter = nodemailer.createTransport({
                    //     host: 'espsofttechnologies.com',
                    //     port: 465,
                    //     secure: true,
                    //     auth: {
                    //         user: 'developer@espsofttechnologies.com',
                    //         pass: 'Espsoft123#'
                    //     },
                    //     tls: {
                    //         rejectUnauthorized: false
                    //     }
                    // });

                    var email = req.body.email;
                    var mailOptions = {
                        name: `${req.body.first_name} ${req.body.last_name}`,
                        from: 'developer@espsofttechnologies.com',
                        to: `${email}`,
                        subject: 'Account Activation Link',
                        text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                                          <h2>Please Click on given link to activate your account</h2>
                                          <a href='espsofttech.tech/free-crypto-swapping/verifyAccount/${Token}'>Click HERE </a> 
                                     </div>`
                    };

                    sendNotification.mailtransporter(mailOptions, function (error, info) {
                        if (error) {
                            //   console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    return res.json({
                        success: true,
                        message: 'User registered successfully. Please activate your account through your registered email',
                        response: data
                    })
                }
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.VerifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (token) {
            let email = base64decode(token);
            var email1 = JSON.parse(email);
            console.log(email1)
            await UserModels.updateOne({ email: email1 }, { is_verified: true })
            return res.status(200).send({
                success: true,
                msg: "Account  verified successfully"
            });

        } else {
            return res.status(400).send({
                success: false,
                msg: "something went wrong"
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'err',
            response: err
        });
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(200).send("All input is required");
        }

        const verifyUser = await UserModels.findOne({ email: email, is_verified: false, user_role: 'user' });
        if (verifyUser) {
            res.status(200).json({
                success: false,
                message: 'Please verify your account',
                response: {}
            });
        }
        const user = await UserModels.findOne({ email: email });

        if (user && user.is_active == false) {
            res.status(200).json({
                success: false,
                message: 'Your account deactivated please contact to admin',
                response: {}
            });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.user_id, user_role: user.user_role },
                "My_Token_Key"
            );
            user.token = token
            await UserModels.updateOne({ user_id: user.user_id }, { token: token })
            res.status(200).json({
                success: true,
                message: 'Login successfully',
                response: user
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'Invalid credential!',
                response: {}
            });
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'err',
            response: err
        });
    }

}

exports.googleLogin = async (req, res) => {
    const email = req.body.email
    const user = await UserModels.findOne({ email: email, is_active: true });
    if (user) {
        const token = jwt.sign(
            { user_id: user.user_id, user_role: user.user_role },
            "My_Token_Key"
        );
        user.token = token
        await UserModels.updateOne({ user_id: user.user_id }, { token: token })
        res.status(200).json({
            success: true,
            message: 'User login Successfully',
            response: user
        });
    } else {
        const user = new UserModels()
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.email = req.body.email
        user.user_role = 'user'
        user.phone = ''
        user.password = ''
        user.is_verified = true
        await user.save()
        const exist = await UserModels.findOne({ email: email });
        if (exist) {
            const token = jwt.sign(
                { user_id: exist.user_id, user_role: exist.user_role },
                "My_Token_Key"
            );
            user.token = token
            await UserModels.updateOne({ user_id: exist.user_id }, { token: token })
            res.status(200).json({
                success: true,
                message: 'User login successfully done',
                response: exist
            });
        }

    }

}

exports.sendresetPasswordLink = async (req, res) => {
    try {
        var email = req.body.email
        const user = await UserModels.findOne({ email: email })
        if (user) {
            var emailToken = JSON.stringify(req.body.email)
            var Token = base64encode(emailToken)
            //   console.log(user)
            var mailObject = {
                name: `${user.first_name} ${user.last_name}`,
                to: email,
                from: 'nilesh.espsofttech@gmail.com',
                subject: 'Password Reset',
                text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
            <h2>Please Click on given link to change your account password </h2>
            <a href='espsofttech.tech/free-crypto-swapping/enternew-password/${Token}'>Click HERE </a> 
              </div>`

            };
            sendNotification.mailtransporter(mailObject)
            res.status(200).json({
                success: true,
                message: 'Link send successfully on your mail please open',
                response: {}
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'User Not Exist!',
                response: {}
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }


}

exports.forgetPassword = async (req, res) => {
    try {
        const { user_id, password } = req.body;
        var email = base64decode(user_id);
        email = JSON.parse(email);

        var encryptedPassword = await bcrypt.hash(password, 10);
        await UserModels.updateOne({ email: email }, { password: encryptedPassword })
        const user = await UserModels.findOne({ email: email })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.user_id, user_role: user.user_role },
                "My_Token_Key"
            );
            user.token = token
            await UserModels.updateOne({ user_id: user.user_id }, { token: token })
            res.status(200).json({
                success: true,
                message: 'Password reset successfully',
                response: user
            });
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        });
    }


}

exports.addEditEnquiry = (req, res) => {
    try {
        if (req.body.enquiry) {
            var enquiry = {}
            enquiry.enquiry_id = parseInt(req.body.enquiry_id)
        } else {
            var enquiry = new EnquiryModel()
        }
        enquiry.fname = req.body.fname
        enquiry.lname = req.body.lname
        enquiry.phone = req.body.phone
        enquiry.email = req.body.email
        enquiry.message = req.body.message

        if (req.body.enquiry_id) {
            EnquiryModel.updateOne({ enquiry_id: parseInt(req.body.enquiry_id) }, enquiry, (err, data) => {
                res.status(200).json({
                    success: true,
                    message: 'Data updated successfully',
                    response: user
                });
            })
        } else {
            enquiry.save((data, err) => {
                var mailObject = {
                    name: req.body.fname + '' + req.body.lname,
                    to: "nilesh.espsofttech@gmail.com",
                    from: 'nilesh.espsofttech@gmail.com',
                    subject: 'Enquiry',
                    text: req.body.fname + ' ' + req.body.lname + 'text to you please check'
                };
                sendNotification.mailtransporter(mailObject)

                res.status(200).json({
                    success: true,
                    message: 'Your enquiry send successfully',
                    response: data
                });
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        });
    }


}

exports.deleteEnquiry = (req, res) => {
    try {
        EnquiryModel.deleteOne({ enquiry_id: parseInt(req.body.enquiry_id) }, (err, data) => {
            res.status(200).json({
                success: true,
                message: 'Enquiry deleted successfully',
                response: data
            });
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        });
    }

}

exports.getEnquiry = (req, res) => {
    try {
        EnquiryModel.find({}, (err, data) => {
            res.status(200).json({
                success: true,
                message: 'get enquiry List',
                response: data
            });
        }).sort({'enquiry_id':-1})
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.userCoinsActiveDeactive = async (req, res) => {
    const user_id = parseInt(req.userData.user_id)
    let user = await usercoinsModel.find({ user_id: user_id })
    await currencyModel.updateOne({ currency_id: parseInt(req.body.currency_id) }, { is_active: req.body.is_active })
    if (user.length > 0) {
        if (req.body.is_active === false) {
            const filteredCurrecy = user[0].coins.filter((item) => item.currency_id !== parseInt(req.body.currency_id))
            await usercoinsModel.updateOne({ user_id: user_id }, { coins: filteredCurrecy }, (err, data) => {
                if (err) throw err
                else {
                    res.status(200).json({
                        success: true,
                        message: 'Coin deactivated',
                        response: data
                    })
                }
            })

        } else {
            let array = user[0].coins
            var obj = {
                currency_id: parseInt(req.body.currency_id),
                name: req.body.name,
                symbol: req.body.symbol,
                logo: req.body.logo,
                is_active: req.body.is_active
            }
            // const newinsert = array.push(obj)
            console.log(obj)
            let updatevalue = await usercoinsModel.findOneAndUpdate({ user_id: user_id }, {
                $push: {
                    coins: obj
                }
            })
            res.status(200).json({
                success: true,
                message: 'Coin activated',
                response: updatevalue
            });


        }
    } else {
        var coins = new usercoinsModel()
        coins.user_id = user_id
        coins.coins = [{
            currency_id: parseInt(req.body.currency_id),
            name: req.body.name,
            symbol: req.body.symbol,
            logo: req.body.logo,
            is_active: req.body.is_active
        }]
        coins.save((err, data) => {
            if (err) throw err
            else {
                res.status(200).json({
                    success: true,
                    message: 'First coin activated',
                    response: data
                });
            }
        })
    }
}

exports.getAllCoins = async (req, res) => {
    try {
        var array = []
        currencyModel.find((err, data) => {
            if (err) throw err
            else {

                for (let x = 0; x < 100; x++) {
                    array.push(data[x])
                }
                res.status(200).json({
                    success: true,
                    message: 'get all coins List',
                    response: array
                });
            }
        }).sort({ currency_id: 1 })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.getUserCoins = (req, res) => {
    try {
        const user_id = parseInt(req.userData.user_id)
        usercoinsModel.find({ user_id: user_id }, (err, data) => {
            res.status(200).json({
                success: true,
                message: 'get user coins List',
                response: data
            });
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.sendreceive = (req, res) => {
    try {
        const transaction = new transactionHIstoryModel()
        transaction.user_id = parseInt(req.userData.user_id)
        transaction.date = new Date()
        transaction.usdAmount = req.body.usdAmount,
            transaction.cryptoAmount = req.body.cryptoAmount,
            transaction.transactionId = req.body.transactionId,
            transaction.symbol = req.body.symbol,
            transaction.recipient_address = req.body.recipient_address,
            transaction.type = 'send',  //send and receive

            transaction.save(async (err, data) => {
                if (err) throw err
                else {
                    const user = await UserModels.findOne({ user_id: parseInt(req.userData.user_id) })
                    var mailObject = {
                        name: `${user.first_name} ${user.last_name}`,
                        to: user.email,
                        from: 'developer@espsofttechnologies.com',
                        subject: 'Your order has been executed successfully.',
                        text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                    <b>You have just sent ${req.body.cryptoAmount} ${req.body.symbol} to ${req.body.recipient_address} Your transferred currency is available immediately and you can view the transaction details in your FreeSwap account</b> 
                      </div>`

                    };
                    sendNotification.mailtransporter(mailObject)
                    res.status(200).json({
                        success: true,
                        message: 'Successfully done',
                        response: data
                    })
                }
            })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.gettransactions = (req, res) => {
    try {
        transactionHIstoryModel.find({ user_id: parseInt(req.userData.user_id) }, (err, data) => {
            if (err) throw err
            else {
                res.status(200).json({
                    success: true,
                    message: 'get transaction list',
                    response: data
                })
            }
        }).sort({ transaction_id: -1 })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.addnewsletter = async (req, res) => {
    try {
        const email = req.body.email
        const exist = await newsletterModel.find({ email: email })
        if (exist.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Already requested send with this E-mail',
                response: {}
            })
        } else {
            var newsletter = new newsletterModel()
            newsletter.fullname = req.body.fullname
            newsletter.email = req.body.email
            newsletter.save((err, data) => {
                if (err) throw err
                else {
                    res.status(200).json({
                        success: true,
                        message: 'Your requested send',
                        response: data
                    })
                }
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.addtradeHistory = async (req, res) => {
    try {
        var trade = new tradeHistoryModel()
        trade.user_id = parseInt(req.userData.user_id),
            trade.date = req.body.date,
            trade.from_amount = req.body.from_amount,
            trade.to_amount = req.body.to_amount,
            trade.transaction_id = req.body.transaction_id,
            trade.from_symbol = req.body.from_symbol,
            trade.to_symbol = req.body.to_symbol,
            trade.wallet_address = req.body.wallet_address,
            trade.value_now = req.body.value_now,
            trade.status = req.body.status,

            trade.save(async (err, data) => {
                if (err) throw err
                else {
                    const user = await UserModels.findOne({ user_id: parseInt(req.userData.user_id) })
                    var mailObject = {
                        name: `${user.first_name} ${user.last_name}`,
                        to: user.email,
                        from: 'developer@espsofttechnologies.com',
                        subject: 'Your order has been executed successfully.',
                        text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                    <b>FreeSwap just converted ${req.body.from_amount} ${req.body.from_symbol} to ${req.body.to_amount} ${req.body.to_symbol} Your converted currency is available immediately and you can view the transaction details in your FreeSwap account.</b> 
                      </div>`

                    };
                    sendNotification.mailtransporter(mailObject)
                }
                res.status(200).json({
                    success: true,
                    message: 'Your trading successfully done',
                    response: data
                })
            }
            )
    }


    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.gettradeHistory = (req, res) => {
    try {
        tradeHistoryModel.find({ user_id: req.userData.user_id }, (err, data) => {
            if (err) throw err
            else {
                res.status(200).json({
                    success: true,
                    message: 'Trading List',
                    response: data
                })
            }
        }).sort({ history_id: -1 })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.submitHelpForm = (req, res) => {
    try {

        var help = new helpdeskModel()
        help.subject = req.body.subject
        help.email = req.body.email
        help.verify_email = req.body.verify_email
        help.description = req.body.description
        if (req.files && req.files.file) {
            help.file = req.files.file[0].filename
        } else[
            help.file = req.body.file
        ]

        help.save((err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Your request submitted successfully',
                    response: data
                })
            }
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.getrequestedData = (req, res) => {
    try {
        helpdeskModel.find({}, (err, data) => {
            if (err) throw err
            else {
                res.status(200).json({
                    success: true,
                    message: 'Requested List',
                    response: data
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.deleterequestedData = (req, res) => {
    try {
        helpdeskModel.deleteOne({ desk_id: parseInt(req.body.desk_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'User request deleted successfully',
                    response: data
                })
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}
