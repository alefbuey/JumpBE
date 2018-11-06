const 
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser');
    

const app = express();
const port = 3000;

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//This eliminates the problem of Cors (Cross-Origin Resource Sharing) (works in front end when doing "ionic serve -l")
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(session({secret: 'sshhhh'}));

app.use('/', require("./routes/api"));

app.listen(port, () => {
    console.log('Server listening on http://localhost:'+port)
})