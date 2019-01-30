/*
apache.js
This file contains all functions and tools to work with the JENA APACHE FUSEKI server.
It is a SPARQL server that runs on our own device (has to be started manually).
This file contains all the tools to query our ontologies
*/

//Import SPARQL client for Node.js: will allow us to query the Jena Fuseki Server.
var SparqlClient = require('sparql-client-2');


//We import the Datamuse package
//It will allow us to query for synonyms as to get more precise search results.
var datamuse = require('datamuse');


//URL's for the symptoms and diseases ontology.
//Note: the server is actually hosted on our own device, portnumber 3030.
var symptomsURL = 'http://localhost:8080/rdf4j-workbench/repositories/fed';
var diseasesURL = 'http://localhost:8080/rdf4j-workbench/repositories/fed';
var ontologyURL = 'http://localhost:8080/rdf4j-workbench/repositories/fed';

var symptomClient = new SparqlClient(symptomsURL)
var diseaseClient = new SparqlClient(diseasesURL)
var sparqlClient = new SparqlClient(diseasesURL)



//Never gets used.
var symptomQueryPart1Alternate = ' SELECT ?name ?description'
    + 'WHERE {?subject rdfs:label ?name. FILTER(?name IN (';

var symptomQueryPart2Alternate = ' )). ?subject obo:IAO_0000115 ?description.}';

//Strings for makeDiseaseQuery2: should give back disease ID's.
var diseaseQueryPart1 = 'SELECT ?disease ?description ?id WHERE{?something obo:IAO_0000115 ?description. FILTER regex(?description, "has_symptom").'
var diseaseQueryPart2 = ' ?something rdfs:label ?disease.  ?something oboInOwl:id ?id  } LIMIT 15'

var findDiseaseIDQueryPart1 = 'SELECT ?disease ?description WHERE{ ?something obo:IAO_0000115 ?description. FILTER regex(?description, "has_symptom"). ?something rdfs:label ?disease.  ?something oboInOwl:id "'
var findDiseaseIDQueryPart2 = '". } LIMIT 15'

function makeDiseaseIDQuery(diseaseID) {
    return findDiseaseIDQueryPart1 + diseaseID + findDiseaseIDQueryPart2;
}

//The previous procedure just gave back diseases with descriptions:
//Next step: give back diseases with descriptions AND ID's.
function makeDiseaseQuery(symptomList) {
    var arrayLength = symptomList.length
    console.log("length of symptomslist: ", arrayLength);
    console.log("symptomlist: ", symptomList)
    var query = prefixes + diseaseQueryPart1;
    for (var i = 0; i < arrayLength; i++) {
        console.log("for loop activated")
        var thesymptom = symptomList[i].toLowerCase();
        query = query + ' FILTER regex(?description,' + ' "' + thesymptom + '" ' + ').';
    }
    return query + diseaseQueryPart2;
}



// Query the symptoms using the diseases client.
async function queryDiseases(symptom) {
    var ourQuery = makeDiseaseQuery(symptom);
    console.log("quer disease: ", ourQuery)
    let result = await queryClient(diseaseClient, ourQuery);
    return result;
}

//For when you want to query the disease ontologies with a pre-made query (more flexible)
async function searchDiseases(query) {
    let result = await queryClient(diseaseClient, query)
    return result;
}

/**
 * Query information:
 * obo:IAO_0000115: represent the "description" data property
 */

// Query the diseases for the symptoms of a specific disease. 
async function querySymptomsofDisease(disease) {
    var query = prefixes + `
    SELECT ?description  
    WHERE{
        ?subject obo:IAO_0000115 ?description. 
        FILTER regex(?description, "has_symptom"). 
        ?subject rdfs:label ?disease.
        ?subject rdfs:label "` + disease + "}";
    var result = queryDiseases(query)
    console.log("find symptoms of disease result: ", result)
    return result
}

/*
   QUERIES
   All the necessary prefixes to execute a query.
   Making a separate variable for these, avoids code duplication.
   */
var prefixes = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX oio: <http://www.geneontology.org/formats/oboInOwl#>
PREFIX def: <http://purl.obolibrary.org/obo/IAO_0000115>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX oboInOwl: <http://www.geneontology.org/formats/oboInOwl#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
prefix doid: <http://purl.obolibrary.org/obo/doid#>
prefix ois: <http://www.semanticweb.org/gregbonaert/ontologies/2018/10/ois#>`;

var testQuery = prefixes
    //+ 'SELECT ?s ?p ?o WHERE { ?s ?p ?o. }';
    + `SELECT  ?name ?description'
    WHERE{ 
        ?subject ?description rdfs:label ?name. 
        FILTER regex(?name, "headache").
        ?subject obo:IAO_0000115 ?description.
    }`;


//Test function to query a word with Datamuse
function searchSynonymDatamuse(word) {
    datamuse.request('words?rel_syn=' + word)
        .then((json) => {
            console.log(json);
            //do it!
        });
}

//Test function.
async function fetchTest() {
    let result;
    await symptomClient.query(testQuery).execute().then(response => {
        //console.log(response)
        result = response.results.bindings[0].name.value;
    });
    return result;
}

//Query a client on a query.
async function queryClient(client, query) {

    let result = await client.query(query).execute().then(response => {
        console.log(response.results)
        result = response.results;//bindings[0];
    }).catch(function (reason) {
        console.log("Query to ontology failed: ");
        console.log(reason);
    });
    return result;
}

