const {User} = require('../models/userModel');
const config =  require('../config/config');
var fs = require('fs');

module.exports={
    selectUserById: selectUserById,
    updateUserById: updateUserById,
}

//Seleccionar un usuario por id
//Para los PERFILES DE UN USUARIO Y PARA EL PROPIO PERFIL
function selectUserById(req,res,next){

    User.findOne({
        where:{
            id: req.params.idUser
        }
    }).then(user=>{
        if (!user){
            return res.status(404).send (' User not found');
        }
        if(config.desarrollo){
            return res.status(200).send(user); 
        }else{
            req.body = user;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error in selectUserById');
    });
}

function updateUserById(req,res,next){
    user = req.body;
    user.image = req.file.path

    User.update(user,{where:{id: user.id}}).then(()=>{
        return res.status(200).send("Successful Update");
    }).catch(err => {
        return res.status(500).send ('Server Error in Update UserJump');
    });
}
