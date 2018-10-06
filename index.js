const 
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser');
    

const app = express();
const port = 3000;

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'sshhhh'}));

app.use('/', require("./routes/api"));

app.listen(port, () => {
    console.log('Server listening on http://localhost:'+port)
})