const express = require('express');
const router = express.Router();
const verifyToken = require('../services/verifyToken');
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
    updateJob
} = require('../controllers/job')

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
module.exports = router;