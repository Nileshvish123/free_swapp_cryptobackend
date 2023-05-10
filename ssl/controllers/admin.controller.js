const articalsModel = require('../models/articals.model')
const categoryModel = require('../models/category.model')
const notificationModel = require('../models/notification.model')
const userModel = require('../models/user.model')
var sendNotification = require('../core/sendmedia');
var mediaModels = require('../models/adminMedia.model')
var bcrypt = require('bcryptjs')
const faqModels = require('../models/faqs.model');
const subcategoryModel = require('../models/subcategory.model');
const currencyModel = require('../models/currency.model');
const transactionHIstoryModel = require('../models/transactionHIstory.model')
const tradeHistoryModel = require('../models/tradeHistory.model')
const newsletterModel = require('../models/newsletter.model');
const { format } = require('crypto-js');
exports.addUser = (req, res) => {

}

exports.deleteUser = (req, res) => {
    try {
        userModel.deleteOne({ user_id: parseInt(req.body.user_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                    response: data
                })
            }
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.activeDeactiveUser = async (req, res) => {
    try {
        const user_id = parseInt(req.body.user_id)
        userModel.updateOne({ user_id: user_id }, { is_active: req.body.is_active }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: req.body.is_active == true ? 'User Activated Successfully' : 'User Deactivated Successfully',
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

exports.getUsers = async (req, res) => {
    try {
        let search = req.query.search
        let gdate = req.query.gdate
        let ldate = req.query.ldate
        if (search) {
            var users = await userModel.find({ $or: [{ 'first_name': { '$regex': search, '$options': 'i' } }, { 'last_name': { '$regex': search, '$options': 'i' } }] }).sort({ user_id: -1 })
            return res.status(200).json({
                success: true,
                message: 'get all user lists',
                response: users
            })
        } else if (gdate && ldate) {
            var users = await userModel.find({ user_role: 'user', "createdAt": { "$gte": gdate, "$lt": ldate } })
            return res.status(200).json({
                success: true,
                message: 'get all user lists',
                response: users
            })
        } else {
            userModel.find({ user_role: 'user' }, { user_id: 1, user_role: 1, user: 1, createdAt: 1, "is_active": 1, "is_verified": 1, "is_deleted": 1, "first_name": 1, "last_name": 1, "email": 1 }, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'get all user list',
                        response: data
                    })
                }
            }).sort({ user_id: -1 })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.adminchangepassword = async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;

        var encryptedPassword = await bcrypt.hash(newpassword, 10);
        var user = await userModel.find({ user_id: parseInt(req.userData.user_id) })
        //  console.log(user[0])
        if (user && (await bcrypt.compare(oldpassword, user[0].password))) {
            await userModel.updateOne({ user_id: user[0].user_id }, { password: encryptedPassword })
            res.status(200).json({
                success: true,
                message: 'Your Password Changed Successfully',
                response: user
            });
        } else {
            res.status(200).json({
                success: false,
                message: 'Your Old Password Did Not Match',
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

exports.addEditCategory = (req, res) => {
    try {
        if (req.body.category_id) {
            var category = {}
            category.category_id = parseInt(req.body.category_id)
        } else {
            var category = new categoryModel()
        }

        category.title = req.body.title
        //  category.subcategory = req.body.subcategory

        if (req.body.category_id) {
            categoryModel.updateOne({ category_id: parseInt(req.body.category_id) }, category, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Category updated successfully',
                        response: data
                    })
                }
            })
        } else {
            category.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Category added successfully',
                        response: data
                    })
                }
            })
        }

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.getCategory = (req, res) => {
    try {
        categoryModel.find({}, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Get category List',
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

exports.deleteCategory = (req, res) => {
    try {
        categoryModel.deleteOne({ category_id: parseInt(req.body.category_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Category deleted successfully',
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

exports.addEditartical = async (req, res) => {
    try {
        const artical_id = parseInt(req.body.artical_id)
        //   console.log(artical_id)
        if (req.body.artical_id && req.body.artical_id != 'undefined') {
            var artical = {}
            artical.artical_id = artical_id
        } else {
            var artical = new articalsModel()
        }
        var category = await categoryModel.find({})
        var catdata = category.filter((item => item.category_id == parseInt(req.body.category)))
        artical.title = req.body.title
        artical.category = [{
            label: catdata[0].title,
            value: catdata[0].category_id
        }]
        artical.description = req.body.description
        if (req.files && req.files.artical_image) {
            artical.artical_image = req.files.artical_image[0].filename
        } else[
            artical.artical_image = req.body.artical_image
        ]

        artical.artical_date = req.body.artical_date
        if (req.body.artical_id && req.body.artical_id != 'undefined') {
            articalsModel.updateOne({ artical_id: artical_id }, artical, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Article updated successfully',
                        response: data
                    })
                }
            })
        } else {
            artical.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Article added successfully',
                        response: data
                    })
                }
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.getArticals = (req, res) => {
    try {
        if (req.query.page) {
            articalsModel.find({}, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Get Article List',
                        response: data
                    })
                }
            }).skip(3 * parseInt(req.query.page)).limit(3).sort({ artical_id: -1 })
        } else {
            articalsModel.find({}, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Get Article List',
                        response: data
                    })
                }
            }).sort({ artical_id: -1 })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.getArticalFilter = async (req, res) => {
    try {
        let search = req.query.search
        let category = req.query.category
        let gdate = req.query.gdate
        let ldate = req.query.ldate

        if (category) {
            var article = await articalsModel.find({ is_active: true, category: { $elemMatch: { value: parseInt(category) } } }).sort({ artical_id: -1 })
        } else if (gdate && ldate) {
            var article = await articalsModel.find({ "artical_date": { "$gte": gdate, "$lt": ldate } })
        }
        else if (search) {
            var article = await articalsModel.find({ is_active: true, 'title': { '$regex': search, '$options': 'i' } }).sort({ artical_id: -1 })
        } else {
            var article = await articalsModel.find({ is_active: true }).sort({ artical_id: -1 })
        }
        return res.status(200).json({
            success: true,
            message: 'Get search category',
            response: article
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.activeDeactiveartical = (req, res) => {
    try {
        const artical_id = parseInt(req.body.artical_id)
        articalsModel.updateOne({ artical_id: artical_id }, { is_active: req.body.is_active }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: req.body.is_active == true ? 'Article Activated Successfully' : 'Article Deactivated Successfully',
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

exports.deleteArtical = (req, res) => {
    try {
        articalsModel.deleteOne({ artical_id: parseInt(req.body.artical_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Article deleted successfully',
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

exports.sendadminNofication = (req, res) => {
    try {
        var notification = new notificationModel()
        notification.sender_id = parseInt(req.body.sender_id)
        notification.receiver_id = parseInt(req.body.receiver_id)
        notification.message = req.body.message

        var mailObject = {
            to: "nilesh.espsofttech@gmail.com",
            from: 'nilesh.espsofttech@gmail.com',
            subject: 'Admin Notification',
            text: req.body.message
        };
        sendNotification.mailtransporter(mailObject)
        notification.save((err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Notification send successfully',
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

exports.getNotifications = async (req, res) => {
    try {
        let notificationData = await notificationModel.getListBywhere()
        return res.status(200).json({
            success: true,
            message: 'Get Notification List',
            response: notificationData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}



exports.addEditMediaContent = (req, res) => {
    try {
        if (req.body.media_id) {
            var media = {}
            media.media_id = parseInt(req.body.media_id)
        } else {
            var media = new mediaModels()
        }
        var contact = [
            {
                primary_contact: req.body.primary_contact,
                secondary_contact: req.body.secondary_contact,
                email: req.body.email,
                address: req.body.address
            }
        ]
        media.heading_title = req.body.heading_title
        media.heading_description = req.body.heading_description
        media.service_benefites_heading = req.body.service_benefites_heading
        media.service_benefits_description = req.body.service_benefits_description
        media.service_benefits_contantfirst_title = req.body.service_benefits_contantfirst_title
        media.service_benefits_contantfirst_description = req.body.service_benefits_contantfirst_description
        media.service_benefits_contantsecond_title = req.body.service_benefits_contantsecond_title
        media.service_benefits_contantsecond_description = req.body.service_benefits_contantsecond_description
        media.service_benefits_contantthird_title = req.body.service_benefits_contantthird_title
        media.service_benefits_contantthird_description = req.body.service_benefits_contantthird_description
        media.service_benefits_contantfourth_title = req.body.service_benefits_contantfourth_title
        media.service_benefits_contantfourth_description = req.body.service_benefits_contantfourth_description
        media.information_heading = req.body.information_heading
        media.information_description = req.body.information_description
        media.information_contentone_title = req.body.information_contentone_title
        media.information_contentone_description = req.body.information_contentone_description

        media.information_contentsecond_title = req.body.information_contentsecond_title
        media.information_contentsecond_description = req.body.information_contentsecond_description

        media.information_contentthird_title = req.body.information_contentthird_title
        media.information_contentthird_description = req.body.information_contentthird_description

        media.services = req.body.services
        media.about = req.body.about
        media.terms = req.body.terms
        media.logo = req.body.logostatus
        media.contact = contact

        if (req.files && req.files.information_contentone_image) {
            media.information_contentone_image = req.files.information_contentone_image[0].filename
        } else {
            media.information_contentone_image = req.body.information_contentone_image
        }

        if (req.files && req.files.information_contentsecond_image) {
            media.information_contentsecond_image = req.files.information_contentsecond_image[0].filename
        } else {
            media.information_contentsecond_image = req.body.information_contentsecond_image
        }

        if (req.files && req.files.information_contentthird_image) {
            media.information_contentthird_image = req.files.information_contentthird_image[0].filename
        } else {
            media.information_contentthird_image = req.body.information_contentthird_image
        }

        if (req.files && req.files.home_video) {
            media.home_video = req.files.home_video[0].filename
        } else {
            media.home_video = req.body.home_video
        }

        if (req.files && req.files.home_banner) {
            media.home_banner = req.files.home_banner[0].filename
        } else {
            media.home_banner = req.body.home_banner
        }

        media.services = req.body.services

        media.blog_title = req.body.blog_title
        media.blog_description = req.body.blog_description
        media.blog_video = req.body.blog_video

        console.log('media', media)
        if (req.body.media_id) {
            mediaModels.updateOne({ media_id: parseInt(req.body.media_id) }, media, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Media content updated successfully',
                        response: data
                    })
                }
            })
        } else {
            media.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Media content added successfully',
                        response: data
                    })
                }
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}


exports.getMediaContant = async (req, res) => {
    try {
        const mediaData = await mediaModels.getListBywhere()
        return res.status(200).json({
            success: true,
            message: 'Media Content list',
            response: mediaData[0]
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }


}

exports.addEditFaq = (req, res) => {
    try {
        if (req.body.faq_id) {
            var faq = {}
            faq.faq_id = parseInt(req.body.faq_id)
        } else {
            var faq = new faqModels()
        }

        faq.question = req.body.question
        faq.answer = req.body.answer
        if (req.body.is_active) {
            faq.is_active = req.body.is_active
        }
        if (req.body.faq_id) {
            faqModels.updateOne({ faq_id: parseInt(req.body.faq_id) }, faq, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Faq content updated successfully',
                        response: data
                    })
                }
            })
        } else {
            faq.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Faq content added successfully',
                        response: data
                    })
                }
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.getFaqsList = async (req, res) => {
    try {
        let faqsData = await faqModels.getListBywhere()
        return res.status(200).json({
            success: true,
            message: 'get Faqs List',
            response: faqsData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.deleteFaqs = (req, res) => {
    try {
        faqModels.deleteOne({ faq_id: parseInt(req.body.faq_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Faq deleted successfully',
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

exports.activeDeactiveFaqs = (req, res) => {
    try {
        const faq_id = parseInt(req.body.faq_id)
        faqModels.updateOne({ faq_id: faq_id }, { is_active: req.body.is_active }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: req.body.is_active == true ? 'Faq activated successfully' : 'Faq deactivated successfully',
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
exports.addEdiSubCategory = (req, res) => {
    try {
        if (req.body.subcategory_id) {
            var subcategory = {}
            subcategory.subcategory_id = parseInt(req.body.subcategory_id)
        } else {
            var subcategory = new subcategoryModel()
        }
        subcategory.category = req.body.category
        subcategory.title = req.body.title
        // category.subcategory = req.body.subcategory

        if (req.body.subcategory_id) {
            subcategoryModel.updateOne({ subcategory_id: parseInt(req.body.subcategory_id) }, subcategory, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Sub-category updated successfully',
                        response: data
                    })
                }
            })
        } else {
            subcategory.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Sub-category added successfully',
                        response: data
                    })
                }
            })
        }

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.getSubCategory = (req, res) => {
    try {
        subcategoryModel.find({}, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Get subcategory List',
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

exports.deleteSubCategory = (req, res) => {
    try {
        subcategoryModel.deleteOne({ subcategory_id: parseInt(req.body.subcategory_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Sub-category deleted successfully',
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

exports.addEditCurrency = (req, res) => {
    try {
        if (req.body.currency_id) {
            var currency = {}
            currency.currency_id = parseInt(req.body.currency_id)
        } else {
            var currency = new currencyModel()
        }
        currency.name = req.body.name
        if (req.files && req.files.image) {
            currency.image = req.files.image[0].filename
        } else[
            currency.image = req.body.image
        ]


        if (req.body.currency_id) {
            currencyModel.updateOne({ currency_id: parseInt(req.body.currency_id) }, currency, (err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Currency data updated successfully',
                        response: data
                    })
                }
            })

        } else {
            currency.save((err, data) => {
                if (err) throw err
                else {
                    return res.status(200).json({
                        success: true,
                        message: 'Currency added successfully',
                        response: data
                    })
                }
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.deleteCurrency = (req, res) => {
    try {
        currencyModel.deleteOne({ currency_id: parseInt(req.body.currency_id) }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Currency deleted successfully',
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

exports.activeDeactiveCurrency = (req, res) => {
    try {
        const currency_id = parseInt(req.body.currency_id)
        currencyModel.updateOne({ currency_id: currency_id }, { is_active: req.body.is_active }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: req.body.is_active == true ? 'Currency Activated Successfully' : 'Currency Deactivated Successfully',
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

exports.getCurrencyList = (req, res) => {
    try {
        currencyModel.find({}, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Get currency List',
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

exports.getnewsletter = (req, res) => {
    try {
        newsletterModel.find({}, (err, data) => {
            if (err) throw err
            else {
                res.status(200).json({
                    success: true,
                    message: 'Get news letter list',
                    response: data
                })
            }
        }).sort({ 'newsletter_id': -1 })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}

exports.sendnewsletter = async (req, res) => {
    try {

        const lettetusers = await newsletterModel.find({ is_active: true })
        const Message = req.body.message
        if (lettetusers.length > 0) {
             for (let x in lettetusers) {

              
            var mailObject = {
                name: lettetusers[x].fullname,
                to: lettetusers[x].email,
                // name: 'NILESH',
                // to: 'nilesh.espsofttech@gmail.com',
                from: 'developer@espsofttechnologies.com',
                subject: 'News Letter',
                text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
            <h2>You have to inform that</h2>
            <p>${Message}</p> 
              </div>`

            };
          //  console.log('lettetusers',mailObject)
            sendNotification.mailtransporter(mailObject)
              }

        }
        res.status(200).json({
            success: true,
            message: 'Your Notification Letter successfully send',
            response: {}
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}

exports.sendenquirymessage = async (req, res) => {
    try {

        const Message = req.body.newmessage
        const name = req.body.name
        const email = req.body.email
        var mailObject = {
            name: name,
            to: email,
            from: 'developer@espsofttechnologies.com',
            subject: 'Free Swapp Enquiry',
            text: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
            <h2>You have to inform that</h2>
            <p>${Message}</p> 
              </div>`

        };

        //   console.log(mailObject)
        await sendNotification.mailtransporter(mailObject)
        res.status(200).json({
            success: true,
            message: 'Your message successfully send',
            response: {}
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}


exports.activeDeactivenewsletteruser = (req, res) => {
    try {
        const newsletter_id = parseInt(req.body.newsletter_id)
        newsletterModel.updateOne({ newsletter_id: newsletter_id }, { is_active: req.body.is_active }, (err, data) => {
            if (err) throw err
            else {
                return res.status(200).json({
                    success: true,
                    message: req.body.is_active == true ? 'User Activated Successfully for receive newsletter' : 'User Deactivated Successfully for receive newsletter',
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

exports.getTotalCount = async (req, res) => {
    try {

        let obj = {
            categories: await categoryModel.countDocuments({}),
            articles: await articalsModel.countDocuments({}),
            users: await userModel.countDocuments({ user_role: 'user' }),
            sendtransactions: await transactionHIstoryModel.countDocuments({}),
            tradetransactions: await tradeHistoryModel.countDocuments({})
        }

        return res.status(200).json({
            success: true,
            message: 'All counted data',
            response: obj
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }

}


exports.getUserTransactions = async (req, res) => {
    try {
        if (req.query.type === 'swap') {
            tradeHistoryModel.find({ user_id: parseInt(req.query.user_id) }, (err, data) => {
                if (err) throw err
                else {
                    res.status(200).json({
                        success: true,
                        message: 'Swap Trading List',
                        response: data
                    })
                }
            }).sort({ history_id: -1 })
        } else {
            transactionHIstoryModel.find({ user_id: parseInt(req.query.user_id) }, (err, data) => {
                if (err) throw err
                else {
                    res.status(200).json({
                        success: true,
                        message: 'get send transaction list',
                        response: data
                    })
                }
            }).sort({ transaction_id: -1 })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error',
            response: error
        })
    }
}


exports.getAllswaprecords = async (req, res) => {
    try {
        const tradeData = await tradeHistoryModel.find({}).sort({ history_id: -1 })
        if (tradeData.length > 0) {
            let array = []
            for (let x in tradeData) {
                let obj = {}
                await userModel.findOne({ user_id: tradeData[x].user_id, user_role: 'user' }, (err, userData) => {

                    if (userData) {
                        obj.user_name = `${userData.first_name ? userData.first_name : ''} ${userData.last_name ? userData.last_name : ""}`
                        obj.email = userData.email ? userData.email : ''
                        obj.user_id = tradeData[x].user_id
                        obj.date = tradeData[x].date
                        obj.from_amount = tradeData[x].from_amount
                        obj.to_amount = tradeData[x].to_amount
                        obj.transaction_id = tradeData[x].transaction_id
                        obj.from_symbol = tradeData[x].from_symbol
                        obj.to_symbol = tradeData[x].to_symbol
                        obj.wallet_address = tradeData[x].wallet_address
                        obj.status = tradeData[x].status
                        obj.createdAt = tradeData[x].createdAt
                        obj.updatedAt = tradeData[x].updatedAt
                        obj.history_id = tradeData[x].history_id
                        array.push(obj)
                    }
                })
            }

            res.status(200).json({
                success: true,
                response: array
            })

        } else {
            res.status(200).json({
                success: false,
                message: 'Record empty!',
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



exports.getAllsendrecords = async (req, res) => {
    try {
        const sendData = await transactionHIstoryModel.find({}).sort({ transaction_id: -1 })
        if (sendData.length > 0) {
            let array = []
            for (let x in sendData) {
                let obj = {}
                await userModel.findOne({ user_id: sendData[x].user_id, user_role: 'user' }, (err, userData) => {

                    if (userData) {
                        obj.user_name = `${userData.first_name ? userData.first_name : ''} ${userData.last_name ? userData.last_name : ""}`
                        obj.email = userData.email ? userData.email : ''
                        obj.user_id = sendData[x].user_id
                        obj.date = sendData[x].date
                        obj.usdAmount = sendData[x].usdAmount
                        obj.cryptoAmount = sendData[x].cryptoAmount
                        obj.symbol = sendData[x].symbol
                        // obj.transactionId=sendData[x].transactionId
                        obj.recipient_address = sendData[x].recipient_address
                        obj.type = sendData[x].type
                        obj.createdAt = sendData[x].createdAt
                        obj.updatedAt = sendData[x].updatedAt
                        obj.transaction_id = sendData[x].transaction_id
                        array.push(obj)
                    }
                })
            }

            res.status(200).json({
                success: true,
                response: array
            })

        } else {
            res.status(200).json({
                success: false,
                message: 'Record empty!',
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