-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: mysql8b.mysql.database.azure.com    Database: goodpoint2_t
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `access_logger`
--

DROP TABLE IF EXISTS `access_logger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_logger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `success` tinyint NOT NULL,
  `date` datetime NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_592498efcc7b3c679d433037b1d` (`userId`),
  CONSTRAINT `FK_592498efcc7b3c679d433037b1d` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11350 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_logger`
--

LOCK TABLES `access_logger` WRITE;
/*!40000 ALTER TABLE `access_logger` DISABLE KEYS */;
INSERT INTO `access_logger` VALUES (11297,1,'2023-05-23 16:18:02','167f8550-8763-11ed-a031-1c1bb51f4c1c'),(11338,1,'2023-06-15 10:12:06','167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(11345,1,'2023-07-02 13:20:38','167f865c-8763-11ed-a031-1c1bb51f4c1c'),(11349,1,'2023-07-04 06:16:30','167f840d-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `access_logger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_good_points`
--

DROP TABLE IF EXISTS `archived_good_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archived_good_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student_id` int DEFAULT NULL,
  `date_sent` datetime DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `teacher_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_47ebf9f72b5e9a12e7bf0cdd5eb` (`student_id`),
  KEY `FK_791bf7363b36e873941775724e9` (`teacher_id`),
  KEY `FK_fdcefa8e8a8b22a59ef800bc4ba` (`school_id`),
  CONSTRAINT `FK_47ebf9f72b5e9a12e7bf0cdd5eb` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FK_791bf7363b36e873941775724e9` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_fdcefa8e8a8b22a59ef800bc4ba` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19381 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_good_points`
--

