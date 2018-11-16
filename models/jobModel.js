const Sequelize = require('sequelize');
const sequelize = require('../config/dbJump');
const {CommentUser} = require('../models/commentModel');

//modelos del trabajo
const Job = sequelize.define('job',{
    id              :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    idemployer      :	Sequelize.INTEGER,	
    mode            :	Sequelize.INTEGER,		
    state           :	{type: Sequelize.INTEGER, defaultValue: 1},		
    idlocation      :	{type: Sequelize.INTEGER, defaultValue: 1},		
    title           :	Sequelize.STRING(100),	
    description     :	Sequelize.STRING(500),	
    jobcost         :	Sequelize.DECIMAL(9,2),	
    jobcostcovered  :	Sequelize.DECIMAL(9,2),
    dateposted      :	{ type: Sequelize.DATE, defaultValue: Sequelize.NOW },	
    datestart       :	Sequelize.DATE,	
    dateend         :	Sequelize.DATE,	
    datepostend     :   Sequelize.DATE,	
    numbervacancies :	Sequelize.INTEGER,
    numbermilestones :  {type: Sequelize.INTEGER, defaultValue: 0},
    principalImage  : {type: Sequelize.STRING, defaultValue: "uploads/jobs/default.png"}
});

const JobState = sequelize.define('jobstate',{
    id      :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    state   :   Sequelize.STRING(30)
});

const JobMode = sequelize.define('jobmode',{
    id      :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    mode    :   Sequelize.STRING(20)
});

const EmployeeState = sequelize.define('employeestate',{
    id          :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    description :   Sequelize.STRING(30)
});

const EmployeeJob = sequelize.define('employeejob',{
    id                  :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    idemployee          :   Sequelize.INTEGER,
    idjob	            :	Sequelize.INTEGER,
    state	            :	{type: Sequelize.INTEGER, defaultValue: 1},
    rankEmployer	    :   Sequelize.DECIMAL(2,1),
    rankEmployee        :	Sequelize.DECIMAL(2,1),
    salary	            :	Sequelize.DECIMAL(9,1),
    counteroffer	    :	Sequelize.DECIMAL(9,1),
    postedreason	    :	{type: Sequelize.TEXT, defaultValue : "Not Specified"},
    counterofferreason	:   {type: Sequelize.STRING(100), defaultValue : "Not Specified"},
    currentMilestone    :   {type: Sequelize.INTEGER, defaultValue: 0},
    position            :   {type: Sequelize.STRING, defaultValue: " Trabajador Principal "}
});

const Milestone = sequelize.define('milestone',{
    id                  :   {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    field               :   {type: Sequelize.STRING}
});

const FavoriteJob = sequelize.define('favoritejob',{
    idemployee          :   {type: Sequelize.INTEGER, primaryKey: true},
    idjob	            :	{type: Sequelize.INTEGER, primaryKey: true},
});

const JobStaff = sequelize.define('jobstaff',{
    idimage     : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    image       : Sequelize.STRING, //para guardar las imagenes
    idjob       : Sequelize.INTEGER
});

//Relaciones
JobMode.hasMany(Job,{foreignKey: 'mode'});
JobState.hasMany(Job,{foreignKey: 'state'});
EmployeeState.hasMany(EmployeeJob,{foreignKey: 'state'});
Job.hasMany(EmployeeJob,{foreignKey: 'idjob'});
Job.hasMany(FavoriteJob,{foreignKey: 'idjob'})
Job.hasMany(JobStaff,{foreignKey: "idjob"});
Job.hasMany(CommentUser,{foreignKey: "idjob"});
EmployeeJob.hasMany(Milestone,{foreignKey: "id"});

module.exports = {
    Job: Job,
    JobState: JobState,
    JobMode: JobMode,
    EmployeeState: EmployeeState,
    EmployeeJob: EmployeeJob,
    FavoriteJob: FavoriteJob,
    JobStaff: JobStaff
}



