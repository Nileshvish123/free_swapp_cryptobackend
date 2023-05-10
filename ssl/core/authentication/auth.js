const jwt = require("jsonwebtoken");

const config = process.env;
var url = require('url')
const verifyToken = (req, res, next) => {

    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With,Accept,Origin');
    res.header('Access-Control-Allow-Methods','POST, GET,PUT,DELETE OPTIONS');
//console.log(req.originalUrl)
  //console.log(req._parsedUrl)

  var pathname = url.parse(req.url).pathname;
  
 // console.log(req)
    var Urls = pathname
    var withoutAuthUrl = [
        '/userRegister',
        '/login',
        '/googleLogin',
        '/forgetPassword',
        '/getMediaContant',
        '/addEditEnquiry',
        '/getArticals',
        '/getArticalFilter',
        '/getFaqsList',
        '/getCategory',
        '/VerifyToken',
        '/addnewsletter',
        '/submitHelpForm',
        '/',
        '/sendresetPasswordLink'
    ]
   //const token = req.body.token || req.query.token || req.headers["authorization"]
    if (withoutAuthUrl.indexOf(Urls) > -1) {
        return next();

    } else {
        if (req.headers && req.headers.authorization) {
            const decoded = jwt.verify(req.headers.authorization, "My_Token_Key", (err, verifiedJwt) => {
                if (err) {
                    req.user = undefined
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).send({ success: false, message: "token expired!" })
                    } else {
                        return res.status(401).send({ success: false, message: "Unauthorised User!" })
                    }

                } else {
                   console.log(verifiedJwt)
                    req.userData = verifiedJwt;
                    return next();
                }
            });
            //  console.log(decoded)


        }
        else {
            return res.status(401).send({ success: false, message: "Unauthorised User!" })
        }

    }
};

module.exports = verifyToken;
