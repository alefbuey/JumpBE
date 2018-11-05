const Sequelize = require('sequelize');
const sequelize = require('../config/dbJump');

const Category = sequelize.define('category',{
    id          : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    nombre      : Sequelize.STRING(30),
    description : Sequelize.STRING(50)
});

const TagJump = sequelize.define('tagjump',{
    id          : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name        : Sequelize.STRING(50),
    description : Sequelize.STRING(100),
    categoryid  : Sequelize.INTEGER
});

const Preference = sequelize.define('preferences',{
    idtag          : {type: Sequelize.INTEGER, primaryKey: true},
    iduser          : {type: Sequelize.INTEGER, primaryKey: true}
});

//Relaciones
Category.hasMany(TagJump,{foreignKey: 'categoryid'});
TagJump.hasMany(Preference,{foreignKey: 'idtag'});


module.exports = {
    Preference : Preference
};