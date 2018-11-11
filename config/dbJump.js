const Sequelize = require('sequelize');

//Inicio una conexion a la base de datos con sequelize
const sequelize = new Sequelize('Jump2', 'postgres', '1234', {
    dialect: 'postgres'
  });

//Sincornizar con la base de datos
sequelize.sync({force: true})

module.exports = sequelize;