const pool = require('../config/dbJump');


module.exports = {
    login: login
}

function login(req,res) {
    sess = req.session;
    sess.email=req.body.username;
    sess.password = req.body.password;

    pool.connect(function(err, client, done){
        if(err){
            return console.error('error fetching client from pool', err);	
        }
        var query = "SELECT * FROM userJump WHERE email = $1";
        client.query(query, [sess.email], function(err,result){
            if(err){
                res.send({"msg": "error running query",
                            "error": err});
                return console.log('error running query', err);
            }
            if(result.rowCount == 0){
                res.send({
                    "code":404,
                    "success":"Email does not exists"
                });
                
                return console.log({
                    "code":204,
                    "success":"Email does not exists"
                });
            }else if(result.rows[0].password != sess.password){
                res.send({
                    "code":204,
                    "success":"Email and password do not match"
                });

                return console.log({
                    "code":204,
                    "success":"Email and password do not match"
                });
            }else if (result.rows[0].password == sess.password){
                res.send({"code": 200, "sucess":"Login successful!"});
                return console.log({"code": 200, "sucess":"Login successful!"});
            }else{
                res.send({"code": 404,  "sucess":"Error desconocido"});
                return console.log("Error desconocido");
            }
            done();
        });
    });

}

