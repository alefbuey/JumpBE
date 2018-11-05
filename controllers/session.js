const config =  require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel');

module.exports = {
    login,
    register,
    loginClient
}

function login(req, res,next){
    console.log(req.body);
    User.findOne({where: {email: req.body.email}, raw: true}).then(user =>{
        if (!user){
            return res.status(404).send ('Authentication failed. Wrong password.');
        }

        if (!bcrypt.compareSync (req.body.password, user.password)){
            return res.status(401).send ({success: false, token: null});
        } 
        
        //para no reenviar la clave en el token
        user.password = 0;
        
        if(config.desarrollo){
            return res.status(200).send(user); 
        }else{
            req.body = user;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error in Login');
    });
}

function register(req, res){
    var body = req.body;    
    User.findOne({where: {email: body.email}}).then(exist =>{
        if(exist){
            return res.status(409).send('Registration failed. User with this email already registered.');
        }
        
        //Informacion añadida en el usuario
        

        var values = {
            idlocation  : body.idlocation,
            name		: body.name,
            lastname	: body.lastname,
            birthdate	: body.birthdate,
            gender      : body.gender,
            email       : body.email,
            password    : bcrypt.hashSync(body.password, config.saltRounds) //clave cifrada
        
            }
        
        //creo el usuario siguiendo el modelo y lo guarda en la base de datos
        User.create(values,
            function(err,user){
                if (err) return res.status(500).send("There was a problem registering the user")
            }
        )
        //retorno mensaje de exito
        return res.status(200).send("Successful Creation");
    }).catch(err => {
        return res.status(500).send ('Server Error');
    });

    
}

//Funcion de lado del cliente solo para pruebas
function loginClient(req,res){
    var body =req.body;
    var token = jwt.sign(body, config.jwtSecret, {
        expiresIn: config.tokenExpireTime
    });
    
    return res.status(200).send({success: true, token: token}); 

}