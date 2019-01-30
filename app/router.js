/*
This module contains all the GET, POST, PUT procedures
to answer to the requests of the user.
*/


module.exports = function (app) {



    //Import the modules we will be using
    var ontology = require('./ontology')
    var database = require('./database')

    // use sessions to be able to access username everywhere
    const uuid = require('uuid/v4')
    const session = require('express-session')

    // used for proxying
    const request = require('request');
    const requestPromise = require("request-promise");

    var express = require("express");

    // We import the Datamuse package
    // It will allow us to query for synonyms as to get more precise search results.
    var datamuse = require('datamuse');

    var queryResult = "";
    var queryResult2 = "";
    var update1 = 0;
    var update2 = 0;

    /*
    Functions
    Debuggers, query string constructors,...
    */

    /*
    POST Methods: will put something in the back-end database.
    */
    //Register the user and go to his profile.
    //This version of the registration function uses the SQL database.
    app.post('/regAccountSQL', function (req, res) {
        //Get the necessary info out of your HTML page body.
        var username = req.body.usernamesignup
        var email = req.body.emailsignup
        var weight = req.body.weightsignup
        var height = req.body.heightsignup
        var age = req.body.agesignup
        var sex = req.body.sexsignup
        var password = req.body.passwordsignup

        console.log("username: ", username)
        database.getUser(username, function (result) {
            console.log("result search: ", result)
            if (result.length > 0) {
                console.log("username already in use.")
                console.log("result: ")
                console.log(result)
                // Some problems with giving values for embedded elements.
                res.render('index', { notifications: "The chosen username is already in use." })
            }
            else {
                console.log("we got here: we register the user.")
                //registerUser(username, email, password)
                //This procedure adds a new user to the SQL database.
                database.addUser(username, email, password, weight, height, age, sex)
                req.session.user = {
                    username: username,
                    email: email,
                    weight: weight,
                    height: height,
                    age: age,
                    sex: sex,
                }
                res.redirect('account')
            }
        })

    })


    //Make sure we can summon the printContent function.
    //Debugger: will have to get removed.
    app.post("/showUsers", function (req, res) {
        printContent();
    })

    //Log in the user.
    app.post("/logAccountSQL", function (req, res) {
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password

        //String to query the SQL database on the given username.
        var queryString = `SELECT * FROM Users WHERE  username = '${username}' WHERE password = ${password}`
        //We're gonna check that the username isn't in use yet.
        database.getUser(username, function (result) {
            if (result.length > 0) {
                req.session.user = result[0];
                res.redirect('account');
            } else {
                //We didn't find anything.
                res.render('index', { notifications: "Account not found. Please register." })
            }
        })
    })

    




    /*
   GET Methods: get a resource.
   */

    //This get-method has a parameter number that indicates which collection we have to query.
    //Reference:  https://stackoverflow.com/questions/48674059/how-do-you-get-javascript-promises-to-work-with-node-express-and-display-on-an
    app.get('/query', async function (req, res) {
        //Get the parameters
        var queryType = req.param("queryType");
        var symptom = req.param("symptom");
        var promises = [];
        console.log("symptom: ", symptom);
        console.log("query started")
        //QueryType 1: query tsymptomhe symptoms ontology based on search keys. 
        if (queryType == 1) {
            var result = await ontology.querySymptoms(symptom);
            queryResult = result;
            update1 = 1;

            res.send(result);
            console.log("result sent")
        }

        //QueryType 2: query the diseases ontology based on a list of found symptoms.
        else if (queryType == 2) {
            console.log("querytype 2")
            //var ourQuery = makeDiseaseQuery(symptom);
            var result = await ontology.queryDiseases(symptom);
            queryResult2 = result;
            update2 = 1;
            res.send(result);
            console.log("result diseases sent")
        }

        else console.log("Not implemented (yet)")

    })
    //This method gets all the symptoms of our entology.
    //The next step would be to make a more flexible version that takes parameters
    app.get('/getAllSymptoms', function (req, res) {
        queryResult = ontology.fetchTest();
        console.log("value of test variable")
        console.log(queryResult);
    })

    app.get('/loadDetails/:username/:id', function (req, res) {
        //Get the parameters
        var user = req.params.username
        var diseaseID = decodeURIComponent(req.params.id)

        console.log("/loadDetails, diseaseID: ", diseaseID)
        //When generating the page, the necessary will be done.
        res.render('details', { username: user, diseaseName: "syfilis", diseaseID: diseaseID });
    })

    function respondWithResultofSQLQuery(query, res) {
        database.queryMySQL(query, function (result) {
            //console.log("/queryMySQL query: ", result)
            res.send(result)
        })
    }



    //This method gets a generic query and will apply it on the MySQL database.
    app.get('/queryMySQL', function (req, res) {
        var query = req.param("query")
        respondWithResultofSQLQuery(query, res);
    })

    var temporary

    async function bind(result) {
        temporary = result
    }

    app.get('/getDiseases', function (req, res) {
        var username = req.param("username")
        //Debugger
        let resultdata;
        database.getUserDiseases(username, bind)

        //Debugger
        console.log("resultdata: ", temporary)
        res.send(temporary)
    })



    app.get('/update', function (req, res) {
        var queryType = req.param("queryType");

        if (queryType == 1 && update1 == 1) {
            console.log("result type 1: ", queryResult)
            res.send(queryResult)
            update1 = 0
        } else if (queryType == 2 && update2 == 1) {
            console.log("result type 2: ", queryResult2)
            res.send(queryResult2)
            update2 = 0
        } else {
            res.send([])
        }
    })

    app.get('/getDiseaseInfo', async function (req, res) {
        var query = req.param("query")
        var result = await ontology.searchDiseases(query)
        queryResult3 = result;
        //Debugger
        res.send(result)
    })

    //Get the diagnosis page.
    app.get('/diagnosis', function (req, res) {
        var user = req.param("username");
        //Debugger
        console.log("found user : ", user)
        res.render('diagnosis', { username: user });
    })

    //Test for Datamuse
    app.get('/test', function (req, res) {
        console.log("find tinea manuum")
        var res = ontology.querySymptomsofDisease('tinea manuum')
        console.log("resilt TM: ", res)
    })

    //This GET-method gets activated every time you open the website.
    //The default index webpage will be rendered.
    app.get('/', function (req, res) {
        res.render('index', { notifications: "" })
    })

    app.get('/sparql', function (req, res) {
        res.render('sparql', { notifications: "" })
    })

    app.get('/diagnostic', function (req, res) {
        res.render('diagnostic', { user: req.session.user })
    })

    

    app.post('/symptomsQuery', function (req, res) {
        console.log(req.body.symptom);
        req.body.query = ontology.makeSymptomQuery(req.body.symptom);
        makeSparqlQuery(req, res, DOID_SYMP_ENDPOINT);
    })

    function getArrayParameter(req, paramName) {
        var result = req.body[`${paramName}[]`];
        if (typeof result === 'string') {
            return [result];
        } else {
            return result;
        }

    }

    

    const DEFAULT_ENDPOINT = 'fed'; // doid + symp + our ontology (some request fail here)
    const DOID_SYMP_ENDPOINT = 'feddoidsymp'; // doid + symp (hassymptom request work here)
    const OIS_ENDPOINT = 'ois'; // ois endpoint 

    function getEndpoint(endpoint) {
        if (endpoint) {
            return `http://localhost:8080/rdf4j-workbench/repositories/${endpoint}/query`
        } else {
            return `http://localhost:8080/rdf4j-workbench/repositories/${DEFAULT_ENDPOINT}/query`
        }

    }

    function makeSparqlQuery(req, res, endpoint, inference) {
        let url = getEndpoint(endpoint);

        if (inference) {
            req.body.infer = true;
        } else {
            req.body.infer = false;
        }
        
        req.body.format = "application/sparql-results+json"
        var a = request({
            url: url,
            qs: req.body,
            headers: {
                'Accept': "application/sparql-results+json"
            },
        },
            function (err, response, body) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(body);
                res.send(body);
            }
        );
    }

    function getSparqlResult(req, res, endpoint) {
        let url = getEndpoint(endpoint);

        req.body.infer = true;
        req.body.format = "application/sparql-results+json"
        return requestPromise({
            url: url,
            qs: req.body,
            headers: {
                'Accept': "application/sparql-results+json"
            },
        });
    }

    /**
     * This took me a long time to get right, change carefully
     * Uses the federation with all 3 ontologies
     */
    app.use('/sparqlProxy', function (req, res) {
        makeSparqlQuery(req, res);
    })

    /**
     * This took me a long time to get right, change carefully
     * Uses the federation with the two external ontologies 
     * (some request only work with this, due to bugs in the RDF4J federation store)
     */
    app.use('/sparqlProxyExternalOntologies', function (req, res) {
        makeSparqlQuery(req, res, DOID_SYMP_ENDPOINT);
    })

    /**
     * This took me a long time to get right, change carefully
     * Uses the repository with our ontology
     * (some request only work with this, due to bugs in the RDF4J federation store)
     */
    app.use('/sparqlProxyOurOntology', function (req, res) {
        makeSparqlQuery(req, res, OIS_ENDPOINT, true);
    })

    app.post('/getDiseaseInformation', function (req, res) {
        var diseaseID = req.param("disease")
        //Debugger
        console.log("req.body.disease: ", diseaseID)
        req.body.query = ontology.makeDiseaseIDQuery(diseaseID);
        makeSparqlQuery(req, res, DEFAULT_ENDPOINT);
    })


    app.post('/saveSymptom', function (req, res) {
        console.log(req.body.username, req.body.symptomID, req.body.symptomName)
        database.saveSymptom(req.body.username, req.body.symptomID, req.body.symptomName);
    })

    app.post('/saveDisease', function (req, res) {
        console.log(req.body.username, req.body.diseaseID, req.body.diseaseName);
        database.saveDisease(req.body.username, req.body.diseaseID, req.body.diseaseName);
    })

    app.post('/removeSymptomFromUser', function (req, res) {
        console.log("hey");
        database.removeUserSymptom(req.body.username, req.body.symptomID);
    })

    app.post('/removeDiseaseFromUser', function (req, res) {
        database.removeUserDisease(req.body.username, req.body.diseaseID);
    })

   

    app.post('/diagnosticQuery', async function (req, res) {
        var symptomNames = getArrayParameter(req, "symptomNames");
        console.log(symptomNames);
        req.body.query = ontology.makeAllLinkedDiseasesQuery(symptomNames);
        let linkedDiseases = JSON.parse(await getSparqlResult(req, res, DOID_SYMP_ENDPOINT));

        req.body.query = ontology.makeDiseasesLinkedToAllSymptomsQuery(symptomNames);
        let diseases = JSON.parse(await getSparqlResult(req, res, DOID_SYMP_ENDPOINT));
        console.log(linkedDiseases);
        console.log(diseases);

        res.send({
            "linkedDiseases": linkedDiseases,
            "diseases": diseases
        })
    })

    app.get('/account', async function (req, res) {
        if (req.session.user) {
            
            console.log(req.session.user);
            let username = req.session.user.username;
            req.body.query = ontology.makeUserDiseasesQuery(username);
            let diseases = JSON.parse(await getSparqlResult(req, res, OIS_ENDPOINT));

            req.body.query = ontology.makeUserSymptomsQuery(username);
            let symptoms = JSON.parse(await getSparqlResult(req, res, OIS_ENDPOINT));

            res.render('account', {
                "user": req.session.user,
                "symptoms": symptoms.results.bindings,
                "diseases": diseases.results.bindings,
            })
        } else {
            res.redirect('/')
        }
    })

    app.get('/details2/:diseaseName', async function (req, res) {
        var diseaseName = decodeURIComponent(req.params.diseaseName);
        console.log(diseaseName);

        req.body.query = await ontology.makeMedicinePharmacyQuery(diseaseName);
        let infos = JSON.parse(await getSparqlResult(req, res, OIS_ENDPOINT));
        console.log(infos);

        res.render('details2', { 
            user: req.session.user,
            diseaseName: diseaseName,
            infos: infos.results.bindings
        })
    })








}