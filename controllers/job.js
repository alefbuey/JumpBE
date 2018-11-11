const {Job,EmployeeJob,JobStaff} = require('../models/jobModel');
const {User,Employer} = require('../models/userModel');
const config =  require('../config/config');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');
const sequelize = require('../config/dbJump');
const {zip} = require('../extra/functional');
const {zipwith} = require("zipwith");

module.exports={
    selectJob: selectJob,
    createJob: createJob,
    deleteJob: deleteJob,
    updateJob: updateJob,
    selectJobsByStateEmployer: selectJobsByStateEmployer,
    selectJobsByStateEmployee: selectJobsByStateEmployee,
    selectJobsByTime: selectJobsByTime,
    createJobStaff: createJobStaff,
    applyingToJob: applyingToJob,
    changeStateEmployeeJob: changeStateEmployeeJob,
    getApplyingJobs: getApplyingJobs,
    getAcceptedJobs: getAcceptedJobs
}



//Crear un trabajo
function createJob(req,res,next){
    body = req.body;
    Job.create(body).then(()=>{
        return res.status(200).send({status: 'success'});

    });
}

function createJobStaff(req,res,next){
    body = req.body;
    body.image = req.file.path

    JobStaff.create(body).then(() =>{
        return res.status(200).send("Successful Creation");
    }).catch(err => {
        return res.status(500).send ('Server Error in createJobStaff');
    });
}

//Mostrar informacion de trabajo fisico
function selectJob(req,res,next){
    idjob = req.params.idjob
    jobmode = req.params.jobmode
    //body = req.body; //el token entrante tendra informacion acerca del idusuario, idtrabajo
    if(jobmode == "fisico"){
        Job.findOne({
            where:{
                id: idjob
            },         
            include: [{
                model: JobStaff,
                required: true
            }]
        }).then(job =>{
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
            return res.status(500).send ('Server Error in Select Job');
        });
    }else{
        Job.findOne({
            where:{
                id: idjob
            }
        }).then(job =>{
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
            return res.status(500).send ('Server Error in Select Job');
        });
    }
}

//Borrar un trabajo //Como deberiamos abordarlo? Preguntar?
function deleteJob(req,res,next){

}

//Actualizar un trabajo
function updateJob(req,res){
    body = req.body;    //dos secciones del cuerpo una con el id y la otros los datos a editar
    datos = body.updateData;

    Job.update(datos,{where:{id: body.id}}).then(()=>{
        return res.status(200).send("Successful Update");
    }).catch(err => {
        return res.status(500).send ('Server Error Updated Job');
    });

}

//FEED
//Podria hacerlo en una sentencia sql, tomarlo en cuenta
function selectJobsByTime(req,res,next){
    idUser = req.params.idUser;
    //Siempre necesito enviar un dato de confirmacion para actualizar la informacion

    var sql = 'SELECT us.*, us.id as idemployer, j.*,j.id as idjob FROM jobs as j INNER JOIN userjumps as us ON (j.idemployer = us.id) and (us.id <> ?) ORDER BY "j"."updatedAt" DESC LIMIT 10';
    sequelize.query(sql,
        { replacements: [idUser], type: sequelize.QueryTypes.SELECT}).then(usersjobs=>{
        if(!usersjobs){
            return res.status(404).send ('UsersJobs not found');
        }
        
              //Para cargar la info del trabajo una vez de click
        data = usersjobs.map(uj =>        block = {
            idemployer: uj.idemployer,    //Para cargar el perfil del empleado una vez de click
            idjob: uj.idjob,        //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            imageEmployer: uj.image,
            nameEmploye: uj.name + " " + uj.lastname,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            numbervacancies: uj.numbervacancies
        } )

        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error with Jobs In Course');
    }); 
}

//APLICAR A UN TRABAJO

function applyingToJob(req,res,next){
    body = req.body;

    EmployeeJob.create(body).then(()=>{
        return res.status(200).send("Successful Applying");
    })

} 

//ACEPTADO EN EL TRABAJO Y TERMINANDO TRABAJO

function changeStateEmployeeJob(req,res,next){
    body = req.body;
    EmployeeJob.update(
        body,
        {where: 
            {idemployee: body.idemployee, 
                idjob: body.idjob}
            }).then(()=>{
                return res.status(200).send("Succesfull Chage State of EmployeeJob")
            })

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
//APPLYING

function getApplyingJobs(req,res,next){
    idUser = req.params.idUser;
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

        data = Applyingjobs.map(uj =>        block = {
            idemployer: uj.id,    //Para cargar el perfil del empleado una vez de click
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            // imageEmployer: uj.image,
            // nameEmploye: uj.name + " " + uj.lastname,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            numbervacancies: uj.numbervacancies
        } )

        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error with Applying Jobs');
    });

}

//WORKING
function getAcceptedJobs(req,res,next){
    idUser = req.params.idUser;
    Job.findAll({
        limit: 10,
        include: [{
            model: EmployeeJob,
            where:{idemployee: idUser, state: "2"},
            required: true
        }],
        order: [ [ 'updatedAt', 'DESC' ]]
    }).then(WorkingJobs=>{
        if (!WorkingJobs){
            return res.status(404).send (' Working Jobs not found');
        }

        data = WorkingJobs.map(uj =>        block = {
            idemployer: uj.id,    //Para cargar el perfil del empleado una vez de click
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            // imageEmployer: uj.image,
            // nameEmploye: uj.name + " " + uj.lastname,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateend: uj.dateend,
        } )

        console.log(data);
        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error with Working Jobs');
    });
}


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

