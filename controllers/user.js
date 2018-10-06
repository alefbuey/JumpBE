const pool = require('../config/dbJump');

module.exports={
    registerUser: registerUser

}


function registerUser(req,res){
    body = req.body;
    params = Object.values(body); 
    console.log(params);
    pool.connect(function(err, client, done){
        if(err){
            return console.error('error fetching client from pool', err);	
        }
        var query = "INSERT INTO userjump values (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);";
        client.query(query, params, function(err,result){
            if(err){
                res.send({  "code": 300,
                            "msg": "error running query",
                            "error": err});
                return console.log('error running query', err);
            }
            else{
                res.send({"code": 200,  "sucess":"Registro exitoso"});
                return console.log("Registro exitoso");
            }
            done();
        });
    });
}