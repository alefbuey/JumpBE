const express = require('express');
const router = express.Router();
const {verifyToken} = require('../services/Token');
const showTokenInfo = require('../services/showTokenInfo');

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

//user
router.route('/').post(verifyToken,login,showTokenInfo);
router.route('/register').post(register);

//client
router.route('/client').post(loginClient);

//job
router.route('/createJob').post(createJob);
router.route('/selectJob').post(selectJob,showTokenInfo);
router.route('/updateJob').post(updateJob);
router.route('/employer/selectJobsByState').post(selectJobsByStateEmployer);
router.route('/employee/selectJobsByStateEmployee').post(selectJobsByStateEmployee);
router.route('/feed').post(selectJobsByTime);
router.route('/profile').post(selectUserById);
module.exports = router;