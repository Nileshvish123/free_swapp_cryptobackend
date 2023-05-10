const multer = require('multer')
const path=require('path')

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: './public/upload', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
})

const fileFilter = (req, file, cb) => {
    console.log(file.mimetype)
      if (
          
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype==='video/mp4'
      ) { // check file type to be png, jpeg, or jpg
        cb(null, true);
      } else {
        cb(null, false); // else fails
      }

  };

const imageUpload = multer({
    storage: imageStorage,
    // limits: {
    //   fileSize: 1000000 // 1000000 Bytes = 1 MB
    // },
    fileFilter: fileFilter
},console.log('666666666'))

module.exports=imageUpload