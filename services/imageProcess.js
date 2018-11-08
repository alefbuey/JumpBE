const multer = require('multer');

const storageProfile = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/profiles')
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname); 
    }
})

const storageJobs = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/jobs')
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
    storage: storageProfile, 
    limits: {
        fileSize: 512 * 512 * 5
    },
    fileFilter: fileFilter 
});

const uploadJobs = multer({
    storage: storageJobs, 
    limits: {
        fileSize: 512 * 512 * 5
    },
    fileFilter: fileFilter 
});

module.exports = {
    uploadProfile: uploadProfile,
    uploadJobs: uploadJobs
}