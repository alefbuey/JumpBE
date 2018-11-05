const {User,LocationJump} = require('../models/userModel');
const config =  require('../config/config');

module.exports={
    selectUserById: selectUserById
}

//Seleccionar un usuario por id
//Para los PERFILES DE UN USUARIO Y PARA EL PROPIO PERFIL
function selectUserById(req,res,next){
    var body = req.body;
    User.findOne({
        where:{
            id: body.idUser
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