async function queryNewClient(client, query) {
    res = await client.query(query).catch(function (reason) {
        console.log("Query to ontology failed: ");
        console.log(reason);
    });
    console.log(res);
    return res;
}

/// SYMPTOMS

//This one will find synonyms to make sure our response gets maximised.
async function makeSymptomQuery2(searchString) {
    var synonymsJSON = await searchSynonymDatamuse(searchString);
    var searchQuery = prefixes + symptomQueryPart1Alternate + '"' + searchString + '",'

    for (var i = 0; i < synonymsJSON.length; i++) {
        var curr = synonymsJSON[i].word
        console.log("curr: ", curr)
        searchQuery = searchQuery + '"' + curr + '"'
        if (i < (synonymsJSON.length - 1)) {
            searchQuery = searchQuery + ',';
        }
    }
    //Debugger
    console.log("final query: ", searchQuery + symptomQueryPart2Alternate)
    return searchQuery + symptomQueryPart2Alternate;

}

function makeSymptomQuery(symptom) {
    // ?description
    //  ?id obo:IAO_0000115 ?description. 
    // 
    const query = prefixes + `
SELECT DISTINCT ?name ?symptomID ?symptomDescription
WHERE {
    ?symptomID oboInOwl:hasOBONamespace "symptoms" .
    ?symptomID rdfs:label ?name .
    OPTIONAL {
        ?symptomID obo:IAO_0000115 ?symptomDescription .
    }
    FILTER regex(?name, "${symptom}" ).
}`;
    console.log(query);
    return query;
}

function makeDiagnosticQuery2(symptomNames) {
    let query = prefixes + `
SELECT DISTINCT ?diseaseName ?diseaseID ?symptomID

WHERE {
  ?diseaseID rdfs:label ?diseaseName .
  ?diseaseID rdfs:subClassOf ?disease .
  ?disease owl:onProperty doid:has_symptom .
  ?disease owl:someValuesFrom ?symptomID .`;

    // Add all the symptoms to the query (we do union, later might do intersection)
    for (let i = 0; i < symptomNames.length; i++) {
        const symptomName = symptomNames[i];
        if (i > 0) { // Add union before every symptom (except the first one)
            query += 'UNION\n';
        }
        query += `{?symptomID rdfs:label "${symptomName}" .  }\n`
    }

    query = query + '}';
    console.log(query)
    return query;
}

function makeAllLinkedDiseasesQuery(symptomNames) {
    console.log(symptomNames);
    let query = prefixes + `
SELECT DISTINCT ?diseaseName ?disease ?diseaseDescription
WHERE {
    ?disease oboInOwl:hasOBONamespace "disease_ontology".
    ?disease rdfs:label ?diseaseName.
    ?disease obo:IAO_0000115 ?diseaseDescription.
    FILTER regex(?diseaseDescription, "${symptomNames.join('|')}")
}`;

    console.log(query)
    return query;
}

function makeDiseasesLinkedToAllSymptomsQuery(symptomNames) {
    let query = prefixes + `
SELECT DISTINCT ?diseaseName ?disease ?diseaseDescription
WHERE {
    ?disease oboInOwl:hasOBONamespace "disease_ontology".
    ?disease rdfs:label ?diseaseName.
    ?disease obo:IAO_0000115 ?diseaseDescription. \n`
    symptomNames.forEach(symptomName => {
        query += `FILTER regex(?diseaseDescription, "${symptomName}") \n`
    });


    query += '}';

    console.log(query)
    return query;
}

function makeUserSymptomsQuery(username) {
    let query = prefixes + `
SELECT ?symptomName ?symptomID
WHERE {
    	?u ois:username "${username}" .
        ?u ois:hasReported ?r.
		?r ois:concernsSymptom ?s .
    	?s ois:symptomID ?symptomID .
    	?s ois:symptomName ?symptomName .   
}`
    console.log(query);
    return query;
}

function makeUserDiseasesQuery(username) {
    let query = prefixes + `
SELECT ?diseaseName ?diseaseID
WHERE {
    	?u ois:username "${username}" .
        ?u ois:hasDisease ?d.
  		?d ois:diseaseName ?diseaseName .
  		?d ois:diseaseID ?diseaseID .
}`
    console.log(query);
    return query;
}

function makeMedicinePharmacyQuery(diseaseName) {
    let query = prefixes + `
SELECT ?medicineName ?pharmacyName ?pharmacyAddress
WHERE {
      ?d ois:diseaseName "${diseaseName}" .
      ?d ois:curedBy ?m .
      ?m ois:medicineName ?medicineName .
      OPTIONAL {
          ?m ois:foundAt ?p .
          ?p ois:pharmacyName ?pharmacyName .
          ?p ois:address ?pharmacyAddress .
      }
}`
    console.log(query);
    return query;
}





//Query the symptoms using the symptoms client.
async function querySymptoms(symptom) {
    var ourQuery = await makeSymptomQuery(symptom);
    console.log("our query: ", ourQuery);
    let result = await queryClient(symptomClient, ourQuery); //query
    return result;
}





/// SYMPTOMS

//



//Export the necessary functions.
module.exports = {
    searchDiseases, fetchTest, querySymptoms, queryDiseases,
    searchSynonymDatamuse, querySymptomsofDisease,
    makeDiseasesLinkedToAllSymptomsQuery, makeAllLinkedDiseasesQuery,
    makeSymptomQuery, makeUserSymptomsQuery, makeUserDiseasesQuery, makeMedicinePharmacyQuery
}