const {Job} = require('../models/jobModel');
const {Employer} = require('../models/userModel');
const config =  require('../config/config');
const jwt = require('jsonwebtoken');

module.exports={
    selectJob: selectJob,
    createJob: createJob,
    deleteJob: deleteJob,
    updateJob: updateJob

}



//Crear un trabajo
function createJob(req,res,next){
    body = req.body;

    Job.create(body).then(()=>{
        return res.status(200).send("Successful Creation");

    });

}

//Mostrar informacion de trabajo
function selectJob(req,res,next){
    body = req.body; //el token entrante tendra informacion acerca del idusuario, idtrabajo
    Job.findOne({where:{id: body.id /*, idemployer: body.idemployer*/}, raw: true}).then(job =>{
        if (!job){
            return res.status(404).send ('Job not found');
        }
        var token = jwt.sign(job, config.jwtSecret, {
            expiresIn: config.tokenExpireTime
        });
        
        if(config.desarrollo){
            req.body = token;
            next();
        }else{
            return res.status(200).send({success: true, token: token}); 
        }
    }).catch(err => {
        return res.status(500).send ('Server Error');
    });
}

//Borrar un trabajo //Como deberiamos abordarlo? Preguntar?
function deleteJob(req,res,next){

}

//Actualizar un trabajo
function updateJob(req,res){
    body = req.body;    //dos secciones del cuerpo una con el id y la otros los datos a editar
    datos = body.updateData;

    Job.findOne({where:{id: body.id}}).then(job => {

        job.update(datos).then(()=>{
            return res.status(200).send("Successful Creation");
        }).catch(err => {
            return res.status(500).send ('Server Error');
        });

    }).catch(err => {
        return res.status(500).send ('Server Error');
    });
}