const {Job,EmployeeJob,JobMode,JobState,EmployeeState} = require('../models/jobModel');
const {Employer} = require('../models/userModel');
const config =  require('../config/config');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

module.exports={
    selectJob: selectJob,
    createJob: createJob,
    deleteJob: deleteJob,
    updateJob: updateJob,
    selectJobsByStateEmployer: selectJobsByStateEmployer,
    selectJobsByStateEmployee: selectJobsByStateEmployee,
    selectJobsByTime: selectJobsByTime
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
        
        if(config.desarrollo){
            return res.status(200).send(job); 
        }else{
            req.body = job;
            next();
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

//FEED
//Selecionar trabajos de acuerdo al tiempo, los ultimos 10 trabajos
//Actualizar cada cierto tiempo
function selectJobsByTime(req,res,next){
    body = req.body;
    //Siempre necesito enviar un dato de confirmacion para actualizar la informacion
    if(body.actualizar == 'true'){
        Job.findAll({
            limit: 10,
            where : {
                idemployer: {[Op.ne]: body.idUser},
            },
            include: [{
                model: EmployeeJob ,
                required: true
            }],
            order: [ [ 'updatedAt', 'DESC' ]]
        }).then(jobs =>{
            if (!jobs){
                return res.status(404).send ('Jobs not found');
            };

            if(config.desarrollo){
                return res.status(200).send(jobs); 
            }else{
                req.body = jobs;
                next();
            }

        }).catch(err => {
        return res.status(500).send ('Server Error in Feed Jobs');
    });
    }
}

//EMPLEADOR O JEFE
// Trabajos en espera y en curso de acuerdo al estado
// Cada uno muestra los id de los trabajadores asociado
function selectJobsByStateEmployer(req,res,next){
    body = req.body;
    
    //Query de los trabajos posteados
    Job.findAll({
        limit: 10,
        where:{
            idemployer: body.id, state: "1"
        },
        include: [{
            model: EmployeeJob ,
            required: true
        }],
            order: [ [ 'updatedAt', 'DESC' ]]
    }).then(jobsPosted =>{
        if (!jobsPosted){
            return res.status(404).send ('Posted Jobs not found');
        }

        //Query de los trabajos en curso
        Job.findAll({
            limit: 10,
            where:{
                idemployer: body.id, state: "3"
            },
            include: [{
                model: EmployeeJob ,
                required: true
            }],
            order: [ [ 'updatedAt', 'DESC' ]]
        }).then(jobsInCourse =>{
            if (!jobsInCourse){
                return res.status(404).send ('Jobs In Course not found');
            }

            var data = { 
                jobsPosted : jobsPosted,
                jobsInCourse : jobsInCourse
            }

            if(config.desarrollo){
                return res.status(200).send(data); 
            }else{
                req.body = data;
                next();
            }

        }).catch(err => {
            return res.status(500).send ('Server Error with Jobs In Course');
        });

    }).catch(err => {
        return res.status(500).send ('Server Error with Poste Jobs');
    });
}

//EMPLEADO
// Trabjo aplicado y en curso
// Cada uno muestra los id de los trabajadores asociado
function selectJobsByStateEmployee(req,res,next){
    body = req.body;

    //Query de los trabajos en estado applying
    Job.findAll({
        limit: 10,
        include: [{
            model: EmployeeJob,
            where:{idemployee: body.id, state: "1"},
            required: true
        }],
        order: [ [ 'updatedAt', 'DESC' ]]
    }).then(Applyingjobs=>{
        if (!Applyingjobs){
            return res.status(404).send (' Applying Jobs not found');
        }

        //Query anidada de los trabajos en estado working
        Job.findAll({
            limit: 10,
            include: [{
                model: EmployeeJob,
                where:{idemployee: body.id, state: "2"},
                required: true
            }],
            order: [ [ 'updatedAt', 'DESC' ]]
        }).then(WorkingJobs=>{
            if (!WorkingJobs){
                return res.status(404).send (' Working Jobs not found');
            }
    
            var data = {
                Applyingjobs: Applyingjobs,
                WorkingJobs: WorkingJobs
            }

            if(config.desarrollo){
                return res.status(200).send(data); 
            }else{
                req.body = data;
                next();
            }

        }).catch(err => {
            return res.status(500).send ('Server Error with Working Jobs');
        });

    }).catch(err => {
        return res.status(500).send ('Server Error with Applying Jobs');
    });
}


