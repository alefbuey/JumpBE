const express = require('express');
const router = express.Router();


const {
    login
}=require('../controllers/session');

const {
    registerUser
} = require('../controllers/user');

router.route('/').post(login);
router.route('/register').post(registerUser);
module.exports = router;