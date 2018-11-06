const Sequelize = require('sequelize');
const sequelize = require('../config/dbJump');
const {Job, FavoriteJob, EmployeeJob} = require('../models/jobModel');
const {Preference} = require('../models/categoryModel')
  // force: true will drop the table if it already exists
  


const User = sequelize.define('userjumps', {
    id                      : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    idlocation              : Sequelize.INTEGER,
    idstate                 : {type: Sequelize.INTEGER , defaultValue: 1},
    typenationalidentifier  : {type: Sequelize.INTEGER , defaultValue: 1},
    nationalidentifier      : Sequelize.STRING(10),
    name		            : Sequelize.STRING(30),
    lastname	            : Sequelize.STRING(30),
    email                   : {type: Sequelize.STRING(30), unique: true },
    password                : Sequelize.STRING,
    birthdate	            : Sequelize.DATE,
    direction	            : Sequelize.STRING,
    gender                  : Sequelize.STRING(1),
    nationality             : Sequelize.STRING(30),
    availablemoney          : {type: Sequelize.DECIMAL(9, 2), defaultValue: 0.0},
    rank                    : {type: Sequelize.DECIMAL(2, 1), defaultValue: 0.0}

});

const LocationJump = sequelize.define('location',{
    id      : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    country : Sequelize.STRING(30),
    city    : Sequelize.STRING(30)
});

const UserState = sequelize.define('userstate',{
    id      : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    state   : Sequelize.STRING(10)
});

const NationalIdentifierType = sequelize.define('nationalidentifiertype',{
    id          : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    description : Sequelize.STRING(100)
});

const UserStaff = sequelize.define('userstaff',{
    idusers     : {type: Sequelize.INTEGER, primaryKey: true},
    about       : Sequelize.STRING(500),
    image       : Sequelize.BLOB, //para guardar las imagenes
    cellphone   : Sequelize.STRING(20)
});

const Employer = sequelize.define('employer',{
    id                  : {type: Sequelize.INTEGER, primaryKey: true},
    ranking             : {type: Sequelize.DECIMAL(2, 1), defaultValue: 0.0},
    spentamount         : {type: Sequelize.DECIMAL(9, 1), defaultValue: 0.0},
    jobsposted          : {type: Sequelize.INTEGER, defaultValue: 0}
});

const Employee = sequelize.define('employee',{
    id              :  {type: Sequelize.INTEGER, primaryKey: true},
    ranking         :  {type: Sequelize.DECIMAL(2, 1), defaultValue: 0.0},
    numbjobsdone    :  {type: Sequelize.INTEGER, defaultValue: 0}
});

//Sincornizar con la base de datos
//sequelize.sync({force: true})


//Relaciones
LocationJump.hasMany(User,{ foreignKey: 'idlocation'});
LocationJump.hasMany(Job,{foreignKey: 'idlocation'});
UserState.hasMany(User,{foreignKey: 'idstate'});
NationalIdentifierType.hasMany(User,{foreignKey: 'typenationalidentifier'});
User.hasOne(UserStaff,{foreignKey: "iduser"});
User.hasOne(Employer,{ foreignKey: 'id'});
Employer.hasMany(Job,{ foreignKey: 'idemployer'});
User.hasOne(Employee,{foreignKey: "id"});
Employee.hasMany(EmployeeJob,{foreignKey: 'idemployee'});
Employee.hasMany(FavoriteJob,{foreignKey: 'idemployee'});
User.hasMany(Preference,{foreignKey: 'iduser'})



module.exports={
    User: User,
    Employer: Employer,
    Employee: Employee, 
    LocationJump: LocationJump,
    UserState: UserState,
    NationalIdentifierType: NationalIdentifierType,
    UserStaff: UserStaff,
}