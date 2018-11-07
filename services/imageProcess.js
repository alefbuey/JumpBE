const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/profiles')
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname); 
    }
})

const fileFilter = (req,file,cb)=>{
    //reject a file
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }

}

const uploadProfile = multer({
    storage: storage, 
    limits: {
        fileSize: 512 * 512 * 5
    },
    fileFilter: fileFilter 
});

module.exports = {
    uploadProfile: uploadProfile
}