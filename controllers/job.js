const {Job,EmployeeJob,JobStaff, FavoriteJob} = require('../models/jobModel');
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
    selectJobsByTime: selectJobsByTime,
    createJobStaff: createJobStaff,
    applyingToJob: applyingToJob,
    getApplyingJobs: getApplyingJobs,
    getAcceptedJobs: getAcceptedJobs,
    getAcceptedBusiness: getAcceptedBusiness,
    getPostedBusiness: getPostedBusiness,
    getJobApplicants: getJobApplicants,
    acceptApplicant: acceptApplicant,
    deleteApplicant: deleteApplicant,
    selectFavoriteJobs: selectFavoriteJobs,
    getJobTeamMembers: getJobTeamMembers,
    addToFavorites: addToFavorites,
    getEmployeeJobStatus: getEmployeeJobStatus

}

//

function getEmployeeJobStatus(req,res,next){
    idjob = req.params.idJob;
    idemployee = req.params.idEmployee;

    EmployeeJob.findOne({where:{
        idjob: idjob,
        idemployee: idemployee
    }}).then(employeeJob =>{
        if (!employeeJob){
            return res.status(404).send ('EmployeeJob EmployeeJob not found');
        }

        User.findOne({where:{id: idemployee}}).then(employee =>{
            if (!employee){
                return res.status(404).send ('EmployeeJob User not found');
            }

            Job.findOne({attributes: ['idemployer','title','numbermilestones']},{where:{id: idjob}}).then(job=>{
                if (!job){
                    return res.status(404).send ('EmployeeJob Job not found');
                }
                User.findOne({where: {id: job.idemployer}}).then(employer=>{
                    data = {
                        idjob: employeeJob.idjob,
                        jobtitle: job.title,
                        idemployee: employeeJob.idemployee,
                        employeeName: employee.name + " " + employee.lastname,
                        employeeImage: employee.image,
                        employeeRank: employee.rank,
                        salary: employeeJob.salary,
                        counteroffer: employeeJob.counteroffer,
                        postedreason: employeeJob.postedreason,
                        counterofferreason: employeeJob.counterofferreason,
                        currentMilestone: employeeJob.currentMilestone,
                        position: employeeJob.position,
                        numbermilestones: job.numbermilestones,
                        idemployer: employer.id,
                        employerName: employer.name+ " "+ employer.lastname,
                        employerImage: employer.image,
                        employerRank: employer.rank,
                    }
        
                    return res.status(200).send(data); 
                })

            }).catch(err => {
                return res.status(500).send ('Server Error in getEmployeeJobStatus');
            });



        }).catch(err => {
            return res.status(500).send ('Server Error in getEmployeeJobStatus');
        });

    }).catch(err => {
        return res.status(500).send ('Server Error in getEmployeeJobStatus');
    });
}

//Aceptar Trabajo
//Cambiar estado en employeeJob del aplicante aceptado
//Cambiar el modo a working del trabajo apenas se acepte uno
//debo recibir idemployee, idjob, state 
//state para usar en aceptado 
//NOTA MENTAL: cuando hay aplicantes y no son aceptados se quedan aplicando jaja corregir eso
function acceptApplicant(req,res,next){
    body = req.body;
    idemployee = body.idemployee
    idjob = body.idjob

    Job.update({state: 2},{where : {id : idjob}}).then(()=>{
        EmployeeJob.update({state: 2},{where :{idemployee : idemployee, idjob: idjob}}).then(()=>{
            return res.status(200).send({status: 'success'});
        }).catch(err => {
            return res.status(500).send ('Server Error in accepted Job');
        });
    }).catch(err => {
        return res.status(500).send ('Server Error in accepted Job');
    });
}

function deleteApplicant(req,res,next){
    body = req.body
    idemployee = body.idemployee
    idjob = body.idjob

    EmployeeJob.destroy({where: {idemployee : idemployee, idjob : idjob}}).then(()=>{
        return res.status(200).send({status: 'success'});
    }).catch(err => {
        return res.status(500).send ('Server Error in deleteApplicant');
    });
}

//Crear un trabajo
function createJob(req,res,next){
    body = req.body;
    Job.create(body).then(()=>{
        return res.status(200).send({status: 'success'});

    }).catch(err => {
        return res.status(500).send ('Server Error in createJob');
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

//APLICAR A UN TRABAJO

function applyingToJob(req,res,next){
    body = req.body;

    EmployeeJob.create(body).then(()=>{
        return res.status(200).send({status: 'success'});
    }).catch(err => {
        return res.status(500).send ('Server Error Apply Job');
    });

} 

function addToFavorites(req,res,next){
    body = req.body;
    FavoriteJob.create(body).then(() => {
        return res.status(200).send({status: 'success'});
    }).catch(err => {
        return res.status(500).send ('Server Error Add Favorite Job');
    });
}

//FEED
//Podria hacerlo en una sentencia sql, tomarlo en cuenta
function selectJobsByTime(req,res,next){
    idUser = req.params.idUser;
    mode = req.params.mode; // Si "feed" entnces cargar el feed, si "fav" carga la de favoritos 
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
            imageJob: uj.principalImage,
            imageEmployer: uj.image,
            nameEmployer: uj.name + " " + uj.lastname,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            numbervacancies: uj.numbervacancies
        } )

        if(mode == "feed"){
            return res.status(200).send(data); 
        }else if (mode == "fav"){
            dataForNext = { 
                idUser: idUser,
                rawJobs: data
            }
            req.body = dataForNext;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error with Jobs In Course');
    }); 
}

