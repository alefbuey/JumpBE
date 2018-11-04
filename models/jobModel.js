const Sequelize = require('sequelize');
const sequelize = require('../config/dbJump');

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
    numbervacancies :	Sequelize.INTEGER
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
    idemployee          :   {type: Sequelize.INTEGER, primaryKey: true},
    idjob	            :	{type: Sequelize.INTEGER, primaryKey: true},
    state	            :	{type: Sequelize.INTEGER, defaultValue: 1},
    rankere	            :   Sequelize.DECIMAL(2,1),
    rankeer	            :	Sequelize.DECIMAL(2,1),
    salary	            :	Sequelize.DECIMAL(9,1),
    counteroffer	    :	Sequelize.DECIMAL(2,1),
    postedreason	    :	{type: Sequelize.TEXT, defaultValue : "Not Specified"},
    counterofferreason	:   {type: Sequelize.STRING(100), defaultValue : "Not Specified"}
});

const FavoriteJob = sequelize.define('favoritejob',{
    idemployee          :   {type: Sequelize.INTEGER, primaryKey: true},
    idjob	            :	{type: Sequelize.INTEGER, primaryKey: true},
});

//Relaciones
JobMode.hasMany(Job,{foreignKey: 'mode'});
JobState.hasMany(Job,{foreignKey: 'state'});
EmployeeState.hasMany(EmployeeJob,{foreignKey: 'state'});
Job.hasMany(EmployeeJob,{foreignKey: 'idjob'});
Job.hasMany(FavoriteJob,{foreignKey: 'idjob'})


module.exports = {
    Job: Job,
    JobState: JobState,
    JobMode: JobMode,
    EmployeeState: EmployeeState,
    EmployeeJob: EmployeeJob,
    FavoriteJob: FavoriteJob
}



