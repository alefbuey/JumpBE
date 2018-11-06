const express = require('express');
const router = express.Router();
const {verifyToken,transformToToken} = require('../services/Token');
const showTokenInfo = require('../services/showTokenInfo');
const config =  require('../config/config');

const {
    login,
    register,
    loginClient
}=require('../controllers/session');

// const {
// } = require('../controllers/user');

const {
    createJob,
    selectJob,
    deleteJob,
    updateJob,
    selectJobsByStateEmployer,
    selectJobsByStateEmployee,
    selectJobsByTime
} = require('../controllers/job');

const {
    selectUserById
} = require('../controllers/user');
//NOTA GLOBAL siempre antes de hacer una funcion usar verifyToken

if(config.desarrollo){
    //user
    router.route('/login').post(login);
    router.route('/register').post(register);
    router.route('/profile').post(selectUserById);

    //job
    router.route('/createJob').post(createJob);
    router.route('/selectJob').post(selectJob);
    router.route('/updateJob').post(updateJob);
    router.route('/employer/selectJobsByState').post(selectJobsByStateEmployer);
    router.route('/employee/selectJobsByStateEmployee').post(selectJobsByStateEmployee);
    //router.route('/feed').post(selectJobsByTime);
    router.route('/feed/:actualizar/:idUser').get(selectJobsByTime);

}else{
    //user
    router.route('/login').post(verifyToken,login,transformToToken);
    router.route('/register').post(verifyToken,register);
    router.route('/profile').post(verifyToken,selectUserById,transformToToken);

    //job
    router.route('/createJob').post(verifyToken,createJob);
    router.route('/selectJob').post(verifyToken,selectJob,transformToToken);
    router.route('/updateJob').post(verifyToken,updateJob);
    router.route('/employer/selectJobsByState').post(verifyToken,selectJobsByStateEmployer,transformToToken);
    router.route('/employee/selectJobsByStateEmployee').post(verifyToken,selectJobsByStateEmployee,transformToToken);
    router.route('/feed').post(verifyToken,selectJobsByTime,transformToToken);
}

//client
router.route('/client').post(verifyToken,loginClient);

module.exports = router;