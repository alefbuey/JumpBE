const {User} = require('../models/userModel');
const config =  require('../config/config');
var fs = require('fs');
const {zipwith} = require("zipwith");
const {Op} = require('sequelize');
const {concat} = require('../extra/functional')
const {EmployeeJob,Job} = require('../models/jobModel')
const {CommentUser} = require('../models/commentModel')
const sequelize = require('../config/dbJump');

module.exports={
    selectUserById: selectUserById,
    updateUserById: updateUserById,
    addUsersToJobs: addUsersToJobs,
    savePayment: savePayment,
    saveComment: saveComment,
    saveRank: saveRank

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

        data = jobs.map(job=>concat(job,users.find(us =>{
            if(us.id == job.idemployer){
                return us
            }
        })))

        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error in addUsersToJobs');
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

function savePayment(req,res,next){
    salary = req.body.salary;
    iduser = req.body.idemployee;
    idJob = req.body.idjob;
    User.update({availablemoney: sequelize.literal('availablemoney + ' + salary.toString())},{where: {id: iduser}}).then(()=>{
        EmployeeJob.update({state: 3},{where: {idemployee: iduser, idjob: idJob}}).then(()=>{
            Job.update({state: 4},{where:{id:idJob}}).then(()=>{
                return res.status(200).send({status: 'success'});
            }).catch(err => {
                return res.status(500).send ('Server Error in Job Update savePayment');
            });
        }).catch(err => {
            return res.status(500).send ('Server Error in Update savePayment');
        });
    }).catch(err => {
        return res.status(500).send ('Server Error in Update savePayment');
    });
}

function saveComment(req,res,next){
    idJob = req.body.idjob
    idEmployee = req.body.idemployee
    comment = req.body.comment
    toWho = req.body.toWho
    if(toWho == 'employee'){
        updateOrCreate(
            CommentUser,
            {idjob: idJob, idemployee: idEmployee},
            {commentToEmployee: comment, idjob: idJob, idemployee:  idEmployee},
            res
            );
    }else if(toWho == 'employer'){
        updateOrCreate(
            CommentUser,
            {idjob: idJob, idemployee: idEmployee},
            {commentToEmployer: comment, idjob: idJob, idemployee:  idEmployee},
            res
            );
    }

}

function saveRank(req,res,next){
    idJob = req.body.idjob;
    idEmployee = req.body.idemployee;
    payload = req.body.payload;

    EmployeeJob.update(payload,{where:{idjob: idJob, idemployee: idEmployee}}).then(()=>{
        return res.status(200).send({status: 'success'});
    }).catch(err => {
        return res.status(500).send ('Server Error in saveComment');
    });

}

function updateOrCreate(model, where, newItem,res) {
    // First try to find the record
    return model
    .findOne({where: where})
    .then((foundItem) => {
        if (!foundItem) {
            // Item not found, create a new one
            return model
                .create(newItem)
                .then(()=>{
                    return res.status(200).send({status: 'success'});
                })
        }
         // Found an item, update it
        return model
            .update(newItem, {where: where})
            .then(()=>{
                return res.status(200).send({status: 'success'});
            }) ;
    })
}