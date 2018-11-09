const Sequelize = require('sequelize');
const sequelize = require('../config/dbJump');

//Solo se comenta a los empleados ojo
const CommentUser = sequelize.define("commentUser",{
    id          : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    idjob       : Sequelize.INTEGER,
    iduser      : Sequelize.INTEGER,
    comment     : Sequelize.STRING,
    postedDate  : { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

module.exports = {
    CommentUser: CommentUser
}