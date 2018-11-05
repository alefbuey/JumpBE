var jwt = require('jsonwebtoken');
var config = require('../config/config');

function showTokenInfo(req, res, next) {
    var token = req.body;

    jwt.verify(token, config.jwtSecret, function(err, decoded) {
        if (err){
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }   
    // if everything good, save to request for use in other routes
    return res.status(200).send(decoded);
    });
}
    module.exports = showTokenInfo;