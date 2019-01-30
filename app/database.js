/*
database.js
The functionalities: querying the database. 

TODO: querying our own ontologies made for this project, mapping SPARQL-queries on our SQL-database.
After some discussion about what to do for our SPARQL endpoint,
we have decided to use a MYSQL database that maps SPARQL queries on it.
*/



var mySql = require('mysql')
var params = require('./params')

//Establish a connection with our database (mydb).
var con = mySql.createConnection(params.DBParams)

//Establish a connection with your database.
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  //con.query("SELECT * FROM Users", function(err, result, fields){
  // if (err) throw err;
  //  console.log(result);
  //})
});

con.on('error', function(err) {
  console.log("[mysql error]",err);
});


/*Queries*/
var user = 'INSERT INTO users VALUES("fred", "chome.arthur@gmail.com", "xd", 22, 160, 33, "Male")'

function showUsers() {
  //Connect to them database
  //con.connect(function(err) {
  //if (err) throw err;
  //console.log("Connected!");
  con.query("SELECT * FROM Users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  })
  //});
}

//Lower level function who does all the querying on our SQL server.
function queryMySQL(query, callback) {
  console.log(query);
  con.query(query, function (err, result, fields) {
    console.log("queryMySQL")
    if (err) throw err;
    if (callback) {
      return callback(result);
    }

  })
}

//Second prototype
function queryMySQL2(query, response) {
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    response.send(result)
  })
}

//Second prototype
async function queryMySQL3(query, callback) {
  con.query(query, async function (err, result, fields) {
    if (err) throw err;
    callback(result)
  })
}


//Find a user with a specific username.
function findUser(username) {
  var queryString = 'SELECT * FROM Users WHERE  username = "' + username + '"'
  var searchResult;
  //We're using a callback to get back our search result.
  queryMySQL(queryString, function (result) {
    searchResult = result
  })
  return searchResult;
}

function findUser2(username, response) {
  console.log("findUser2 called")
  var queryString = 'SELECT * FROM Users WHERE  username = "' + username + '"'
  //We're using a callback to get back our search result.
  queryMySQL2(queryString, response)
}


/*
    MYSQL Queries
    The set of following methods used MySQL queries and the MYSQL database.
    */


//This function will add a user to our SQL database.  
function addUser(username, email, password, weight, height, age, sex) {
  // TODO: Do this with prepared statements (tres facile de delete la DB en choisissant
  // un nom d'utilisateur spécial (voir SQL injection))
  var addUserString = 'INSERT INTO Users VALUES("' + username + '", "' + email + '", "'
    + password + '", "' + weight + '", "' + height + '", "' + age + '", "' + sex + '")';
  queryMySQL(addUserString)
}

//Add a hasDisease relationship between a specific user(name) and a disease(ID)
function addUserHasDisease(username, diseaseID) {
  // TODO: Do this with prepared statements (tres facile de delete la DB en choisissant
  // un nom d'utilisateur spécial (voir SQL injection))
  var userHasDiseaseString = 'INSERT INTO hasDiseases VALUES("' + username + '", "' + diseaseID + '")'
  //We could change the model to have a table of drugs/antibiotics designed to treat a disease.
  //But where are we going to get all those treatments from?
  queryMySQL(userHasDiseaseString)
}


function getUser(username, callback) {
   var queryString = 'SELECT * FROM Users WHERE  username = "' + username + '"';
    //We're gonna check that the username isn't in use yet.
    queryMySQL(queryString, function (result) {
      callback(result);
      
  })
}

function getUserDiseases(username, callback) {
  var query = `SELECT * FROM hasDiseases WHERE username = '${username}'`;
  queryMySQL(query, callback)
}

/* Insert */

function saveDisease(username, diseaseID, diseaseName) {
  var query = `
  INSERT IGNORE INTO Diseases VALUES ('${diseaseID}', '${diseaseName}');
  INSERT INTO hasDiseases VALUES ('${username}', '${diseaseID}');
  `;
  queryMySQL(query)
}

function saveSymptom(username, symptomID, symptomName) {
  
  var query = `
  INSERT IGNORE INTO Symptoms VALUES ('${symptomID}', '${symptomName}');
  INSERT IGNORE INTO Reports VALUES ('${username}', 10, '${symptomID}'); `;
  queryMySQL(query)
}

function removeUserDisease(username, diseaseID) {
  var query = `DELETE FROM hasDiseases WHERE username = '${username}' AND diseaseID = '${diseaseID}';`;
  queryMySQL(query)
}

function removeUserSymptom(username, symptomID) {
  var query = `DELETE FROM Reports WHERE username = '${username}' AND symptomID = '${symptomID}';`;
  queryMySQL(query)
}


module.exports = { addUser, findUser, findUser2, queryMySQL, 
  addUserHasDisease, getUser, getUserDiseases, saveSymptom, saveDisease,
 removeUserDisease, removeUserSymptom }