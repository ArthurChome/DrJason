-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Diseases`
--

DROP TABLE IF EXISTS `Diseases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Diseases` (
  `diseaseID` varchar(45) NOT NULL,
  `diseaseName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`diseaseID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Diseases`
--

LOCK TABLES `Diseases` WRITE;
/*!40000 ALTER TABLE `Diseases` DISABLE KEYS */;
INSERT INTO `Diseases` VALUES ('http://purl.obolibrary.org/obo/DOID_0050007','cutaneous strongyloidiasis'),('http://purl.obolibrary.org/obo/DOID_0060220','physical urticaria'),('http://purl.obolibrary.org/obo/DOID_10527','Haemophilus influenzae pneumonia');
/*!40000 ALTER TABLE `Diseases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Medicines`
--

DROP TABLE IF EXISTS `Medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Medicines` (
  `medicineName` varchar(45) NOT NULL,
  PRIMARY KEY (`medicineName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Medicines`
--

LOCK TABLES `Medicines` WRITE;
/*!40000 ALTER TABLE `Medicines` DISABLE KEYS */;
INSERT INTO `Medicines` VALUES ('Aspirin'),('Dafalgan'),('Ibuprofen');
/*!40000 ALTER TABLE `Medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pharmacies`
--

DROP TABLE IF EXISTS `Pharmacies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pharmacies` (
  `address` varchar(100) NOT NULL,
  `pharmacyName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pharmacies`
--

LOCK TABLES `Pharmacies` WRITE;
/*!40000 ALTER TABLE `Pharmacies` DISABLE KEYS */;
INSERT INTO `Pharmacies` VALUES ('Boulevard General Jacques','Pharmacie du Boulevard'),('VUB','VUB Pharma');
/*!40000 ALTER TABLE `Pharmacies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reports`
--

DROP TABLE IF EXISTS `Reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reports` (
  `username` varchar(45) NOT NULL,
  `severity` int(11) DEFAULT '0',
  `symptomID` varchar(45) NOT NULL,
  PRIMARY KEY (`username`,`symptomID`),
  KEY `fk_Reports_2_idx` (`symptomID`),
  CONSTRAINT `fk_Reports_1` FOREIGN KEY (`username`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Reports_2` FOREIGN KEY (`symptomID`) REFERENCES `Symptoms` (`symptomID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reports`
--

LOCK TABLES `Reports` WRITE;
/*!40000 ALTER TABLE `Reports` DISABLE KEYS */;
INSERT INTO `Reports` VALUES ('John',10,'http://purl.obolibrary.org/obo/SYMP_0000144'),('John',10,'http://purl.obolibrary.org/obo/SYMP_0019168');
/*!40000 ALTER TABLE `Reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Symptoms`
--

DROP TABLE IF EXISTS `Symptoms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Symptoms` (
  `symptomID` varchar(45) NOT NULL,
  `symptomName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`symptomID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Symptoms`
--

LOCK TABLES `Symptoms` WRITE;
/*!40000 ALTER TABLE `Symptoms` DISABLE KEYS */;
INSERT INTO `Symptoms` VALUES ('http://purl.obolibrary.org/obo/SYMP_0000144','bronchopneumonia'),('http://purl.obolibrary.org/obo/SYMP_0000434','urticaria'),('http://purl.obolibrary.org/obo/SYMP_0019168','pneumonia');
/*!40000 ALTER TABLE `Symptoms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserHasSymptom`
--

DROP TABLE IF EXISTS `UserHasSymptom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserHasSymptom` (
  `username` varchar(45) NOT NULL,
  `symptomID` varchar(45) NOT NULL,
  PRIMARY KEY (`username`,`symptomID`),
  KEY `fk_Users_has_Symptoms_Symptoms1_idx` (`symptomID`),
  KEY `fk_Users_has_Symptoms_Users_idx` (`username`),
  CONSTRAINT `fk_Users_has_Symptoms_Symptoms1` FOREIGN KEY (`symptomID`) REFERENCES `Symptoms` (`symptomID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Users_has_Symptoms_Users` FOREIGN KEY (`username`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserHasSymptom`
--

LOCK TABLES `UserHasSymptom` WRITE;
/*!40000 ALTER TABLE `UserHasSymptom` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserHasSymptom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `username` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('John','john@gmail.com','johnpass',90,175,18,'male'),('Sarah','sarh@gmail.com','sarahpass',55,160,22,'female');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curedBy`
--

DROP TABLE IF EXISTS `curedBy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curedBy` (
  `medicineName` varchar(45) NOT NULL,
  `diseaseID` varchar(45) NOT NULL,
  PRIMARY KEY (`medicineName`,`diseaseID`),
  KEY `fk_Medicines_has_Pharmacies_Medicines1_idx` (`medicineName`),
  KEY `fk_curedBy_Diseases1_idx` (`diseaseID`),
  CONSTRAINT `fk_Medicines_has_Pharmacies_Medicines10` FOREIGN KEY (`medicineName`) REFERENCES `Medicines` (`medicineName`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_curedBy_Diseases1` FOREIGN KEY (`diseaseID`) REFERENCES `Diseases` (`diseaseID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curedBy`
--

LOCK TABLES `curedBy` WRITE;
/*!40000 ALTER TABLE `curedBy` DISABLE KEYS */;
/*!40000 ALTER TABLE `curedBy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foundAt`
--

DROP TABLE IF EXISTS `foundAt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `foundAt` (
  `medicineName` varchar(45) NOT NULL,
  `address` varchar(100) NOT NULL,
  PRIMARY KEY (`medicineName`,`address`),
  KEY `fk_Medicines_has_Pharmacies_Pharmacies1_idx` (`address`),
  KEY `fk_Medicines_has_Pharmacies_Medicines1_idx` (`medicineName`),
  CONSTRAINT `fk_Medicines_has_Pharmacies_Medicines1` FOREIGN KEY (`medicineName`) REFERENCES `Medicines` (`medicineName`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Medicines_has_Pharmacies_Pharmacies1` FOREIGN KEY (`address`) REFERENCES `Pharmacies` (`address`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foundAt`
--

LOCK TABLES `foundAt` WRITE;
/*!40000 ALTER TABLE `foundAt` DISABLE KEYS */;
INSERT INTO `foundAt` VALUES ('Aspirin','VUB'),('Ibuprofen','Boulevard General Jacques');
/*!40000 ALTER TABLE `foundAt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hasDiseases`
--

DROP TABLE IF EXISTS `hasDiseases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hasDiseases` (
  `username` varchar(45) NOT NULL,
  `diseaseID` varchar(45) NOT NULL,
  PRIMARY KEY (`username`,`diseaseID`),
  KEY `fk_Users_has_Diseases_Diseases1_idx` (`diseaseID`),
  KEY `fk_Users_has_Diseases_Users1_idx` (`username`),
  CONSTRAINT `fk_Users_has_Diseases_Diseases1` FOREIGN KEY (`diseaseID`) REFERENCES `Diseases` (`diseaseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Users_has_Diseases_Users1` FOREIGN KEY (`username`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hasDiseases`
--

LOCK TABLES `hasDiseases` WRITE;
/*!40000 ALTER TABLE `hasDiseases` DISABLE KEYS */;
INSERT INTO `hasDiseases` VALUES ('John','http://purl.obolibrary.org/obo/DOID_10527');
/*!40000 ALTER TABLE `hasDiseases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `isCommonConsequence`
--

DROP TABLE IF EXISTS `isCommonConsequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `isCommonConsequence` (
  `symptomCauseID` varchar(45) NOT NULL,
  `symptomConsequenceID` varchar(45) NOT NULL,
  PRIMARY KEY (`symptomCauseID`,`symptomConsequenceID`),
  KEY `fk_Symptoms_has_Symptoms_Symptoms2_idx` (`symptomConsequenceID`),
  KEY `fk_Symptoms_has_Symptoms_Symptoms1_idx` (`symptomCauseID`),
  CONSTRAINT `fk_Symptoms_has_Symptoms_Symptoms1` FOREIGN KEY (`symptomCauseID`) REFERENCES `Symptoms` (`symptomID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Symptoms_has_Symptoms_Symptoms2` FOREIGN KEY (`symptomConsequenceID`) REFERENCES `Symptoms` (`symptomID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `isCommonConsequence`
--

LOCK TABLES `isCommonConsequence` WRITE;
/*!40000 ALTER TABLE `isCommonConsequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `isCommonConsequence` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-16 13:57:52