LOCK TABLES `archived_good_points` WRITE;
/*!40000 ALTER TABLE `archived_good_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `archived_good_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `grade` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL,
  `class_index` tinyint NOT NULL,
  `school_code` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `teacher_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9a1024736a466e0361b226cef9` (`class_index`,`grade`,`school_id`),
  KEY `FK_398f3990f5da4a1efda173f576f` (`school_id`),
  KEY `FK_b34c92e413c4debb6e0f23fed46` (`teacher_id`),
  CONSTRAINT `FK_398f3990f5da4a1efda173f576f` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_b34c92e413c4debb6e0f23fed46` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1650 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'2021-09-19 09:19:22.000000','2023-06-12 17:17:01.000000','1',2,'420208',1,'7cc4a4dc-1d26-48f9-9545-4b33b8e70f90'),(2,'2021-09-19 09:19:23.000000','2023-06-12 10:55:32.000000','2',2,'420208',1,'167f875f-8763-11ed-a031-1c1bb51f4c1c'),(3,'2021-09-19 09:19:24.000000','2023-01-22 15:22:19.443682','3',2,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(4,'2021-09-19 09:19:26.000000','2023-01-22 15:22:19.443682','4',2,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(5,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','4',2,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(7,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','5',1,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(8,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','7',2,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(9,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','7',1,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(10,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','3',2,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(11,'2020-05-26 10:26:57.000000','2023-01-22 15:22:19.443682','6',1,'987654',2,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(12,'2021-09-19 09:19:27.000000','2023-01-22 15:22:19.443682','6',2,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(14,'2021-09-19 09:19:22.000000','2023-01-22 15:22:19.443682','1',3,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(15,'2021-09-19 09:19:23.000000','2023-01-22 15:22:19.443682','2',3,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(16,'2021-09-19 09:19:24.000000','2023-06-12 10:55:32.000000','3',3,'420208',1,'167f875f-8763-11ed-a031-1c1bb51f4c1c'),(17,'2021-09-19 09:19:26.000000','2023-01-22 15:22:19.443682','4',3,'420208',1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(164,'2021-09-19 09:19:23.000000','2023-06-14 11:47:46.000000','2',1,'420208',1,'05720e61-0134-45b5-b02c-c86b98c67ae9'),(165,'2021-09-19 09:19:24.000000','2023-06-14 11:47:46.000000','3',1,'420208',1,'75a54048-a7c8-4249-830b-535675e2fff2'),(166,'2021-09-19 09:19:26.000000','2023-06-14 11:47:46.000000','4',1,'420208',1,'df87df6b-605c-4db6-9d8c-92cc38fee705'),(167,'2021-09-19 09:19:27.000000','2023-06-14 11:47:46.000000','6',1,'420208',1,'b0859259-9017-4d6d-89bd-5997fc42b8bb'),(586,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','3',3,'987654',2,NULL),(587,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','3',4,'987654',2,NULL),(588,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','3',5,'987654',2,NULL),(589,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','3',6,'987654',2,NULL),(590,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','4',1,'987654',2,NULL),(591,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','4',3,'987654',2,NULL),(592,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','4',4,'987654',2,NULL),(593,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','4',5,'987654',2,NULL),(594,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','5',3,'987654',2,NULL),(595,'2022-09-15 09:08:29.000000','2023-06-06 16:13:46.000000','5',4,'987654',2,NULL),(596,'2022-09-15 09:08:29.000000','2023-01-22 15:26:55.379836','6',2,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(597,'2022-09-15 09:08:29.000000','2023-01-22 15:26:55.379836','6',3,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(602,'2022-09-15 09:09:46.000000','2023-01-22 15:26:55.379836','2',1,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(603,'2022-09-15 09:09:46.000000','2023-01-22 15:26:55.379836','2',2,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(604,'2022-09-15 09:09:46.000000','2023-01-22 15:26:55.379836','2',3,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(605,'2022-09-15 09:09:46.000000','2023-01-22 15:26:55.379836','2',4,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(606,'2022-09-15 09:09:46.000000','2023-01-22 15:26:55.379836','3',1,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(916,'2022-11-02 11:04:02.000000','2023-01-22 15:26:55.379836','1',1,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(917,'2022-11-02 11:04:02.000000','2023-01-22 15:26:55.379836','1',2,'987654',2,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(1344,'2023-03-30 11:05:53.868535','2023-06-14 11:47:46.000000','5',1,NULL,1,'bed8b29f-3b10-4832-988a-aee363e62249'),(1360,'2023-05-15 15:21:23.107097','2023-05-15 15:21:23.107097','7',2,NULL,1,NULL),(1366,'2023-05-15 16:58:24.199810','2023-05-15 16:58:24.199810','7',1,NULL,1,NULL),(1367,'2023-05-15 16:58:24.199810','2023-05-15 16:58:24.199810','7',3,NULL,1,NULL),(1511,'2023-05-16 13:02:51.540496','2023-05-16 13:02:51.540496','7',4,NULL,1,NULL),(1607,'2023-05-21 11:23:39.414134','2023-05-21 11:23:39.414134','11',2,NULL,1,NULL),(1638,'2023-05-29 13:18:17.871172','2023-05-29 13:18:17.871172','5',2,NULL,1,NULL),(1639,'2023-06-05 15:06:35.105035','2023-06-05 15:06:35.105035','3',15,NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(1640,'2023-06-05 15:12:33.475120','2023-06-05 15:12:33.475120','11',12,NULL,1,NULL),(1641,'2023-06-07 11:03:54.870663','2023-06-07 11:03:54.870663','3',10,NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(1643,'2023-06-14 11:47:46.127284','2023-06-22 10:48:06.000000','1',6,NULL,1,'858f75e4-5fb9-472f-9c0c-5f3c8615cd1a'),(1649,'2023-06-25 13:00:01.851234','2023-06-25 13:00:01.851234','4',7,NULL,1,'05720e61-0134-45b5-b02c-c86b98c67ae9');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes_teachers_user`
--

DROP TABLE IF EXISTS `classes_teachers_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes_teachers_user` (
  `classesId` int NOT NULL,
  `userId` varchar(36) NOT NULL,
  PRIMARY KEY (`classesId`,`userId`),
  KEY `IDX_3c538c5355b1ed407c280d0eca` (`classesId`),
  KEY `IDX_ea3f37176a03a67d048faa1bb8` (`userId`),
  CONSTRAINT `FK_3c538c5355b1ed407c280d0eca2` FOREIGN KEY (`classesId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ea3f37176a03a67d048faa1bb8f` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes_teachers_user`
--

LOCK TABLES `classes_teachers_user` WRITE;
/*!40000 ALTER TABLE `classes_teachers_user` DISABLE KEYS */;
INSERT INTO `classes_teachers_user` VALUES (1,'167f8039-8763-11ed-a031-1c1bb51f4c1c'),(2,'167f8039-8763-11ed-a031-1c1bb51f4c1c'),(3,'167f8039-8763-11ed-a031-1c1bb51f4c1c'),(5,'167f8039-8763-11ed-a031-1c1bb51f4c1c'),(8,'167f8039-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `classes_teachers_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_spam`
--

DROP TABLE IF EXISTS `email_spam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_spam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(70) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_52eb087e1598863b2f09fc1534` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_spam`
--

LOCK TABLES `email_spam` WRITE;
/*!40000 ALTER TABLE `email_spam` DISABLE KEYS */;
INSERT INTO `email_spam` VALUES (1,'hermione@ms.com');
/*!40000 ALTER TABLE `email_spam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_point_reaction`
--

DROP TABLE IF EXISTS `good_point_reaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_point_reaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `good_point_id` int NOT NULL,
  `reaction` enum('BLUSH','FUNNY','ANGLE','BLESSED','PARTY') NOT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `sender` enum('DAD','MOM','STUDENT','GRANDPA','GRANDMA','OTHER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5699a8423743908cfbbcb7b660` (`sender`,`good_point_id`),
  KEY `FK_1a402f7849f5d1b4b518d8f154f` (`good_point_id`),
  CONSTRAINT `FK_1a402f7849f5d1b4b518d8f154f` FOREIGN KEY (`good_point_id`) REFERENCES `good_points` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_point_reaction`
--

LOCK TABLES `good_point_reaction` WRITE;
/*!40000 ALTER TABLE `good_point_reaction` DISABLE KEYS */;
INSERT INTO `good_point_reaction` VALUES (49,50867,'PARTY','2023-06-21 08:59:57.822336','STUDENT'),(50,50867,'ANGLE','2023-06-21 09:00:16.144172','DAD'),(51,50867,'FUNNY','2023-06-21 09:00:24.477794','MOM');
/*!40000 ALTER TABLE `good_point_reaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_points`
--

DROP TABLE IF EXISTS `good_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `student_id` int DEFAULT NULL,
  `gp_link_hash` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `teacher_id` varchar(36) DEFAULT NULL,
  `view_count` tinyint unsigned DEFAULT '0',
  `view_count_late` tinyint unsigned DEFAULT NULL,
  `text` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ffa4b7a2390db09fbddc57fd84` (`gp_link_hash`),
  KEY `FK_b3e224c16b9166666f728941ff4` (`student_id`),
  KEY `FK_c16c73fecdb731b9def35f0f557` (`teacher_id`),
  KEY `FK_ff2314d38943c757d39871ac3de` (`school_id`),
  CONSTRAINT `FK_b3e224c16b9166666f728941ff4` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c16c73fecdb731b9def35f0f557` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_ff2314d38943c757d39871ac3de` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50897 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_points`
--

LOCK TABLES `good_points` WRITE;
/*!40000 ALTER TABLE `good_points` DISABLE KEYS */;
INSERT INTO `good_points` VALUES (50866,'2023-06-11 12:04:02.647823','2023-06-11 12:04:02.647823',28444,'9ee6596',1,'167f865c-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'jkjkljlk'),(50867,'2023-06-11 12:04:21.996468','2023-06-21 09:46:58.000000',28444,'d4eaefe',1,'167f865c-8763-11ed-a031-1c1bb51f4c1c',38,NULL,'משה התנהג ממש יפה היום!! איזה כיף לשלוח לו הודעה.\n מי יתן וההודעה תהיה מספיק ארוכה\n חכןםד חןכםדחכןדםחכד חכןחכםןדחכ fhiusfh hfoiewhoiewhf hfiwohfoiewfh fheoiwhfoiewכחןגדםחכםד מטורף מדהים כמה יופי'),(50868,'2023-06-11 15:13:05.543754','2023-06-11 15:13:05.543754',28444,'63ec6f3',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'FDSFSDFS'),(50869,'2023-06-12 17:05:49.252372','2023-06-12 17:05:49.252372',28444,'cd132ac',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה התנדב היום לעזור בכיתה!'),(50870,'2023-06-12 17:05:58.828802','2023-06-12 17:05:58.828802',28444,'ace0fd2',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'אוי לא'),(50871,'2023-06-12 17:06:19.543191','2023-06-12 17:06:19.543191',28444,'033c4b3',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'ככדגכגדכ'),(50872,'2023-06-12 17:07:31.250501','2023-06-12 17:07:31.250501',28444,'531d92c',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'שני!! שולחת הודעה קבוצתית'),(50873,'2023-06-12 17:07:31.253725','2023-06-12 17:07:31.253725',28443,'6093b5b',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'שני!! שולחת הודעה קבוצתית'),(50874,'2023-06-14 11:38:05.261400','2023-06-14 11:38:05.261400',28443,'870e890',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'רעות העשירה אותנו היום מחפצים הנמצאים בביתה'),(50875,'2023-06-14 11:38:12.240843','2023-06-14 11:38:12.240843',28443,'fa9f20f',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'אופס'),(50876,'2023-06-14 12:50:52.757320','2023-06-14 12:50:52.757320',28445,'97dabcd',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'עגכעגכעגעגכעכ'),(50877,'2023-06-14 12:58:48.189908','2023-06-14 12:58:48.189908',28444,'284809c',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'עחגכלך'),(50878,'2023-06-14 12:59:06.878524','2023-06-14 12:59:06.878524',28444,'0224fc7',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'כגדכדגכ'),(50879,'2023-06-14 13:02:30.534568','2023-06-14 13:02:30.534568',28444,'878b818',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'gdfgdffgd'),(50880,'2023-06-14 13:02:46.960416','2023-06-14 13:02:46.960416',28444,'138d299',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה עזר לחברה בהפסקה'),(50881,'2023-06-14 13:02:53.165622','2023-06-14 13:02:53.165622',28444,'a4d476d',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'כגכדגכדג'),(50882,'2023-06-14 13:15:47.471206','2023-06-14 13:15:47.471206',28444,'57700b9',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'jkjkj'),(50883,'2023-06-14 13:16:01.564188','2023-06-14 13:16:01.564188',28444,'3cbea29',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50884,'2023-06-14 13:18:46.072529','2023-06-14 13:18:46.072529',28444,'af482a8',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50885,'2023-06-14 13:18:53.832034','2023-06-14 13:18:53.832034',28444,'d646011',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'gdgdfgdfg'),(50886,'2023-06-14 13:19:26.007996','2023-06-14 13:19:26.007996',28444,'adbe8cf',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50887,'2023-06-14 13:19:35.681992','2023-06-14 13:19:35.681992',28444,'369f011',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50888,'2023-06-14 13:20:04.783066','2023-06-14 13:20:04.783066',28444,'4e46891',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'gfdgdfg'),(50889,'2023-06-14 13:20:25.214719','2023-06-14 13:20:25.214719',28444,'0b1710e',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50890,'2023-06-14 13:21:48.131711','2023-06-14 13:21:48.131711',28444,'ed047c2',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'gdfgdfg'),(50891,'2023-06-14 13:21:58.772255','2023-06-14 13:21:58.772255',28444,'75fcdd1',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה צריך להיות שמח'),(50892,'2023-06-14 13:22:11.199957','2023-06-14 13:22:11.199957',28444,'25124d6',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'fsfsdf'),(50893,'2023-06-14 13:22:47.177044','2023-06-14 13:22:47.177044',28444,'fc63577',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'gggg'),(50894,'2023-06-14 13:22:57.736862','2023-06-14 13:22:57.736862',28444,'02fa03d',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה העשיר אותנו היום מחפצים הנמצאים בביתו'),(50895,'2023-06-15 13:12:16.427445','2023-06-15 13:12:16.427445',28444,'c90bc30',1,'167f865c-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'משה להלהלהלהלהלהללההללהלהל להללהלהלהלה להלהלהלהלהל להלהלהלהל'),(50896,'2023-06-15 13:35:44.094711','2023-06-15 13:35:44.094711',28443,'aa9ca4a',1,'167f865c-8763-11ed-a031-1c1bb51f4c1c',0,NULL,'בדיקה בדיקה בדיקה');
/*!40000 ALTER TABLE `good_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goodpoint_preset`
--

DROP TABLE IF EXISTS `goodpoint_preset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goodpoint_preset` (
  `goodpoint_id` int NOT NULL,
  `preset_message_id` int NOT NULL,
  `school_id` int NOT NULL,
  PRIMARY KEY (`goodpoint_id`,`preset_message_id`,`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goodpoint_preset`
--

LOCK TABLES `goodpoint_preset` WRITE;
/*!40000 ALTER TABLE `goodpoint_preset` DISABLE KEYS */;
INSERT INTO `goodpoint_preset` VALUES (50686,256,1),(50699,311,1),(50707,311,1),(50708,311,1),(50709,309,1),(50711,313,1),(50712,309,1),(50738,309,1),(50762,307,1),(50763,305,1),(50773,307,1),(50781,276,1),(50797,467,1),(50830,467,1),(50832,467,1),(50843,311,1),(50846,311,1),(50847,311,1),(50848,311,1),(50851,309,1),(50853,311,1),(50856,311,1),(50857,311,1),(50860,311,1),(50864,313,1),(50874,312,1),(50880,313,1),(50883,311,1),(50884,311,1),(50886,311,1),(50887,311,1),(50889,311,1),(50891,471,1),(50894,311,1),(50895,467,1);
/*!40000 ALTER TABLE `goodpoint_preset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_phone`
--

DROP TABLE IF EXISTS `parent_phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_phone` (
  `student_id` int NOT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`student_id`,`phone`),
  CONSTRAINT `FK_88e7fd228423b70f6748c453906` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_phone`
--

LOCK TABLES `parent_phone` WRITE;
/*!40000 ALTER TABLE `parent_phone` DISABLE KEYS */;
INSERT INTO `parent_phone` VALUES (1,'0525522172'),(2,'0123456789'),(3,'0546969090'),(4,'0546969090'),(5,'0546969090'),(7,'0525522172'),(7,'0546969090'),(8,'0546969090'),(9,'0546969090'),(11,'0525522172'),(11,'0546969090'),(28443,'0525522172'),(28444,'0525522172'),(28445,'0546969090'),(28446,'0525522174');
/*!40000 ALTER TABLE `parent_phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_numbers`
--

DROP TABLE IF EXISTS `phone_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_numbers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(14) DEFAULT NULL,
  `isStudentPersonalPhone` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_numbers`
--

LOCK TABLES `phone_numbers` WRITE;
/*!40000 ALTER TABLE `phone_numbers` DISABLE KEYS */;
/*!40000 ALTER TABLE `phone_numbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preset_messages`
--

DROP TABLE IF EXISTS `preset_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preset_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `text` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `preset_category` enum('social','emotional','educational','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER','NONE') NOT NULL,
  `lang` enum('he','ar') NOT NULL,
  `school_id` int DEFAULT NULL,
  `creator_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2a936f3cd0407aa96b713ec65c4` (`school_id`),
  KEY `FK_f4c4d6571c6356f194373a76841` (`creator_id`),
  CONSTRAINT `FK_2a936f3cd0407aa96b713ec65c4` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_f4c4d6571c6356f194373a76841` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=473 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preset_messages`
--

LOCK TABLES `preset_messages` WRITE;
/*!40000 ALTER TABLE `preset_messages` DISABLE KEYS */;
INSERT INTO `preset_messages` VALUES (2,'2019-11-10 11:20:47.000000',NULL,'התלמיד השתתף בשיעור בצורה יוצאת דופן','educational','MALE','he',NULL,NULL),(13,'2019-12-04 13:10:00.000000',NULL,'התלמיד הכין שיעורי בית ','educational','MALE','he',NULL,NULL),(77,'2020-01-20 12:25:32.000000',NULL,'התלמידה השתתפה בשיעור בצורה יוצאת דופן','educational','FEMALE','he',NULL,NULL),(191,'2020-04-05 11:00:53.000000',NULL,'התלמיד שיתף את','social','MALE','he',NULL,NULL),(233,'2020-05-25 12:34:59.000000','2023-01-22 15:58:38.363588','התלמיד ממש נחמד היום','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(234,'2020-05-25 12:35:45.000000','2023-01-22 15:58:38.363588','היום בבוקר נכנסתי ','social','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(235,'2020-05-27 18:47:44.000000',NULL,'התלמיד הכין שיעורי בית','educational','MALE','he',NULL,NULL),(236,'2020-05-27 18:48:25.000000',NULL,'התלמיד שאל שאלה יפה היום בשיעור','educational','MALE','he',NULL,NULL),(237,'2020-05-27 18:48:46.000000',NULL,'התלמידה שאלה שאלה יפה בשיעור','educational','FEMALE','he',NULL,NULL),(238,'2020-05-27 18:49:15.000000',NULL,'התלמיד ענה תשובה יפה בשיעור','educational','MALE','he',NULL,NULL),(239,'2020-05-27 18:49:37.000000',NULL,'התלמידה ענתה תשובה יפה בשיעור','educational','FEMALE','he',NULL,NULL),(240,'2020-05-27 18:50:03.000000',NULL,'התלמיד העביר לנו היום שיעור מרתק בנושא','educational','MALE','he',NULL,NULL),(241,'2020-05-27 18:50:26.000000',NULL,'התלמידה העבירה לנו שיעור מרתק בנושא','educational','FEMALE','he',NULL,NULL),(242,'2020-05-27 18:51:09.000000',NULL,'התלמיד השקיע היום במשימה שניתנה בכיתה','educational','MALE','he',NULL,NULL),(243,'2020-05-27 18:51:50.000000',NULL,'התלמידה השקיעה היום במשימה שניתנה בכיתה','educational','FEMALE','he',NULL,NULL),(244,'2020-05-27 18:52:22.000000',NULL,'התלמיד גילה רגישות מיוחדת לחבר','emotional','MALE','he',NULL,NULL),(245,'2020-05-27 18:52:43.000000',NULL,'התלמידה גילתה רגישות לחברה ','emotional','FEMALE','he',NULL,NULL),(246,'2020-05-27 18:53:19.000000',NULL,'התלמיד הגיש עזרה לחבר בהפסקה','social','MALE','he',NULL,NULL),(247,'2020-05-27 18:53:44.000000',NULL,'התלמידה הגישה עזרה לחברה היום בהפסקה','social','FEMALE','he',NULL,NULL),(248,'2020-05-27 18:54:11.000000',NULL,'התלמיד התגבר היום על קושי ','emotional','MALE','he',NULL,NULL),(249,'2020-05-27 18:54:28.000000',NULL,'התלמידה התגברה היום על קושי','emotional','FEMALE','he',NULL,NULL),(250,'2020-05-27 18:54:45.000000',NULL,'התלמיד גילה בגרות','emotional','MALE','he',NULL,NULL),(251,'2020-05-27 18:55:00.000000',NULL,'התלמידה גילתה אחריות','emotional','FEMALE','he',NULL,NULL),(252,'2020-05-27 18:55:17.000000',NULL,'התלמיד גילה אחריות','emotional','MALE','he',NULL,NULL),(253,'2020-05-27 18:55:36.000000',NULL,'התלמידה גילתה בגרות','emotional','FEMALE','he',NULL,NULL),(254,'2020-05-27 18:55:55.000000',NULL,'התלמיד התנדב היום לעזור','emotional','MALE','he',NULL,NULL),(255,'2020-05-27 18:56:15.000000',NULL,'התלמידה התנדבה היום לעזור','emotional','FEMALE','he',NULL,NULL),(256,'2020-05-27 18:56:47.000000',NULL,'התלמיד ויתר לחברו','social','MALE','he',NULL,NULL),(257,'2020-05-27 18:57:05.000000',NULL,'התלמידה ויתרה לחברתה','social','FEMALE','he',NULL,NULL),(258,'2020-05-27 18:57:25.000000',NULL,'התלמיד גילה כושר מנהיגות','social','MALE','he',NULL,NULL),(259,'2020-05-27 18:57:42.000000',NULL,'התלמידה גילתה כושר מנהיגות','social','FEMALE','he',NULL,NULL),(260,'2020-05-27 19:23:07.000000','2023-01-22 15:58:38.363588','התלמיד הביע את ','emotional','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(261,'2020-05-27 19:23:19.000000','2023-01-22 15:58:38.363588','התלמידה הביעה את ','emotional','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(262,'2020-05-27 19:26:09.000000','2023-01-22 15:58:38.363588','התלמיד עבד ולמד עם חבר ','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(263,'2020-05-27 19:26:29.000000','2023-01-22 15:58:38.363588','התלמידה עבדה ולמדה עם חברה ','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(264,'2020-05-27 19:28:40.000000','2023-01-22 15:58:38.363588','התלמיד הקשיב בסקרנות ועניין','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(265,'2020-05-27 19:28:56.000000','2023-01-22 15:58:38.363588','התלמידה הקשיבה בסקרנות ועניין ','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(266,'2020-05-27 19:31:24.000000','2023-01-22 15:58:38.363588','התלמיד התנהג בדרך ארץ וכבוד ','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(267,'2020-05-27 19:31:37.000000','2023-01-22 15:58:38.363588','התלמידה התנהגה בדרך ארץ וכבוד','other','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(268,'2020-05-27 19:32:31.000000','2023-01-22 15:58:38.363588','התלמיד פירגן ','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(269,'2020-05-27 19:32:39.000000','2023-01-22 15:58:38.363588','התלמידה פירגנה ','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(271,'2020-06-03 05:09:54.000000','2023-01-22 15:58:38.363588','התלמידה מתעמלת יפה וברצון והתקדמה מאוד','other','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(272,'2020-06-03 05:33:29.000000',NULL,'התלמיד הקשיב בסקרנות ובעניין','educational','MALE','he',NULL,NULL),(273,'2020-06-03 05:33:59.000000',NULL,'התלמידה הקשיבה בסקרנות ובעניין','educational','FEMALE','he',NULL,NULL),(276,'2020-06-03 05:48:37.000000',NULL,'התלמיד מקפיד על סדר וארגון ','educational','MALE','he',NULL,NULL),(277,'2020-06-03 05:50:43.000000',NULL,'התלמידה מקפידה על סדר ונקיון ','educational','FEMALE','he',NULL,NULL),(283,'2020-06-03 08:10:31.000000',NULL,'התלמיד קיבל תפקיד בכיתה וממלא אותו באחריות','other','MALE','he',NULL,NULL),(284,'2020-06-03 08:11:20.000000',NULL,'התלמידה קיבלה תפקיד בכיתה וממלאת אותו באחריות','other','FEMALE','he',NULL,NULL),(285,'2020-06-15 06:30:41.000000','2023-01-22 15:58:38.363588','התלמיד מאוד משתדל ומשתתף בשיעור.','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(286,'2020-06-15 06:33:18.000000','2023-01-22 15:58:38.363588','התלמידה מאוד משתדלת ומשתתפת בשיעור','other','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(287,'2020-06-15 06:37:42.000000','2023-01-22 15:58:38.363588','מגלה הריצות ונכונות למאמץ','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(289,'2020-09-22 12:36:34.000000',NULL,'התלמיד השתתף היום באופן פעיל בשיעור הזום','other','MALE','he',NULL,NULL),(290,'2020-09-22 12:37:01.000000',NULL,'התלמידה השתתפה היום באופן פעיל בזום','other','FEMALE','he',NULL,NULL),(291,'2020-09-22 12:39:05.000000',NULL,'התלמיד הגיע בזמן לשיעור הזום','other','MALE','he',NULL,NULL),(292,'2020-09-22 12:39:31.000000',NULL,'התלמידה הגיעה היום בזמן לשיעור הלמידה בזום','other','FEMALE','he',NULL,NULL),(293,'2020-09-22 12:41:02.000000',NULL,'התלמיד עזר לנו היום לפתור בעיה טכנית בזום','other','MALE','he',NULL,NULL),(294,'2020-09-22 12:41:24.000000',NULL,'התלמידה עזרה לנו היום לפתור בעיה טכנית בזום','other','FEMALE','he',NULL,NULL),(295,'2020-09-22 12:42:28.000000',NULL,'התלמיד מילא היום את כל משימות הלמידה מרחוק בחריצות וביעילות.','other','MALE','he',NULL,NULL),(296,'2020-09-22 12:42:54.000000',NULL,'התלמידה מילאה היום את כל משימות הלמידה מרחוק בחריצות וביעילות.','other','FEMALE','he',NULL,NULL),(297,'2020-09-22 12:45:25.000000',NULL,'התלמיד מגלה כוחות חדשים וייחודייםבתקופה מאתגרת זו.','other','MALE','he',NULL,NULL),(298,'2020-09-22 12:46:00.000000',NULL,'התלמידה מגלה כוחות חדשים וייחודיים בתקופה מאתגרת זו.','other','FEMALE','he',NULL,NULL),(299,'2020-09-22 12:46:47.000000',NULL,'התלמיד שיתף אותנו באופן כנה ובוגר ברגשותיו.','other','MALE','he',NULL,NULL),(300,'2020-09-22 12:47:26.000000',NULL,'התלמידה שיתפה אותנו באופן כנה ובוגר ברגשותיה.','other','FEMALE','he',NULL,NULL),(301,'2020-09-22 12:49:47.000000',NULL,'התלמיד התייחס לדברי חבריו בשיעור ובזכותו התפתח דיון פורה','other','MALE','he',NULL,NULL),(302,'2020-09-22 12:50:45.000000',NULL,'התלמידה התייחסה לדברי חבריה בשיעור ובזכותה התפתח דיון פורה','other','FEMALE','he',NULL,NULL),(303,'2020-09-22 12:51:38.000000',NULL,'שמחתי לראות את התלמיד נוכח ומחייך היום בשיעור ','other','MALE','he',NULL,NULL),(304,'2020-09-22 12:52:09.000000',NULL,'שמחתי לראות את התלמידה נוכחת ומחייכת היום בשיעור ','other','FEMALE','he',NULL,NULL),(305,'2020-09-22 12:53:05.000000',NULL,'התלמיד משתמש יפה באפשרויות הטכנולוגיות כדי לקבל את רשות הדיבור.','other','MALE','he',NULL,NULL),(306,'2020-09-22 12:53:42.000000',NULL,'התלמידה משתמשת יפה באפשרויות הטכנולוגיות כדי לקבל את רשות הדיבור.','other','FEMALE','he',NULL,NULL),(307,'2020-09-22 12:55:39.000000',NULL,'התלמיד הקריא היום טקסט לכל הכיתה בצורה רהוטה ומכובדת','other','MALE','he',NULL,NULL),(308,'2020-09-22 12:56:10.000000',NULL,'התלמידה הקריאה לכל הכיתה טקסט היום בצורה רהוטה ומכובדת','other','FEMALE','he',NULL,NULL),(309,'2020-09-22 12:57:06.000000',NULL,'התלמיד מגלה עצמאות ואחריות בלמידה.','other','MALE','he',NULL,NULL),(310,'2020-09-22 12:57:35.000000',NULL,'התלמידה מגלה עצמאות ואחריות בלמידה','other','FEMALE','he',NULL,NULL),(311,'2020-09-22 12:58:17.000000',NULL,'התלמיד העשיר אותנו היום מחפצים הנמצאים בביתו','other','MALE','he',NULL,NULL),(312,'2020-09-22 12:58:39.000000',NULL,'התלמידה העשירה אותנו היום מחפצים הנמצאים בביתה','other','FEMALE','he',NULL,NULL),(313,'2020-12-24 13:14:07.000000',NULL,'התלמיד עזר לחברה בהפסקה','social','MALE','he',NULL,NULL),(314,'2020-12-24 13:14:35.000000',NULL,'התלמידה עזרה לחבר בהפסקה','social','FEMALE','he',NULL,NULL),(315,'2021-02-07 08:10:20.000000','2023-01-22 15:58:38.363588','עבד והשתתף בשיעור , גאה בה','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(318,'2021-03-01 11:29:04.000000','2023-01-22 15:58:38.363588','התלמידה היקרה למדה ועבדה יפה בשיעור אנגלית.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(319,'2021-03-01 11:29:26.000000','2023-01-22 15:58:38.363588','התלמיד היקר למד ועבד יפה בשיעור אנגלית.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(320,'2021-03-01 11:29:51.000000','2023-01-22 15:58:38.363588','התלמיד המתוק השתתף יפה בשיעור אנגלית','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(321,'2021-03-01 11:30:20.000000','2023-01-22 15:58:38.363588','התלמידה המקסימה השתתפה יפה בשיעור אנגלית.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(322,'2021-03-06 20:15:10.000000','2023-01-22 15:58:38.363588','התלמיד שיחק יפה עם חבריו במהלך ההפסקה','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(323,'2021-03-06 20:16:05.000000','2023-01-22 15:58:38.363588','התלמיד ביצע מטלה לימודית באופן רציני ויסודי','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(324,'2021-03-06 20:17:32.000000','2023-01-22 15:58:38.363588','התלמיד השתתף במהלך השיעור ותרם מידיעותיו','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(326,'2021-03-07 19:11:04.000000','2023-01-22 15:58:38.363588','התלמיד מעורה בחברת הילדים ומגלה יחס טוב והוגן כלפי חבריו.  ','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(327,'2021-03-07 19:13:02.000000','2023-01-22 15:58:38.363588','התלמיד מגלה עניין רב במתרחש בכיתה, עובד יפה ובאופן עצמאי ומבצע את המשימות הלימודיות בצורה טובה. ','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(329,'2021-03-07 19:14:37.000000','2023-01-22 15:58:38.363588','התלמיד בעל מוטיבציה רבה, עובד בחריצות ובהתמדה.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(330,'2021-03-07 19:20:35.000000','2023-01-22 15:58:38.363588','נהנתי לראות את התלמיד משחק עם חבריו במהלך ההפסקה','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(331,'2021-03-07 19:26:21.000000','2023-01-22 15:58:38.363588','התלמיד התפלל היום בכוונה רבה ושימש דוגמא לכל הכיתה','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(332,'2021-03-07 19:35:04.000000','2023-01-22 15:58:38.363588','התלמיד מגלה נכונות לעזור לזולת','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(334,'2021-03-07 19:44:36.000000','2023-01-22 15:58:38.363588','התלמידה מגלה נכונות לעזור לזולת','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(335,'2021-03-07 19:45:13.000000','2023-01-22 15:58:38.363588','התלמידה מעורה בחברת הילדים ומגלה יחס טוב והוגן כלפי חבריה.  ','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(336,'2021-03-07 19:45:34.000000','2023-01-22 15:58:38.363588','התלמיד תורם רבות לדיונים בכיתה','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(337,'2021-03-07 19:45:49.000000','2023-01-22 15:58:38.363588','התלמידה תורמת רבות לדיונים בכיתה','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(338,'2021-03-07 19:46:13.000000','2023-01-22 15:58:38.363588','התלמידה בעלת מוטיבציה רבה, עובדת בחריצות ובהתמדה.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(339,'2021-03-07 19:46:34.000000','2023-01-22 15:58:38.363588','התלמידה מגלה עניין רב במתרחש בכיתה, עובדת יפה ובאופן עצמאי ומבצעת את המשימות הלימודיות בצורה טובה. ','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(340,'2021-03-07 19:47:08.000000','2023-01-22 15:58:38.363588','התלמידה השתתפה במהלך השיעור ותרמה מידיעותיה.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(341,'2021-03-07 19:47:28.000000','2023-01-22 15:58:38.363588','התלמידה ביצעה מטלה לימודית באופן רציני ויסודי.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(342,'2021-03-07 19:48:10.000000','2023-01-22 15:58:38.363588','התלמידה שיחקה יפה עם חבריה במהלך ההפסקה','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(343,'2021-03-07 19:51:11.000000','2023-01-22 15:58:38.363588','התלמיד מגלה רגישות ואכפתיות לצורכי האחר. ','emotional','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(344,'2021-03-07 19:51:30.000000','2023-01-22 15:58:38.363588','התלמידה מגלה רגישות ואכפתיות לצורכי האחר. ','emotional','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(345,'2021-03-07 20:01:35.000000','2023-01-22 15:58:38.363588','התלמיד לומד מתוך סקרנות ועניין ומקפיד לבצע את המטלות הלימודיות בצורה רצינית ויסודית. ','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(346,'2021-03-07 20:02:11.000000','2023-01-22 15:58:38.363588','התלמידה לומדת מתוך סקרנות ועניין ומקפידה לבצע את המטלות הלימודיות בצורה רצינית ויסודית','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(347,'2021-03-07 20:03:25.000000','2023-01-22 15:58:38.363588','התלמיד תורם רבות לאווירה נעימה בכיתתנו. ','emotional','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(348,'2021-03-07 20:03:41.000000','2023-01-22 15:58:38.363588','התלמידה תורמת רבות לאווירה נעימה בכיתתנו. ','emotional','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(350,'2021-03-07 20:14:51.000000','2023-01-22 15:58:38.363588','התלמידה מעורה בחברת הילדים ומגלה יחס טוב והוגן כלפי חבריה.  ','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(351,'2021-03-07 20:15:58.000000','2023-01-22 15:58:38.363588','נהנתי לראות את התלמידה משחקת יפה במהלך ההפסקה.','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(352,'2021-11-07 07:23:48.000000','2023-01-22 15:58:38.363588','התלמידה התעוררה בזמן לזום הבוקר','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(353,'2021-11-07 07:24:04.000000','2023-01-22 15:58:38.363588','התלמיד התעורר בזמן לזום הבוקר','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(354,'2021-11-08 19:09:09.000000','2023-01-22 15:58:38.363588','התלמיד עבד בשיתוף פעולה פורה עם חבריו','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(355,'2021-11-09 23:08:47.000000','2023-01-22 15:58:38.363588','התלמיד שמח בשיעור ותורם לנו בהשתתפותו','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(356,'2021-11-10 16:36:18.000000','2023-01-22 15:58:38.363588','מגלה בגרות בהתנהגותו בדרך ארץ יוצאים מן הכלל','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(357,'2021-11-11 11:06:19.000000','2023-01-22 15:58:38.363588','הבוקר נפתח בתפילה זכה, והכל בזכות התלמיד.','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(358,'2021-11-25 15:39:17.000000',NULL,'الطالب قام بأداء وظيفته بمسؤولية تامة','other','MALE','ar',NULL,NULL),(359,'2021-11-25 15:39:25.000000',NULL,'إشترك الطالب في التعلّم عن بُعد بشكل فعّال','other','MALE','ar',NULL,NULL),(360,'2021-11-25 15:39:26.000000',NULL,'الطالب فتح درس الزوم في الوقت المحدد','other','MALE','ar',NULL,NULL),(361,'2021-11-25 15:39:26.000000',NULL,'ساعد الطالب صديقه في التعامل مع مشكلة في الحاسوب (الزوم)','other','MALE','ar',NULL,NULL),(362,'2021-11-25 15:39:26.000000',NULL,'الطالب استعمل الخليوي كي يجيب على الاسئلة التي وجهت له عبر البرنامج المحوسب','other','MALE','ar',NULL,NULL),(363,'2021-11-25 15:39:26.000000',NULL,'الطالبة قامت بأداء وظيفتها بمسؤولية تامة','other','FEMALE','ar',NULL,NULL),(364,'2021-11-25 15:39:27.000000',NULL,'إشتركت الطالبة في التعلّم عن بُعد بشكل فعّال','other','FEMALE','ar',NULL,NULL),(365,'2021-11-25 15:39:27.000000',NULL,'الطالبة فتحت درس الزوم في الوقت المحدد','other','FEMALE','ar',NULL,NULL),(366,'2021-11-25 15:39:27.000000',NULL,'ساعدت الطالبة صديقتها في التعامل مع مشكلة في الحاسوب (الزوم)','other','FEMALE','ar',NULL,NULL),(367,'2021-11-25 15:39:28.000000',NULL,'الطالبة استعملت الخليوي كي تجيب على الاسئلة التي وجهت لها عبر البرنامج المحوسب','other','FEMALE','ar',NULL,NULL),(368,'2021-11-25 15:39:28.000000',NULL,'إشتراك الطّالبة في الدرس بصورة ممتازة','educational','FEMALE','ar',NULL,NULL),(369,'2021-11-25 15:39:28.000000',NULL,'الطالبة حضّرت وظائفها بصورة جيدة','educational','FEMALE','ar',NULL,NULL),(370,'2021-11-25 15:39:29.000000',NULL,'الطالبة اجابت على الاسئلة التي وجهها المعلم لها اثناء الدرس','educational','FEMALE','ar',NULL,NULL),(371,'2021-11-25 15:39:29.000000',NULL,'إشتراك فعّال خلال الدرس','educational','FEMALE','ar',NULL,NULL),(372,'2021-11-25 15:39:29.000000',NULL,'الطالبة  نفذت المهام التي القيت عليها اثناء الدرس','educational','FEMALE','ar',NULL,NULL),(373,'2021-11-25 15:39:29.000000',NULL,'الطالبة كتبت ملاحظات على الدفتر اثناء الدرس','educational','FEMALE','ar',NULL,NULL),(374,'2021-11-25 15:39:30.000000',NULL,'إشتراك الطّالب في الدرس بصورة ممتازة','educational','MALE','ar',NULL,NULL),(375,'2021-11-25 15:39:30.000000',NULL,'الطالب حضّر وظائفه بصورة جيدة','educational','MALE','ar',NULL,NULL),(376,'2021-11-25 15:39:30.000000',NULL,'الطالب اجاب على الاسئلة التي وجهها المعلم له اثناء الدرس','educational','MALE','ar',NULL,NULL),(377,'2021-11-25 15:39:31.000000',NULL,'إشتراك فعّال خلال الدرس','educational','MALE','ar',NULL,NULL),(378,'2021-11-25 15:39:31.000000',NULL,'الطالب نفذ المهام التي القيت عليه اثناء الدرس','educational','MALE','ar',NULL,NULL),(379,'2021-11-25 15:39:31.000000',NULL,'الطالب كتب ملاحظات على الدفتر اثناء الدرس','educational','MALE','ar',NULL,NULL),(380,'2021-11-25 15:39:32.000000',NULL,'الطالب حساس لباقي الزملاء','emotional','MALE','ar',NULL,NULL),(381,'2021-11-25 15:39:32.000000',NULL,'االطالب تغلب اليوم على صعوبات واجهته','emotional','MALE','ar',NULL,NULL),(382,'2021-11-25 15:39:32.000000',NULL,'الطالب اظهر سلوك كطالب بالغ في المدرسة','emotional','MALE','ar',NULL,NULL),(383,'2021-11-25 15:39:32.000000',NULL,'لدى الطالب القدرة لتقبل الانتقادات','emotional','MALE','ar',NULL,NULL),(384,'2021-11-25 15:39:33.000000',NULL,'الطالبة حساسة لباقي الزميلات','emotional','FEMALE','ar',NULL,NULL),(385,'2021-11-25 15:39:33.000000',NULL,'االطالبة تغلبت اليوم على صعوبات واجهتها','emotional','FEMALE','ar',NULL,NULL),(386,'2021-11-25 15:39:33.000000',NULL,'الطالبة اظهر سلوك كطالبة بالغة في المدرسة','emotional','FEMALE','ar',NULL,NULL),(387,'2021-11-25 15:39:33.000000',NULL,'لدى الطالبة القدرة لتقبل الانتقادات','emotional','FEMALE','ar',NULL,NULL),(388,'2021-11-25 15:39:34.000000',NULL,'الطالبة تشارك مع صديقاتها في الاستراحة','social','FEMALE','ar',NULL,NULL),(389,'2021-11-25 15:39:34.000000',NULL,'الطالبة تتعاون مع صديقاتها','social','FEMALE','ar',NULL,NULL),(390,'2021-11-25 15:39:34.000000',NULL,'الطالبة تملك روح القيادة','social','FEMALE','ar',NULL,NULL),(391,'2021-11-25 15:39:35.000000',NULL,'الطالبة متسامحة مع الآخرين','social','FEMALE','ar',NULL,NULL),(392,'2021-11-25 15:39:35.000000',NULL,'الطالبة تحترم الاخرين','social','FEMALE','ar',NULL,NULL),(393,'2021-11-25 15:39:35.000000',NULL,'الطالبا لديها روح التطوع','social','FEMALE','ar',NULL,NULL),(394,'2021-11-25 15:39:35.000000',NULL,'الطالبة تشجع زميلاتها اثناء القيام بمهام تعليمية','social','FEMALE','ar',NULL,NULL),(395,'2021-11-25 15:39:36.000000',NULL,'الطالب يتشارك مع اصدقاءه في الاستراحة','social','MALE','ar',NULL,NULL),(396,'2021-11-25 15:39:36.000000',NULL,'الطالب يتعاون مع اصدقاءه','social','MALE','ar',NULL,NULL),(397,'2021-11-25 15:39:36.000000',NULL,'الطالب يملك روح  القيادة','social','MALE','ar',NULL,NULL),(398,'2021-11-25 15:39:36.000000',NULL,'الطالب متسامح مع الآخرين','social','MALE','ar',NULL,NULL),(399,'2021-11-25 15:39:37.000000',NULL,'الطالب يحترم الاخرين','social','MALE','ar',NULL,NULL),(400,'2021-11-25 15:39:37.000000',NULL,'الطالب لديه روح التطوع','social','MALE','ar',NULL,NULL),(401,'2021-11-25 15:39:37.000000',NULL,'الطالب يشجع زملاءه اثناء القيام بمهام تعليمية','social','MALE','ar',NULL,NULL),(402,'2021-12-28 16:05:06.000000','2023-01-22 15:58:38.363588','התלמיד עזר היום בבוקר לארגן את הכיתה ללמידה.','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(403,'2021-12-28 16:05:41.000000','2023-01-22 15:58:38.363588','התלמידה עזרה היום בבוקר לארגן את הכיתה ללמידה.','other','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(404,'2021-12-28 16:06:41.000000','2023-01-22 15:58:38.363588','התלמיד השתתף מאוד יפה בשיעור עברית.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(405,'2021-12-28 16:07:12.000000','2023-01-22 15:58:38.363588','התלמידה השתתפה מאוד יפה בשיעור עברית.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(408,'2021-12-28 16:08:34.000000','2023-01-22 15:58:38.363588','התלמיד השתתף מאוד יפה בשיעור גיאומטריה.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(409,'2021-12-28 16:09:02.000000','2023-01-22 15:58:38.363588','התלמידה השתתפה מאוד יפה בשיעור מתמטיקה.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(410,'2021-12-28 16:09:46.000000','2023-01-22 15:58:38.363588','התלמיד השתתף מאוד יפה בשיעור מתמטיקה.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(411,'2021-12-28 16:10:29.000000','2023-01-22 15:58:38.363588','התלמידה השתתפה מאוד יפה בשיעור גיאומטריה.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(412,'2022-01-07 09:22:18.000000','2023-01-22 15:58:38.363588','התלמיד עבד יפה מאוד בשיעור ','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(413,'2022-01-07 09:23:06.000000','2023-01-22 15:58:38.363588','התלמידה עבדה יפה בשיעור','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(415,'2022-03-05 21:15:17.000000','2023-01-22 15:58:38.363588','משתתף באופן פעיל ומדבר בהצבעה','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(416,'2022-03-10 23:06:20.000000','2023-01-22 15:58:38.363588','תענוג ללמד את התלמידה ','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(417,'2022-05-12 15:09:34.000000','2023-01-22 15:58:38.363588','התלמידה עבדה מקסים בשיעור כתיב, כיף להיות המורה שלה','social','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(418,'2022-05-12 15:10:03.000000','2023-01-22 15:58:38.363588','התלמיד עבד מקסים בשיעור כתיב, כיף להיות המורה שלו','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(419,'2022-05-25 06:27:23.000000','2023-01-22 15:58:38.363588','התלמידה עבדה יפה מאוד בשיעור עברית, כל הכבוד.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(420,'2022-08-09 06:03:40.000000',NULL,'התלמידה שואלת שאלות נהדרות','educational','FEMALE','he',16,NULL),(421,'2022-08-09 06:03:40.000000',NULL,'התלמידה מתפתחת התנהגותית נהדר','emotional','FEMALE','he',16,NULL),(422,'2022-08-09 06:03:40.000000',NULL,'התלמיד התנהג יפה טסטט','social','MALE','he',16,NULL),(423,'2022-08-09 06:11:29.000000',NULL,'התלמיד התנהג יפה','social','MALE','he',16,NULL),(424,'2022-08-09 06:12:29.000000',NULL,'התלמידה מתddd התנהגותית נהדר','emotional','FEMALE','he',16,NULL),(425,'2022-09-13 06:10:51.000000','2023-01-22 15:58:38.363588','עוזרת מקסים לחברות. מתנדבת למשימות מתוך שמחה. בעלת מידות טובות ולב טוב. גאה בך.','social','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(426,'2022-09-13 06:11:39.000000','2023-01-22 15:58:38.363588','לומדת מתוך שמחה, בחריצות ואהבה, גם שקשה קצת לא מתייאשת ובכל הכח משקיעה מדהים.','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(427,'2022-09-14 12:38:46.000000','2023-01-22 15:58:38.363588','התלמיד היקר, התפללת בצורה נפלאה היום, גאה בך מאד. ','social','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(428,'2022-09-14 18:39:09.000000','2023-01-22 15:58:38.363588','התלמיד עבד היום בשיעור בצורה נהדרת, והעתיק למחברתו במאמץ את כל החומר הנלמד, יישר כח','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(430,'2022-09-15 05:00:16.000000','2023-01-22 15:58:38.363588','מקפידה להיות מוכנה בזמן עם הציוד הנדרש לכל שיעור , יישר כח!','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(433,'2022-09-22 15:52:53.000000','2023-01-22 15:58:38.363588','התלמיד נטל חלק פעיל בשיעור שפה והשתתף יפה במהלך השיעור.','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(434,'2022-09-22 15:53:02.000000','2023-01-22 15:58:38.363588','התלמידה נטלה חלק פעיל בשיעור שפה והשתתפה יפה במהלך השיעור.','educational','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(435,'2022-09-22 16:07:53.000000','2023-01-22 15:58:38.363588','התלמידה דאגה לאירגון וסידור ספריית בית הספר במסירות ובאחריות רבה.','other','FEMALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(436,'2022-09-22 16:08:13.000000','2023-01-22 15:58:38.363588','התלמיד דאג לאירגון וסידור ספריית בית הספר במסירות ובאחריות רבה.','other','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(441,'2022-10-24 18:48:36.000000','2023-01-22 15:58:38.363588','להורי איקס. בנכם נעים הליכות ובעל דרך ארץ. ממש כיף שהוא נמצא בכיתה','social','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(443,'2022-10-24 18:50:24.000000','2023-01-22 15:58:38.363588','יישר כח לאיקס על הלמידה בשיעור נביא. אשרי מי שעמלו בתורה','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(444,'2022-10-24 18:52:08.000000','2023-01-22 15:58:38.363588','להורי איקס. בנכם נעים הליכות ובעל דרך ארץ. כיף כשהוא נמצא בכיתה','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(447,'2022-10-24 18:54:28.000000','2023-01-22 15:58:38.363588','להורי איקס. יש לכם ילד נעים הליכות עם דרך ארץ. תענוג שהוא בכיתה שלנו','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(448,'2022-10-24 18:57:02.000000','2023-01-22 15:58:38.363588','איקס היקר. אני מאוד שמח מלמידתך בשיעורים שלנו. המשך כך. שבוע טוב שיהיה לך','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(449,'2022-10-24 18:57:13.000000','2023-01-22 15:58:38.363588','איקס היקר. אני מאוד שמח מלמידתך בשיעורים שלנו. המשך כך. שבוע טוב שיהיה לך','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(450,'2022-10-24 18:59:35.000000','2023-01-22 15:58:38.363588','איקס היקר יישר כח על למידה יפה ושינון המשניות בשיעור משנה. המשך כך!','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(451,'2022-10-25 13:25:03.000000','2023-01-22 15:58:38.363588','יישר כח לאיקס על תפילת ראש חודש מתוקה. חודש טוב. עמית','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(452,'2022-10-27 05:00:12.000000','2023-01-22 15:58:38.363588','התלמיד מתפלל מתוך חשק ושמחה כל הכבוד לך !  ','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(454,'2022-10-30 13:22:20.000000','2023-01-22 15:58:38.363588','התאמצת היום מאוד ולא ויתרת. כל הכבוד!!!','other','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(455,'2022-10-30 13:22:51.000000','2023-01-22 15:58:38.363588','התאמצת היום מאוד ולא ויתרת. כל הכבוד!!!','educational','NONE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(456,'2022-11-03 06:22:48.000000','2023-01-22 15:58:38.363588','התלמיד מקפיד להתפלל בקול מתוך הסידור','educational','MALE','he',NULL,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(457,'2022-11-04 06:10:00.000000','2023-01-22 15:59:11.709470','התלמידה התפללה נפלא באופן מכבד ובקול נעים','social','FEMALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(458,'2022-11-04 10:08:34.000000','2023-01-22 15:59:11.709470','התלמיד הנפלא קרא יפה בפני כל החברים את הסיפור שכתב בעצמו . אליפות  ','social','MALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(459,'2022-11-07 06:54:31.000000','2023-01-22 15:59:11.709470','התלמידה הראתה דוגמא חסידית נאותה','other','FEMALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(460,'2022-11-08 09:40:05.000000','2023-01-22 15:59:11.709470','תענוג גדול היה לראות את בנכם מתפלל הבוקר. בחשק ובשמחה. יהי רצון ויתקבלו תפילותיו לפני הקב\"ה','educational','NONE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(461,'2022-11-08 18:26:12.000000','2023-01-22 15:59:11.709470','התלמיד השתתף היום בשיעור בצורה יוצאת דופן','educational','MALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(462,'2022-11-08 19:19:10.000000','2023-01-22 15:59:11.709470','כמה טוב שאת בערמונים','emotional','NONE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(464,'2022-11-09 18:40:19.000000','2023-01-22 15:59:11.709470','התלמידה למדה ברצינות בשיעור אנגלית היום. ישר כח!','educational','FEMALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(465,'2022-11-10 13:40:04.000000','2023-01-22 15:59:11.709470','התלמידה השתתפה יפה היום בשיעור ופעלה בהתאם להוראות ','other','FEMALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(466,'2022-11-13 07:35:27.000000','2023-01-22 15:59:11.709470',' התלמידה המקסימה התפללה היום בנחת ושמחה מתוך הסידור.יהי רצון שתפילתה תתקבל.','other','FEMALE','he',NULL,'167f88d5-8763-11ed-a031-1c1bb51f4c1c'),(467,'2023-04-17 09:54:16.922393','2023-04-17 09:54:16.922393','התלמיד להלהלהלהלהלהללההללהלהל להללהלהלהלה להלהלהלהלהל להלהלהלהל','emotional','MALE','he',NULL,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(469,'2023-05-09 12:39:51.334755','2023-05-09 12:39:51.334755','התלמיד קפץ יפה','other','MALE','he',NULL,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(470,'2023-05-09 14:37:48.784255','2023-05-09 14:37:48.784255','התלמיד היה טוב','other','MALE','he',NULL,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(471,'2023-06-07 15:06:54.501480','2023-06-07 15:06:54.501480','התלמיד צריך להיות שמח','social','MALE','he',NULL,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(472,'2023-06-11 17:32:35.547251','2023-06-11 17:32:35.547251','היום התלמידה התנהגה סופר יפה!!','other','FEMALE','he',NULL,'167f840d-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `preset_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `removed_preset_messages`
--

DROP TABLE IF EXISTS `removed_preset_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `removed_preset_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `preset_message_id` int DEFAULT NULL,
  `teacher_id` varchar(36) DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a689766acdaccf17c42be9d281f` (`preset_message_id`),
  KEY `FK_f12913dd33647ff1f4161ff2213` (`school_id`),
  KEY `FK_27d0f3881f160c4724c24646b05` (`teacher_id`),
  CONSTRAINT `FK_27d0f3881f160c4724c24646b05` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a689766acdaccf17c42be9d281f` FOREIGN KEY (`preset_message_id`) REFERENCES `preset_messages` (`id`),
  CONSTRAINT `FK_f12913dd33647ff1f4161ff2213` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `removed_preset_messages`
--

LOCK TABLES `removed_preset_messages` WRITE;
/*!40000 ALTER TABLE `removed_preset_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `removed_preset_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `roleKey` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'TEACHER','teacher','miremerijfgivn238svnsdfsdf'),(2,'ADMIN','school principal','gmrkipgm$2300femkFSFKeo375'),(3,'SUPERADMIN','Hilma admin','spf%#kfpoFFAa2234adAA244asZZv');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `gpt_token_count` int NOT NULL DEFAULT '0',
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,420208,'חן השומרון','2022-12-29 12:26:09.716827',0,NULL),(2,987654,'hilma','2022-12-29 12:26:09.716827',0,NULL),(44,123456,'הילה שלום','2023-06-14 11:48:57.705826',0,NULL);
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms`
--

DROP TABLE IF EXISTS `sms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int DEFAULT NULL,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL,
  `parts` tinyint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3759f97d39d3e61d7bd77a0c261` (`schoolId`),
  CONSTRAINT `FK_3759f97d39d3e61d7bd77a0c261` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88360 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms`
--

LOCK TABLES `sms` WRITE;
/*!40000 ALTER TABLE `sms` DISABLE KEYS */;
/*!40000 ALTER TABLE `sms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms_spam`
--

DROP TABLE IF EXISTS `sms_spam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sms_spam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d82e5145eda9a2ca635afeff8c` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_spam`
--

LOCK TABLES `sms_spam` WRITE;
/*!40000 ALTER TABLE `sms_spam` DISABLE KEYS */;
INSERT INTO `sms_spam` VALUES (1,'+972525522172');
/*!40000 ALTER TABLE `sms_spam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `starred_user_class`
--

DROP TABLE IF EXISTS `starred_user_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `starred_user_class` (
  `user_id` varchar(36) NOT NULL,
  `class_id` int NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`class_id`),
  KEY `FK_05d19b6bbdc14ab204f095b8317` (`class_id`),
  CONSTRAINT `FK_05d19b6bbdc14ab204f095b8317` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_5e37ddfebdb678be218a5a96eda` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `starred_user_class`
--

LOCK TABLES `starred_user_class` WRITE;
/*!40000 ALTER TABLE `starred_user_class` DISABLE KEYS */;
INSERT INTO `starred_user_class` VALUES ('167f840d-8763-11ed-a031-1c1bb51f4c1c',1,NULL),('167f840d-8763-11ed-a031-1c1bb51f4c1c',3,NULL),('167f840d-8763-11ed-a031-1c1bb51f4c1c',164,NULL),('167f840d-8763-11ed-a031-1c1bb51f4c1c',165,NULL),('167f840d-8763-11ed-a031-1c1bb51f4c1c',166,NULL),('167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL);
/*!40000 ALTER TABLE `starred_user_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_in_study_group`
--

DROP TABLE IF EXISTS `student_in_study_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_in_study_group` (
  `studyGroupId` int NOT NULL,
  `studentsId` int NOT NULL,
  PRIMARY KEY (`studyGroupId`,`studentsId`),
  KEY `IDX_1a14b328e566586de9e045134a` (`studyGroupId`),
  KEY `IDX_c21d4b806343f1967567f881e8` (`studentsId`),
  CONSTRAINT `FK_1a14b328e566586de9e045134a2` FOREIGN KEY (`studyGroupId`) REFERENCES `study_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_c21d4b806343f1967567f881e8a` FOREIGN KEY (`studentsId`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_in_study_group`
--

LOCK TABLES `student_in_study_group` WRITE;
/*!40000 ALTER TABLE `student_in_study_group` DISABLE KEYS */;
INSERT INTO `student_in_study_group` VALUES (2,28443),(4,28443),(11,28444);
/*!40000 ALTER TABLE `student_in_study_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `class_id` int DEFAULT NULL,
  `gp_count` tinyint unsigned DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER','NONE') DEFAULT NULL,
  `phone_number_1` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone_number_2` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `phone_number_3` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone_number` varchar(14) DEFAULT NULL,
  `phone_number_4` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aa8edc7905ad764f85924569647` (`school_id`),
  KEY `FK_de6ad4ae6936dce474e2823984e` (`class_id`),
  FULLTEXT KEY `IDX_7eed714fbf4ca56aa5c5395d43` (`first_name`,`last_name`),
  CONSTRAINT `FK_aa8edc7905ad764f85924569647` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_de6ad4ae6936dce474e2823984e` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28447 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'2020-05-25 12:19:54.000000','2023-06-13 10:30:37.184566',5,0,'MALE','972525522172',NULL,'חיים','גולן',2,'0529944848','0529944848',NULL),(2,'2020-05-25 13:36:36.000000','2023-06-13 10:30:37.184566',5,0,'FEMALE','972123456789','972123456789','עדי','בן שמואל',2,'0529944848','0529944848',NULL),(3,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'MALE','972546969090',NULL,'ויזלי','פרד',2,'0529944848','0529944848',NULL),(4,'2020-05-26 10:26:57.000000','2023-05-29 09:37:22.577358',5,0,'MALE','972546969090','972546969090','פוטר','סנייפ',2,'0529944848','0529944848',NULL),(5,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'FEMALE','972546969090','972546969090','נעל','עדי',2,'0529944848','0529944848',NULL),(7,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'FEMALE','972525522172','972546969090','בת תנוס','גמורה',2,'0529944848','0529944848',NULL),(8,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'MALE','972546969090','972546969090','בן שמואל','טוני',2,'0529944848','0529944848',NULL),(9,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'FEMALE','972546969090','972546969090','גרין','סוזי',2,'0529944848','0529944848',NULL),(11,'2020-05-26 10:26:57.000000','2023-06-13 10:30:37.184566',5,0,'MALE','972546969090','972525522172','להיכנס','מנסה',2,NULL,NULL,NULL),(28443,'2023-06-08 17:17:45.507888','2023-06-15 13:35:44.000000',1607,NULL,'FEMALE',NULL,NULL,'רעות','שרמר',1,NULL,'',NULL),(28444,'2023-06-08 17:18:04.503870','2023-06-15 13:12:16.000000',1,NULL,'MALE',NULL,NULL,'משה','מושקוביץ',1,NULL,'',NULL),(28445,'2023-06-12 17:11:56.956143','2023-06-14 12:50:52.000000',164,NULL,'FEMALE',NULL,'','שני רבקה','קהתי',1,'','',''),(28446,'2023-06-25 12:59:43.160397','2023-06-25 12:59:43.160397',14,NULL,'FEMALE',NULL,NULL,'מיכל','שגיא',1,NULL,'',NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_group`
--

DROP TABLE IF EXISTS `study_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  `school_id` int DEFAULT NULL,
  `teacher_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7186e4dbd1838ae10213694abfe` (`teacher_id`),
  KEY `FK_516354a21459cbd381b26881a26` (`school_id`),
  CONSTRAINT `FK_516354a21459cbd381b26881a26` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_7186e4dbd1838ae10213694abfe` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_group`
--

LOCK TABLES `study_group` WRITE;
/*!40000 ALTER TABLE `study_group` DISABLE KEYS */;
INSERT INTO `study_group` VALUES (2,'2023-05-23 12:19:13.875745','2023-05-23 12:19:13.875745','TEST 1',1,NULL),(4,'2023-05-23 12:19:48.596035','2023-05-23 12:19:48.596035','TEST 1',1,NULL),(5,'2023-05-23 16:32:11.774970','2023-05-23 16:32:11.774970','כיתה חדשה',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(6,'2023-06-07 11:04:09.751597','2023-06-07 11:04:09.751597','רוני רוני',1,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(7,'2023-06-08 09:02:33.952713','2023-06-08 17:17:17.000000','כיתה בג',1,NULL),(8,'2023-06-08 09:06:05.886480','2023-06-08 17:17:17.000000','שש',1,NULL),(9,'2023-06-08 09:06:20.718498','2023-06-08 09:06:20.718498','/////',1,NULL),(11,'2023-06-14 11:45:07.638454','2023-06-14 11:45:07.638454','חשבון ',1,'167f875f-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `study_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_group_grades`
--

DROP TABLE IF EXISTS `study_group_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_group_grades` (
  `grade` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL,
  `study_group_id` int NOT NULL,
  PRIMARY KEY (`grade`,`study_group_id`),
  KEY `FK_3a7e0c51b5d7006570127d5d66d` (`study_group_id`),
  CONSTRAINT `FK_3a7e0c51b5d7006570127d5d66d` FOREIGN KEY (`study_group_id`) REFERENCES `study_group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_group_grades`
--

LOCK TABLES `study_group_grades` WRITE;
/*!40000 ALTER TABLE `study_group_grades` DISABLE KEYS */;
INSERT INTO `study_group_grades` VALUES ('8',2),('11',2),('1',4),('6',4),('8',4),('9',4),('11',4),('2',5),('3',5),('1',6),('3',6),('2',7),('3',7),('2',8),('3',9),('1',11),('5',11),('7',11);
/*!40000 ALTER TABLE `study_group_grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_classes`
--

DROP TABLE IF EXISTS `teacher_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_classes` (
  `classesId` int NOT NULL,
  `userId` varchar(36) NOT NULL,
  PRIMARY KEY (`classesId`,`userId`),
  KEY `IDX_27d48770db7c0bfbb2817c3757` (`classesId`),
  KEY `IDX_57c5209040e29017a723269d18` (`userId`),
  CONSTRAINT `FK_27d48770db7c0bfbb2817c37574` FOREIGN KEY (`classesId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_57c5209040e29017a723269d18e` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_classes`
--

LOCK TABLES `teacher_classes` WRITE;
/*!40000 ALTER TABLE `teacher_classes` DISABLE KEYS */;
INSERT INTO `teacher_classes` VALUES (1,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(1,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(6,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(7,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(14,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(15,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(165,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(590,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(917,'167f840d-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `teacher_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_starred_study_group`
--

DROP TABLE IF EXISTS `teacher_starred_study_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_starred_study_group` (
  `userId` varchar(36) NOT NULL,
  `studyGroupId` int NOT NULL,
  PRIMARY KEY (`userId`,`studyGroupId`),
  KEY `IDX_c26834a270629fe2b2051c6c83` (`userId`),
  KEY `IDX_e667de1ecce36c36297eebe26a` (`studyGroupId`),
  CONSTRAINT `FK_c26834a270629fe2b2051c6c832` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e667de1ecce36c36297eebe26ad` FOREIGN KEY (`studyGroupId`) REFERENCES `study_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_starred_study_group`
--

LOCK TABLES `teacher_starred_study_group` WRITE;
/*!40000 ALTER TABLE `teacher_starred_study_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_starred_study_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers_good_points`
--

DROP TABLE IF EXISTS `teachers_good_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers_good_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `text` varchar(255) NOT NULL,
  `gp_link_hash` varchar(100) DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `sender_id` varchar(36) DEFAULT NULL,
  `receiver_id` varchar(36) DEFAULT NULL,
  `is_read` tinyint unsigned NOT NULL DEFAULT '0',
  `reaction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_4117d5bdb01b097483802a9b2b` (`reaction_id`),
  KEY `FK_84e8903240a901a20a6fa37df9e` (`sender_id`),
  KEY `FK_8f12643bd6cd68c95580c162967` (`receiver_id`),
  KEY `IDX_3a1c82c51f2f66182c71cbbec2` (`is_read`),
  KEY `FK_c749a47e20a9a261cbd57063b44` (`school_id`),
  CONSTRAINT `FK_4117d5bdb01b097483802a9b2bf` FOREIGN KEY (`reaction_id`) REFERENCES `teachers_good_points_reaction` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_84e8903240a901a20a6fa37df9e` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_8f12643bd6cd68c95580c162967` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_c749a47e20a9a261cbd57063b44` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers_good_points`
--

LOCK TABLES `teachers_good_points` WRITE;
/*!40000 ALTER TABLE `teachers_good_points` DISABLE KEYS */;
INSERT INTO `teachers_good_points` VALUES (1,'2023-03-15 10:04:40.681626','2023-07-02 13:25:43.000000','סופר קוללללללללל',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(2,'2023-03-15 10:05:08.495637','2023-07-02 13:25:43.000000','פוקוסססס',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(3,'2023-03-15 10:05:21.703825','2023-07-02 13:25:43.000000','שיייייייי',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(4,'2023-03-16 18:18:25.453941','2023-07-02 13:25:43.000000','djsiajdoiajs',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(5,'2023-03-16 18:18:27.063871','2023-07-02 13:25:43.000000','jdoisjfiods',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(6,'2023-03-16 18:18:28.064928','2023-07-02 13:25:43.000000','fjdsiojoi',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(7,'2023-03-16 18:18:28.943728','2023-07-02 13:25:43.000000','fdjsiojoi',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(8,'2023-03-16 18:18:30.072506','2023-07-02 13:25:43.000000','jiofjiojoifds',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(9,'2023-03-23 12:05:44.633318','2023-07-02 13:25:43.000000','אני על זה ',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(10,'2023-04-03 16:19:03.490828','2023-05-23 11:09:42.000000','תותחיתתת',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f8550-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(11,'2023-05-09 12:32:20.253805','2023-05-09 12:32:20.253805','תודההה\n',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f875f-8763-11ed-a031-1c1bb51f4c1c',0,NULL),(12,'2023-05-09 12:32:38.362355','2023-07-03 12:07:23.000000','בגדבדג\n',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f840d-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(13,'2023-05-09 12:32:45.488800','2023-07-03 12:07:23.000000','בגדב\nבגדבדגב\n',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f840d-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(14,'2023-05-10 14:21:25.205503','2023-05-10 14:21:25.205503','הייייי',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f875f-8763-11ed-a031-1c1bb51f4c1c',0,NULL),(15,'2023-05-10 15:02:13.724329','2023-05-10 15:02:13.724329','15456',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f875f-8763-11ed-a031-1c1bb51f4c1c',0,NULL),(16,'2023-06-12 17:09:14.603788','2023-07-02 13:25:43.000000','שיח בינינו!',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,17),(17,'2023-06-12 17:20:21.777662','2023-06-12 17:20:21.777662','עיחגכעיגחלכעיכחגליע',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f875f-8763-11ed-a031-1c1bb51f4c1c',0,NULL),(18,'2023-06-12 17:23:20.154081','2023-07-03 12:07:23.000000','הארי! הארייייייי',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f840d-8763-11ed-a031-1c1bb51f4c1c',1,15),(19,'2023-06-12 17:25:07.845026','2023-07-03 12:07:23.000000','האערי',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f840d-8763-11ed-a031-1c1bb51f4c1c',1,14),(20,'2023-06-12 17:25:20.908049','2023-07-03 12:07:23.000000','עכיעע',NULL,1,'167f865c-8763-11ed-a031-1c1bb51f4c1c','167f840d-8763-11ed-a031-1c1bb51f4c1c',1,12),(21,'2023-06-12 17:26:00.845302','2023-07-02 13:25:43.000000','שניייייייי\nשניייייייייייייייייייי',NULL,1,'167f840d-8763-11ed-a031-1c1bb51f4c1c','167f865c-8763-11ed-a031-1c1bb51f4c1c',1,16);
/*!40000 ALTER TABLE `teachers_good_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers_good_points_reaction`
--

DROP TABLE IF EXISTS `teachers_good_points_reaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers_good_points_reaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reaction` enum('BLUSH','FUNNY','ANGLE','BLESSED','PARTY') NOT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers_good_points_reaction`
--

LOCK TABLES `teachers_good_points_reaction` WRITE;
/*!40000 ALTER TABLE `teachers_good_points_reaction` DISABLE KEYS */;
INSERT INTO `teachers_good_points_reaction` VALUES (12,'ANGLE','2023-06-13 17:06:47.027393'),(14,'BLESSED','2023-06-14 11:51:41.231460'),(15,'BLESSED','2023-06-14 11:52:26.398801'),(16,'FUNNY','2023-06-15 12:57:00.787813'),(17,'PARTY','2023-06-15 12:57:06.106789');
/*!40000 ALTER TABLE `teachers_good_points_reaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `two_factor`
--

DROP TABLE IF EXISTS `two_factor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `two_factor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `attempt` tinyint unsigned NOT NULL DEFAULT '0',
  `code_created_date` timestamp(6) NULL DEFAULT NULL,
  `user_blocked_date` timestamp(6) NULL DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_162c7f53b41b84102a8e06eff1` (`user_id`),
  CONSTRAINT `FK_162c7f53b41b84102a8e06eff18` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `two_factor`
--

LOCK TABLES `two_factor` WRITE;
/*!40000 ALTER TABLE `two_factor` DISABLE KEYS */;
/*!40000 ALTER TABLE `two_factor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER','NONE') DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `preferences` varchar(255) DEFAULT '{}',
  `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `preferredLanguage` enum('he','ar') DEFAULT 'he',
  `phone_number` varchar(14) DEFAULT NULL,
  `notify_date` datetime DEFAULT NULL,
  `system_notifications` tinyint DEFAULT '1',
  `emailVerified` tinyint DEFAULT '1',
  `verificationToken` varchar(150) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  KEY `IDX_31ef2b4d30675d0c15056b7f6e` (`type`),
  KEY `IDX_6f5e46b974cb645c4d53b544fe` (`notify_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('$2b$10$BII0Hl.rdj9S41CLl8RAsuCfVvd8G06g6GJJx.hfV5lDEIq5nsfGS','Jane.Smith5678@school.edu','FEMALE','לירז','בשארי','{}','2023-06-14 11:47:46.305998','05720e61-0134-45b5-b02c-c86b98c67ae9','staff','2023-06-14 11:47:46.305998','he','542777006',NULL,1,1,NULL,NULL),('$2b$10$nRNn3/xXxF8TzsraOUAdL.9doclFXdbvHjTpKPbqzmr4jZ6hHCzvO','harry@ms.com','MALE','הארי','פוטר','{\"firstLogin\":false,\"firstAdminLogin\":false,\"firstOpeningSentences\":false}','2020-12-29 15:59:31.240693','167f840d-8763-11ed-a031-1c1bb51f4c1c','staff','2023-06-14 17:40:46.000000','he','',NULL,1,1,NULL,NULL),('$2b$10$nRNn3/xXxF8TzsraOUAdL.9doclFXdbvHjTpKPbqzmr4jZ6hHCzvO','hermione@ms.com','FEMALE','הרמיוני','גריינגר','{}','2020-12-29 15:59:31.240693','167f8550-8763-11ed-a031-1c1bb51f4c1c','staff','2022-12-29 12:26:09.674848','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$nRNn3/xXxF8TzsraOUAdL.9doclFXdbvHjTpKPbqzmr4jZ6hHCzvO','ron@ms.com','MALE','רון','וויזלי','{\"firstLogin\":false,\"firstAdminLogin\":false,\"firstOpeningSentences\":false}','2020-12-29 15:59:31.240693','167f865c-8763-11ed-a031-1c1bb51f4c1c','staff','2023-05-09 12:54:01.000000','he','0525522172',NULL,1,1,NULL,NULL),('$2b$10$nRNn3/xXxF8TzsraOUAdL.9doclFXdbvHjTpKPbqzmr4jZ6hHCzvO','bellatrix@ms.com','MALE','בלטריקס','לסטריינג','{}','2020-12-29 15:59:31.240693','167f875f-8763-11ed-a031-1c1bb51f4c1c','staff','2023-06-12 10:55:32.000000','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$nRNn3/xXxF8TzsraOUAdL.9doclFXdbvHjTpKPbqzmr4jZ6hHCzvO','tom@ms.com','MALE','טום','רידל','{\"firstLogin\":false,\"firstAdminLogin\":false,\"firstOpeningSentences\":false}','2020-12-29 15:59:31.240693','167f88d5-8763-11ed-a031-1c1bb51f4c1c','staff','2022-12-29 12:26:09.674848','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$aLnQg3dUb9EmgtZxAoa/y.31hZw10LM/4xezqRITHJRUEubrVUqRy','alallala@gmail.com','MALE','מיכאל','בדיקות','{}','2023-06-07 12:16:51.283031','3ae22afa-9816-4bcb-ad07-19f5cd96ad8b','staff','2023-06-07 16:31:16.000000','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$tyalMoGkM67IYmEtlL49luNO.AZgl57B27bEz4JGD8wIapm0cpDGW','Robert.Johnson9876@school.edu','FEMALE','עדי','גאלדור','{}','2023-06-14 11:47:46.310546','75a54048-a7c8-4249-830b-535675e2fff2','staff','2023-06-14 11:47:46.310546','he','526018144',NULL,1,1,NULL,NULL),('$2b$10$ikDfZA1nUL9yyUIN8jzBq.AaynGJMZo8b6ab5o5axT3M6CKx95KDq','shanike@hilma.tech','FEMALE','המורה','שני','{}','2023-06-12 17:17:01.922073','7cc4a4dc-1d26-48f9-9545-4b33b8e70f90','staff','2023-06-14 11:42:11.000000','he','',NULL,1,1,NULL,NULL),('$2b$10$lTCnXfKhDsB3Fbvt4VFF4uXnXeMTy9RGzd5zjFYfCGJEOnoDzFkdW','davidkingqwe@gmail.com','FEMALE','אורית','אריה היי','{}','2023-06-14 11:47:46.301798','858f75e4-5fb9-472f-9c0c-5f3c8615cd1a','staff','2023-06-22 10:48:06.000000','he','0523228752',NULL,1,1,NULL,NULL),('$2b$10$uPvYW3lgiziD7.NpGqh6cu7Cj2rMQ7n/hkNSQ3FFNgMIPF/jrCI7G','ww@w.com','MALE','להלהלה','להלהלה','{}','2023-06-08 11:34:22.188855','97cf5fd2-db69-49cd-9e90-9204f2293c84','staff','2023-06-08 11:34:22.188855','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$HWKEkWCY5PGvs.mMGvVSd.lmCS2TESLJSlWpEkhJ1p722Hcq/fxmu','Emily.Jackson2345@school.edu','MALE','יצחק','רפפורט','{}','2023-06-14 11:47:46.325417','b0859259-9017-4d6d-89bd-5997fc42b8bb','staff','2023-06-14 11:47:46.325417','he','543453359',NULL,1,1,NULL,NULL),('$2b$10$X3fJsBBAdOwVssWUFl0bt.231eqtNPDhaBKXfQlDv8KJ2svu75vy2','fs@fs.com','FEMALE','fsfds','fdsf','{}','2023-06-08 15:03:32.582407','b263aa57-a4fc-465c-9d4b-9e508091f385','staff','2023-06-08 15:03:32.582407','he',NULL,NULL,1,1,NULL,NULL),('$2b$10$2kGeZHmscRW4gHW.4b55eusESnUQv4vP8JW/2F70XXjZ5H/NDTQIq','qqq@q.com','MALE','יוני','יוני','{}','2023-06-07 16:37:41.257380','bd4030ad-f380-48c7-9a34-6cf55fa9e4bf','staff','2023-06-07 16:37:41.257380','he','',NULL,1,1,NULL,NULL),('$2b$10$Cj/kvPdSOnURWJ.tlBEnouVYRU42/EQaQqtnQGAuOijRV9eK5AHbm','Michael.Thompson8765@school.edu','FEMALE','ברכה','ברוך','{}','2023-06-14 11:47:46.321058','bed8b29f-3b10-4832-988a-aee363e62249','staff','2023-06-14 11:47:46.321058','he','524412194',NULL,1,1,NULL,NULL),('$2b$10$VDHzTMM.2nU17nuCnMOMU.PfJX5B9PhwJNHBrFiQ4RZUlsZ8BoFqe','Sarah.Wilson4321@school.edu','FEMALE','נעמה','שיינפלד','{}','2023-06-14 11:47:46.315736','df87df6b-605c-4db6-9d8c-92cc38fee705','staff','2023-06-14 11:47:46.315736','he','546341879',NULL,1,1,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_password`
--

DROP TABLE IF EXISTS `user_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_password` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_3e755bee2cdcee50a9e742776d8` (`userId`),
  CONSTRAINT `FK_3e755bee2cdcee50a9e742776d8` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2051 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_password`
--

LOCK TABLES `user_password` WRITE;
/*!40000 ALTER TABLE `user_password` DISABLE KEYS */;
INSERT INTO `user_password` VALUES (2048,'$2b$10$6R9CZ9bF7PQKOEEIc64a7ONEStiz5MOoPzg1fyGsY84jKRC0ZM5l2','3ae22afa-9816-4bcb-ad07-19f5cd96ad8b','2023-06-07 16:31:17.005313'),(2049,'$2b$10$vdg6FY7o89EKs1RM7XjbKuXtxgIFfXv6LEHD8NsOlKM/LtQz0RW/u','7cc4a4dc-1d26-48f9-9545-4b33b8e70f90','2023-06-12 17:17:24.539791'),(2050,'$2b$10$eaaHcKGWbCHW7n.8KZNHrOS.SDlJzgalf7Y77OguQO3YizcR6wNk.','7cc4a4dc-1d26-48f9-9545-4b33b8e70f90','2023-06-14 11:42:11.473457');
/*!40000 ALTER TABLE `user_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `role_id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `IDX_d0e5815877f7395a198a4cb0a4` (`user_id`),
  KEY `IDX_32a6fc2fcb019d8e3a8ace0f55` (`role_id`),
  CONSTRAINT `FK_32a6fc2fcb019d8e3a8ace0f55f` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d0e5815877f7395a198a4cb0a46` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,'05720e61-0134-45b5-b02c-c86b98c67ae9'),(1,'167f8550-8763-11ed-a031-1c1bb51f4c1c'),(1,'167f865c-8763-11ed-a031-1c1bb51f4c1c'),(1,'167f875f-8763-11ed-a031-1c1bb51f4c1c'),(1,'75a54048-a7c8-4249-830b-535675e2fff2'),(1,'7cc4a4dc-1d26-48f9-9545-4b33b8e70f90'),(1,'858f75e4-5fb9-472f-9c0c-5f3c8615cd1a'),(1,'b0859259-9017-4d6d-89bd-5997fc42b8bb'),(1,'bd4030ad-f380-48c7-9a34-6cf55fa9e4bf'),(1,'bed8b29f-3b10-4832-988a-aee363e62249'),(1,'df87df6b-605c-4db6-9d8c-92cc38fee705'),(2,'167f840d-8763-11ed-a031-1c1bb51f4c1c'),(2,'3ae22afa-9816-4bcb-ad07-19f5cd96ad8b'),(2,'97cf5fd2-db69-49cd-9e90-9204f2293c84'),(2,'b263aa57-a4fc-465c-9d4b-9e508091f385'),(3,'167f88d5-8763-11ed-a031-1c1bb51f4c1c');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_school`
--

DROP TABLE IF EXISTS `user_school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_school` (
  `school_id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role_id` int NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`school_id`,`user_id`),
  KEY `FK_e9f2e160d32efae56cecc67ff38` (`role_id`),
  KEY `FK_e347864f128a9f86925d43dcc5b` (`user_id`),
  CONSTRAINT `FK_179ab87076a96dc0ce035392f07` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e347864f128a9f86925d43dcc5b` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_e9f2e160d32efae56cecc67ff38` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_school`
--

LOCK TABLES `user_school` WRITE;
/*!40000 ALTER TABLE `user_school` DISABLE KEYS */;
INSERT INTO `user_school` VALUES (1,'05720e61-0134-45b5-b02c-c86b98c67ae9',1,NULL),(1,'167f840d-8763-11ed-a031-1c1bb51f4c1c',2,NULL),(1,'167f8550-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(1,'167f865c-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(1,'167f875f-8763-11ed-a031-1c1bb51f4c1c',1,NULL),(1,'167f88d5-8763-11ed-a031-1c1bb51f4c1c',3,NULL),(1,'75a54048-a7c8-4249-830b-535675e2fff2',1,NULL),(1,'7cc4a4dc-1d26-48f9-9545-4b33b8e70f90',1,NULL),(1,'858f75e4-5fb9-472f-9c0c-5f3c8615cd1a',1,NULL),(1,'b0859259-9017-4d6d-89bd-5997fc42b8bb',1,NULL),(1,'bed8b29f-3b10-4832-988a-aee363e62249',1,NULL),(1,'df87df6b-605c-4db6-9d8c-92cc38fee705',1,NULL),(2,'167f840d-8763-11ed-a031-1c1bb51f4c1c',2,NULL),(2,'167f8550-8763-11ed-a031-1c1bb51f4c1c',1,NULL);
/*!40000 ALTER TABLE `user_school` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-04 11:31:02
