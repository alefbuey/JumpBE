module.exports = {
    //Configuraciones para el token y la encriptacion del password con bcrypt
    saltRounds: 2,
    //clave secretea para encriptar los tokens
    //agregar a una variable de entorno es más seguro
    jwtSecret: '7777sh',
    tokenExpireTime: '24h',
    desarrollo: true //desarrollo o comercio
}