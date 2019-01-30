
/*
SERVER.JS
Set up your application and run it.
*/

//Get the express-framework for Node.js to built our server.
var express = require('express');
var child_process = require('child_process');
var app = express();
var bodyParser = require('body-parser');
//Install the HTTP module.
var http = require('http');



//Path to the .bat file required to run the fuseki server locally (portno. 3030).
//var batpath = require.resolve('./apache-jena-fuseki-3.9.0/fuseki-server.bat');
//Port number our webserver will be listening to.
var port = process.env.PORT || 2222;
var path = require('path')


/*
Setup the view engine.
In our 'views' folder we gave files in Embedded JavaScript format.
This is basically a mixture of HTML markup code with Javascript.
Express.js' view engine will translate this code mixture 
in HTML code that will be rendered by the browser
 */
app.set('view engine', 'ejs');

//Listen to the specified port to incoming requests.
app.listen(port);


/*const proxy = require('express-http-proxy')
var apiProxy = proxy('localhost:8080/rdf4j-workbench/repositories/ois4');
app.use('/sparqlProxy', apiProxy)*/




//Call all the parsers you have to use.
app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// add & configure middleware

const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
app.use(session({
    genid: (req) => {
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'supersecretsecret',
    resave: false,
    saveUninitialized: true
  }))

//Specify the static files we will use for the application.
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
//Specify that you're going to use the database ontologies.
app.use('/database', express.static(path.join(__dirname, 'database')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use(express.static('database'))
app.use('/vendor', express.static(path.join(__dirname, 'vendor')));


  



//Run the .bat-file specified by the path.
/*child_process.exec(batpath, function(error, stdout, stderr) {
    console.log(stdout);
});*/

//The specified file on the specified path will handle all our made requests.
require('./app/router.js')(app)
console.log("Server is running on port number: " + port)
