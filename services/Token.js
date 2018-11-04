var jwt = require('jsonwebtoken');
var config = require('../config/config');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token){
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

    jwt.verify(token, config.jwtSecret, function(err, decoded) {
        if (err){
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }   
    // if everything good, save to request for use in other routes
    req.body = decoded;
    next();
  });
}

function transformToToken(req,res,next){
  body = req.body;

  if(!body){
    return res.status(403).send('No body information');
  }

  var token = jwt.sign(body, config.jwtSecret, {
    expiresIn: config.tokenExpireTime
  });

  return res.status(200).send({success: true, token: token}); 
 
}

module.exports = {
  verifyToken: verifyToken,
  transformToToken: transformToToken
};