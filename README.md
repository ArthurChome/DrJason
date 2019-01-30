# OISProject
Open Information Systems - Project



## Install the Ontop Jetty server

1. Install the Ontop Jetty server: see the Installation instructions [here](https://github.com/ontop/ontop/wiki/RDF4J-SPARQL-endpoint-installation)
2. Download the MySQL driver [here](https://dev.mysql.com/downloads/connector/j/) (select "Platform indepedent", download the zip), extract the jar file in the "lib/ext/" folder in the Ontop Jetty server
3. Start the server (see [the installation page](https://github.com/ontop/ontop/wiki/RDF4J-SPARQL-endpoint-installation) to see how to do it)
4. Change the ois.properties file in the ontology folder (in the OISProject) with your database info (DON'T commit and push your changes)

## Creating the repositories with the ontologies
 
1. Create a repository (ois), of type "Ontop virtual RDF" using the OWL file, ODBA file and properties file
2. Create a repository (doid), of type "In Memory Store". After creating it, go to the "Add" tab and add the doid.owl file, and put as the BASE URI "http://purl.obolibrary.org/obo/doid#"
3. Create a repository (symp), of type "In Memory Store". After creating it, go to the "Add" tab and add the symp.owl file, and put as the BASE URI "http://purl.obolibrary.org/obo/symp#"
4. Create a repository (fed), of type "Federation Store" (this federation will allow us to query all 3 repositories at once). Add the "ois", "symp" and "doid" repositories when creating this one.
4. Create a repository (feddoidsymp), of type "Federation Store" (this federation will allow us to query the DOID and SYMP repositories at once). Add the "symp" and "doid" repositories when creating this one.
5. You're done.

## PLEASE USE THESE EXACT NAMES FOR THE REPOSITORIES!!!