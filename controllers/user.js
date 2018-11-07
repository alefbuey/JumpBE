const {User,UserStaff} = require('../models/userModel');
const config =  require('../config/config');
var fs = require('fs');

module.exports={
    selectUserById: selectUserById,
    updateUserById: updateUserById,
    updateUserStaffById: updateUserStaffById
}

//Seleccionar un usuario por id
//Para los PERFILES DE UN USUARIO Y PARA EL PROPIO PERFIL
function selectUserById(req,res,next){
    var body = req.body;
    User.findOne({
        where:{
            id: body.idUser
        },
        include: [{
            model: UserStaff ,
            required: true
        }]
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
    User.update(user,{where:{id: user.id}}).then(()=>{
        return res.status(200).send("Successful Update");
    }).catch(err => {
        return res.status(500).send ('Server Error in Update UserJump');
    });
}

function updateUserStaffById(req,res,next){
    console.log(req.file);
    body = req.body;
    body.image = req.file.path

    UserStaff.update(body,{where:{iduser: body.iduser}}).then(() =>{
        return res.status(200).send("Successful Update");
    }).catch(err => {
        return res.status(500).send ('Server Error in Update UserStaff');
    });
}

// function up

// function pruebaImagen(req,res,next){
//     body = req.body
//     console.log(body.file)
//     // UserStaff.update(body,{where:{idusers: "1"}}).then(() =>{
//     //     fs.writeFileSync('/path/to/file', body.image);
//     // }).catch(err => {
//     //     return res.status(500).send ('Server Error in Update UserStaff');
//     // });
    
//     // UserStaff.findOne({where:{idusers: "1"}}).then(userstaff=>{
//     //     return res.status(200).send(userstaff.image);
//     // }).catch(err => {
//     //     return res.status(500).send ('Server Error in Update UserStaff');
//     // });
// }