function selectFavoriteJobs(req, res, next){
    rawJobs = req.body.rawJobs;
    idUser = req.body.idUser;

    FavoriteJob.findAll({where: {idemployee: idUser}}).then(favJobs => {
        if(!favJobs){
            return res.status(404).send ('FavJobs not found');
        }
        idFavJobs = favJobs.map(favJob => favJob.idjob);
        jobs = rawJobs.filter( rawJob => idFavJobs.includes(rawJob.idjob))
        return res.status(200).send(jobs);
    }).catch(err => {
        return res.status(500).send ('Server Error with Favorite Jobs');
    });
}


//EMPLEADOR O JEFE
// Trabajos en espera y en curso de acuerdo al estado
// Cada uno muestra los id de los trabajadores asociado

//POSTED JEFE 
function getPostedBusiness(req,res,next){
    idUser = req.params.idUser;
    Job.findAll({
        limit: 10,
        where:{
            idemployer: idUser, state: "1"
        },
            order: [ [ 'updatedAt', 'DESC' ]]
    }).then(jobsPosted =>{
        if (!jobsPosted){
            return res.status(404).send ('Posted Jobs not found');
        }

        data = jobsPosted.map(uj =>        block = {
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            dateend: uj.dateend,
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

//WORKING JEFE

function getAcceptedBusiness(req,res,next){
    idUser = req.params.idUser;
    Job.findAll({
        limit: 10,
        where:{
            idemployer: idUser, state: "2"
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

        data = jobsInCourse.map(uj =>        block = {
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            title:  uj.title,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            dateend: uj.dateend,
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
            where:{idemployee: idUser, state: "1"},
            required: true
        }],
        order: [ [ 'updatedAt', 'DESC' ]]
    }).then(Applyingjobs=>{
        if (!Applyingjobs){
            return res.status(404).send (' Applying Jobs not found');
        }
        console.log(Applyingjobs)
        data = Applyingjobs.map(uj =>        block = {
            idemployer: uj.idemployer,    //Para cargar el perfil del empleado una vez de click
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            title:  uj.title,
            imageJob: uj.principalImage,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            dateend: uj.dateend,
            numbervacancies: uj.numbervacancies
        } )
        if(Applyingjobs == ''){
            return res.status(200).send(data)        
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
            idemployer: uj.idemployer,    //Para cargar el perfil del empleado una vez de click
            idjob: uj.id,          //Para cargar la info del trabajo una vez de click
            jobmode: uj.mode,
            title:  uj.title,
            imageJob: uj.principalImage,
            jobcost:    uj.jobcost,
            dateposted: uj.dateposted,
            dateend: uj.dateend,
            numbervacancies: uj.numbervacancies
        } )

        if(WorkingJobs == ''){
            return res.status(200).send(data)        
        }else{   
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ('Server Error with Working Jobs');
    });
}

//
function getJobApplicants(req,res,next){
    idJob = req.params.idJob;
 
    var sql = 'SELECT * FROM userjumps as u INNER JOIN (SELECT * from employeejobs where idjob = ? and state=1) ej ON (u.id = ej.idemployee) ORDER BY "ej"."updatedAt" DESC LIMIT 10'
    sequelize.query(sql,
        { replacements: [idJob], type: sequelize.QueryTypes.SELECT}).then(applicants =>{
        if (!applicants){
            return res.status(404).send ('Applicants not found');
        }

        data = applicants.map(uj =>        block = {
            
            idemployee: uj.id,
            name: uj.name + " " + uj.lastname,
            image: uj.image,
            idjob: uj.idjob,         
            rank: uj.rank,
            salary: uj.salary,
            counteroffer:  uj.counteroffer,
            postedreason:    uj.postedreason,
            counterofferreason:  uj.counterofferreason
        } )

        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ({err, mesg:'Server Error with List of Applicants'});
    });
    
}

//Funcion para obtener los miembros de un equipo de trabajo

function getJobTeamMembers(req,res,next){
    idJob = req.params.idJob;
 
    var sql = 'SELECT * FROM userjumps as u INNER JOIN (SELECT * from employeejobs where idjob = ? and state=2) ej ON (u.id = ej.idemployee) ORDER BY "ej"."updatedAt" DESC LIMIT 10'
    sequelize.query(sql,
        { replacements: [idJob], type: sequelize.QueryTypes.SELECT}).then(applicants =>{
        if (!applicants){
            return res.status(404).send ('Members of Job not found');
        }

        data = applicants.map(uj =>        block = {            
            idemployee: uj.id,
            name: uj.name + " " + uj.lastname,
            image: uj.image,
            idjob: uj.idjob,         
            rank: uj.rank,
            salary: uj.salary,
            counteroffer:  uj.counteroffer,
            postedreason:    uj.postedreason,
            counterofferreason:  uj.counterofferreason
        } )

        if(config.desarrollo){
            return res.status(200).send(data); 
        }else{
            req.body = data;
            next();
        }

    }).catch(err => {
        return res.status(500).send ({err, mesg:'Server Error with getJobTeamMembers'});
    });
    
}