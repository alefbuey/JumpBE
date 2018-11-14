const {User} = require('../models/userModel');
const config =  require('../config/config');
var fs = require('fs');
const {zipwith} = require("zipwith");
const {Op} = require('sequelize');

module.exports={
    selectUserById: selectUserById,
    updateUserById: updateUserById,
    addUsersToJobs: addUsersToJobs
}

//OBTENER LA IMAGEN POR ID

function addUsersToJobs(req,res,next){
    jobs = req.body //array de jobs
    idsEmployers = jobs.map(job => job.idemployer);
    console.log(idsEmployers);

    User.findAll({
        where: {
          id: {
            [Op.or]: idsEmployers
          }
        }
    }).then(users=>{
        if (!users){
            return res.status(404).send (' Image not found');
        }
        data = zipwith((us,jbs)=> block ={
            nameEmployer: us.name + " " + us.lastname,
            imageEmployer : us.image,
            idemployer: jbs.idemployer,    //Para cargar el perfil del empleado una vez de click
            idjob: jbs.idjob,        //Para cargar la info del trabajo una vez de click
            jobmode: jbs.jobmode,
            imageJob: jbs.imageJob,
            title:  jbs.title,
            jobcost:    jbs.jobcost,
            dateposted: jbs.dateposted,
            dateend: jbs.dateend,
            numbervacancies: jbs.numbervacancies
        },users,jobs)
        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error in getImageById');
    });
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
