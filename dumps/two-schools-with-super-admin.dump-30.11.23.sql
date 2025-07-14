-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: good_point
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_logger`
--

LOCK TABLES `access_logger` WRITE;
/*!40000 ALTER TABLE `access_logger` DISABLE KEYS */;
/*!40000 ALTER TABLE `access_logger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `access_token`
--

DROP TABLE IF EXISTS `access_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(600) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `modified` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `expirationDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access_token`
--

LOCK TABLES `access_token` WRITE;
/*!40000 ALTER TABLE `access_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `access_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_actions`
--

DROP TABLE IF EXISTS `admin_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `action_type` enum('NEW_YEAR') NOT NULL,
  `operating_admin_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_50f76c882ec190bd03ddf4a4a85` (`operating_admin_id`),
  CONSTRAINT `FK_50f76c882ec190bd03ddf4a4a85` FOREIGN KEY (`operating_admin_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_actions`
--

LOCK TABLES `admin_actions` WRITE;
/*!40000 ALTER TABLE `admin_actions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_actions` ENABLE KEYS */;
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
  `view_count` tinyint unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_791bf7363b36e873941775724e9` (`teacher_id`),
  KEY `FK_47ebf9f72b5e9a12e7bf0cdd5eb` (`student_id`),
  KEY `FK_fdcefa8e8a8b22a59ef800bc4ba` (`school_id`),
  CONSTRAINT `FK_47ebf9f72b5e9a12e7bf0cdd5eb` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FK_791bf7363b36e873941775724e9` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_fdcefa8e8a8b22a59ef800bc4ba` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1530 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  KEY `FK_b34c92e413c4debb6e0f23fed46` (`teacher_id`),
  KEY `FK_398f3990f5da4a1efda173f576f` (`school_id`),
  CONSTRAINT `FK_398f3990f5da4a1efda173f576f` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_b34c92e413c4debb6e0f23fed46` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=278 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (100,'2020-12-28 12:29:49.000000',NULL,'2',1,'415455',NULL,NULL),(101,'2020-12-28 12:29:49.000000',NULL,'2',2,'415455',NULL,NULL),(102,'2020-12-28 12:29:49.000000',NULL,'2',3,'415455',NULL,NULL),(103,'2020-12-28 12:29:49.000000',NULL,'3',1,'415455',NULL,NULL),(104,'2020-12-28 12:29:49.000000',NULL,'3',2,'415455',NULL,NULL),(105,'2020-12-28 12:29:49.000000',NULL,'4',1,'415455',NULL,NULL),(106,'2020-12-28 12:29:49.000000',NULL,'4',2,'415455',NULL,NULL),(107,'2020-12-28 12:29:49.000000',NULL,'5',1,'415455',NULL,NULL),(108,'2020-12-28 12:29:49.000000',NULL,'5',2,'415455',NULL,NULL),(109,'2020-12-28 12:29:49.000000',NULL,'6',1,'415455',NULL,NULL),(110,'2020-12-28 12:29:49.000000',NULL,'6',2,'415455',NULL,NULL),(111,'2020-12-28 12:29:49.000000',NULL,'7',1,'415455',NULL,NULL),(112,'2020-12-28 12:29:49.000000',NULL,'7',2,'415455',NULL,NULL),(269,'2022-12-11 08:02:11.000000',NULL,'1',1,NULL,33,'4cb834bc-2486-11ee-9a1f-1c1bb51f4c1c'),(270,'2022-12-11 08:06:35.000000','2023-07-19 11:30:45.000000','1',1,NULL,32,NULL),(271,'2022-12-11 08:08:20.000000','2023-07-19 11:30:45.000000','1',3,NULL,32,NULL),(272,'2023-07-17 15:31:25.670369','2023-07-17 15:31:25.670369','7',1,NULL,32,NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_spam`
--

LOCK TABLES `email_spam` WRITE;
/*!40000 ALTER TABLE `email_spam` DISABLE KEYS */;
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
  `sender` varchar(255) NOT NULL,
  `created` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5699a8423743908cfbbcb7b660` (`sender`,`good_point_id`),
  KEY `FK_1a402f7849f5d1b4b518d8f154f` (`good_point_id`),
  CONSTRAINT `FK_1a402f7849f5d1b4b518d8f154f` FOREIGN KEY (`good_point_id`) REFERENCES `good_points` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_point_reaction`
--

LOCK TABLES `good_point_reaction` WRITE;
/*!40000 ALTER TABLE `good_point_reaction` DISABLE KEYS */;
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
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student_id` int DEFAULT NULL,
  `gp_link_hash` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `teacher_id` varchar(36) DEFAULT NULL,
  `view_count` tinyint unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ffa4b7a2390db09fbddc57fd84` (`gp_link_hash`),
  KEY `FK_ff2314d38943c757d39871ac3de` (`school_id`),
  KEY `FK_c16c73fecdb731b9def35f0f557` (`teacher_id`),
  KEY `FK_b3e224c16b9166666f728941ff4` (`student_id`),
  CONSTRAINT `FK_b3e224c16b9166666f728941ff4` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c16c73fecdb731b9def35f0f557` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_ff2314d38943c757d39871ac3de` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14822 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_points`
--

LOCK TABLES `good_points` WRITE;
/*!40000 ALTER TABLE `good_points` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goodpoint_preset`
--

LOCK TABLES `goodpoint_preset` WRITE;
/*!40000 ALTER TABLE `goodpoint_preset` DISABLE KEYS */;
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
  `phone` varchar(14) NOT NULL,
  PRIMARY KEY (`student_id`,`phone`),
  CONSTRAINT `FK_88e7fd228423b70f6748c453906` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_phone`
--

LOCK TABLES `parent_phone` WRITE;
/*!40000 ALTER TABLE `parent_phone` DISABLE KEYS */;
INSERT INTO `parent_phone` VALUES (5039,'972533703255'),(5049,'972533703255'),(5050,'972533703255'),(5053,'0546969090');
/*!40000 ALTER TABLE `parent_phone` ENABLE KEYS */;
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
  KEY `FK_f4c4d6571c6356f194373a76841` (`creator_id`),
  KEY `FK_2a936f3cd0407aa96b713ec65c4` (`school_id`),
  CONSTRAINT `FK_2a936f3cd0407aa96b713ec65c4` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_f4c4d6571c6356f194373a76841` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preset_messages`
--

LOCK TABLES `preset_messages` WRITE;
/*!40000 ALTER TABLE `preset_messages` DISABLE KEYS */;
INSERT INTO `preset_messages` VALUES (13,'2019-12-04 13:10:00.000000',NULL,'התלמיד הכין שיעורי בית ','educational','MALE','he',NULL,NULL),(77,'2020-01-20 12:25:32.000000',NULL,'התלמידה השתתפה בשיעור בצורה יוצאת דופן','educational','FEMALE','he',NULL,NULL),(190,'2020-04-05 11:00:38.000000',NULL,'התלמידה שיתפה את','social','FEMALE','he',NULL,NULL),(191,'2020-04-05 11:00:53.000000',NULL,'התלמיד שיתף את','social','MALE','he',NULL,NULL),(235,'2020-05-27 18:47:44.000000',NULL,'התלמיד הכין שיעורי בית','educational','MALE','he',NULL,NULL),(236,'2020-05-27 18:48:25.000000',NULL,'התלמיד שאל שאלה יפה היום בשיעור','educational','MALE','he',NULL,NULL),(237,'2020-05-27 18:48:46.000000',NULL,'התלמידה שאלה שאלה יפה בשיעור','educational','FEMALE','he',NULL,NULL),(238,'2020-05-27 18:49:15.000000',NULL,'התלמיד ענה תשובה יפה בשיעור','educational','MALE','he',NULL,NULL),(239,'2020-05-27 18:49:37.000000',NULL,'התלמידה ענתה תשובה יפה בשיעור','educational','FEMALE','he',NULL,NULL),(240,'2020-05-27 18:50:03.000000',NULL,'התלמיד העביר לנו היום שיעור מרתק בנושא','educational','MALE','he',NULL,NULL),(241,'2020-05-27 18:50:26.000000',NULL,'התלמידה העבירה לנו שיעור מרתק בנושא','educational','FEMALE','he',NULL,NULL),(242,'2020-05-27 18:51:09.000000',NULL,'התלמיד השקיע היום במשימה שניתנה בכיתה','educational','MALE','he',NULL,NULL),(243,'2020-05-27 18:51:50.000000',NULL,'התלמידה השקיעה היום במשימה שניתנה בכיתה','educational','FEMALE','he',NULL,NULL),(244,'2020-05-27 18:52:22.000000',NULL,'התלמיד גילה רגישות מיוחדת לחבר','emotional','MALE','he',NULL,NULL),(245,'2020-05-27 18:52:43.000000',NULL,'התלמידה גילתה רגישות לחברה ','emotional','FEMALE','he',NULL,NULL),(246,'2020-05-27 18:53:19.000000',NULL,'התלמיד הגיש עזרה לחבר בהפסקה','social','MALE','he',NULL,NULL),(247,'2020-05-27 18:53:44.000000',NULL,'התלמידה הגישה עזרה לחברה היום בהפסקה','social','FEMALE','he',NULL,NULL),(248,'2020-05-27 18:54:11.000000',NULL,'התלמיד התגבר היום על קושי ','emotional','MALE','he',NULL,NULL),(249,'2020-05-27 18:54:28.000000',NULL,'התלמידה התגברה היום על קושי','emotional','FEMALE','he',NULL,NULL),(250,'2020-05-27 18:54:45.000000',NULL,'התלמיד גילה בגרות','emotional','MALE','he',NULL,NULL),(251,'2020-05-27 18:55:00.000000',NULL,'התלמידה גילתה אחריות','emotional','FEMALE','he',NULL,NULL),(252,'2020-05-27 18:55:17.000000',NULL,'התלמיד גילה אחריות','emotional','MALE','he',NULL,NULL),(253,'2020-05-27 18:55:36.000000',NULL,'התלמידה גילתה בגרות','emotional','FEMALE','he',NULL,NULL),(254,'2020-05-27 18:55:55.000000',NULL,'התלמיד התנדב היום לעזור','emotional','MALE','he',NULL,NULL),(255,'2020-05-27 18:56:15.000000',NULL,'התלמידה התנדבה היום לעזור','emotional','FEMALE','he',NULL,NULL),(256,'2020-05-27 18:56:47.000000',NULL,'התלמיד ויתר לחברו','social','MALE','he',NULL,NULL),(257,'2020-05-27 18:57:05.000000',NULL,'התלמידה ויתרה לחברתה','social','FEMALE','he',NULL,NULL),(258,'2020-05-27 18:57:25.000000',NULL,'התלמיד גילה כושר מנהיגות','social','MALE','he',NULL,NULL),(259,'2020-05-27 18:57:42.000000',NULL,'התלמידה גילתה כושר מנהיגות','social','FEMALE','he',NULL,NULL),(272,'2020-06-03 05:33:29.000000',NULL,'התלמיד הקשיב בסקרנות ובעניין','educational','MALE','he',NULL,NULL),(273,'2020-06-03 05:33:59.000000',NULL,'התלמידה הקשיבה בסקרנות ובעניין','educational','FEMALE','he',NULL,NULL),(276,'2020-06-03 05:48:37.000000',NULL,'התלמיד מקפיד על סדר וארגון ','educational','MALE','he',NULL,NULL),(277,'2020-06-03 05:50:43.000000',NULL,'התלמידה מקפידה על סדר ונקיון ','educational','FEMALE','he',NULL,NULL),(283,'2020-06-03 08:10:31.000000',NULL,'התלמיד קיבל תפקיד בכיתה וממלא אותו באחריות','other','MALE','he',NULL,NULL),(284,'2020-06-03 08:11:20.000000',NULL,'התלמידה קיבלה תפקיד בכיתה וממלאת אותו באחריות','other','FEMALE','he',NULL,NULL),(289,'2020-09-22 12:36:34.000000',NULL,'התלמיד השתתף היום באופן פעיל בשיעור הזום','other','MALE','he',NULL,NULL),(290,'2020-09-22 12:37:01.000000',NULL,'התלמידה השתתפה היום באופן פעיל בזום','other','FEMALE','he',NULL,NULL),(291,'2020-09-22 12:39:05.000000',NULL,'התלמיד הגיע בזמן לשיעור הזום','other','MALE','he',NULL,NULL),(292,'2020-09-22 12:39:31.000000',NULL,'התלמידה הגיעה היום בזמן לשיעור הלמידה בזום','other','FEMALE','he',NULL,NULL),(293,'2020-09-22 12:41:02.000000',NULL,'התלמיד עזר לנו היום לפתור בעיה טכנית בזום','other','MALE','he',NULL,NULL),(294,'2020-09-22 12:41:24.000000',NULL,'התלמידה עזרה לנו היום לפתור בעיה טכנית בזום','other','FEMALE','he',NULL,NULL),(295,'2020-09-22 12:42:28.000000',NULL,'התלמיד מילא היום את כל משימות הלמידה מרחוק בחריצות וביעילות.','other','MALE','he',NULL,NULL),(296,'2020-09-22 12:42:54.000000',NULL,'התלמידה מילאה היום את כל משימות הלמידה מרחוק בחריצות וביעילות.','other','FEMALE','he',NULL,NULL),(297,'2020-09-22 12:45:25.000000',NULL,'התלמיד מגלה כוחות חדשים וייחודייםבתקופה מאתגרת זו.','other','MALE','he',NULL,NULL),(298,'2020-09-22 12:46:00.000000',NULL,'התלמידה מגלה כוחות חדשים וייחודיים בתקופה מאתגרת זו.','other','FEMALE','he',NULL,NULL),(299,'2020-09-22 12:46:47.000000',NULL,'התלמיד שיתף אותנו באופן כנה ובוגר ברגשותיו.','other','MALE','he',NULL,NULL),(300,'2020-09-22 12:47:26.000000',NULL,'התלמידה שיתפה אותנו באופן כנה ובוגר ברגשותיה.','other','FEMALE','he',NULL,NULL),(301,'2020-09-22 12:49:47.000000',NULL,'התלמיד התייחס לדברי חבריו בשיעור ובזכותו התפתח דיון פורה','other','MALE','he',NULL,NULL),(302,'2020-09-22 12:50:45.000000',NULL,'התלמידה התייחסה לדברי חבריה בשיעור ובזכותה התפתח דיון פורה','other','FEMALE','he',NULL,NULL),(303,'2020-09-22 12:51:38.000000',NULL,'שמחתי לראות את התלמיד נוכח ומחייך היום בשיעור ','other','MALE','he',NULL,NULL),(304,'2020-09-22 12:52:09.000000',NULL,'שמחתי לראות את התלמידה נוכחת ומחייכת היום בשיעור ','other','FEMALE','he',NULL,NULL),(305,'2020-09-22 12:53:05.000000',NULL,'התלמיד משתמש יפה באפשרויות הטכנולוגיות כדי לקבל את רשות הדיבור.','other','MALE','he',NULL,NULL),(306,'2020-09-22 12:53:42.000000',NULL,'התלמידה משתמשת יפה באפשרויות הטכנולוגיות כדי לקבל את רשות הדיבור.','other','FEMALE','he',NULL,NULL),(307,'2020-09-22 12:55:39.000000',NULL,'התלמיד הקריא היום טקסט לכל הכיתה בצורה רהוטה ומכובדת','other','MALE','he',NULL,NULL),(308,'2020-09-22 12:56:10.000000',NULL,'התלמידה הקריאה לכל הכיתה טקסט היום בצורה רהוטה ומכובדת','other','FEMALE','he',NULL,NULL),(309,'2020-09-22 12:57:06.000000',NULL,'התלמיד מגלה עצמאות ואחריות בלמידה.','other','MALE','he',NULL,NULL),(310,'2020-09-22 12:57:35.000000',NULL,'התלמידה מגלה עצמאות ואחריות בלמידה','other','FEMALE','he',NULL,NULL),(311,'2020-09-22 12:58:17.000000',NULL,'התלמיד העשיר אותנו היום מחפצים הנמצאים בביתו','other','MALE','he',NULL,NULL),(312,'2020-09-22 12:58:39.000000',NULL,'התלמידה העשירה אותנו היום מחפצים הנמצאים בביתה','other','FEMALE','he',NULL,NULL),(313,'2020-12-24 13:14:07.000000',NULL,'התלמיד עזר לחברה בהפסקה','social','MALE','he',NULL,NULL),(314,'2020-12-24 13:14:35.000000',NULL,'התלמידה עזרה לחבר בהפסקה','social','FEMALE','he',NULL,NULL),(352,'2021-11-25 16:40:56.000000',NULL,'الطالب قام بأداء وظيفته بمسؤولية تامة','other','MALE','ar',NULL,NULL),(353,'2021-11-25 16:44:18.000000',NULL,'إشترك الطالب في التعلّم عن بُعد بشكل فعّال','other','MALE','ar',NULL,NULL),(354,'2021-11-25 16:44:18.000000',NULL,'الطالب فتح درس الزوم في الوقت المحدد','other','MALE','ar',NULL,NULL),(355,'2021-11-25 16:44:18.000000',NULL,'ساعد الطالب صديقه في التعامل مع مشكلة في الحاسوب (الزوم)','other','MALE','ar',NULL,NULL),(356,'2021-11-25 16:44:18.000000',NULL,'الطالب استعمل الخليوي كي يجيب على الاسئلة التي وجهت له عبر البرنامج المحوسب','other','MALE','ar',NULL,NULL),(357,'2021-11-25 16:44:18.000000',NULL,'الطالبة قامت بأداء وظيفتها بمسؤولية تامة','other','FEMALE','ar',NULL,NULL),(358,'2021-11-25 16:44:18.000000',NULL,'إشتركت الطالبة في التعلّم عن بُعد بشكل فعّال','other','FEMALE','ar',NULL,NULL),(359,'2021-11-25 16:44:18.000000',NULL,'الطالبة فتحت درس الزوم في الوقت المحدد','other','FEMALE','ar',NULL,NULL),(360,'2021-11-25 16:44:18.000000',NULL,'ساعدت الطالبة صديقتها في التعامل مع مشكلة في الحاسوب (الزوم)','other','FEMALE','ar',NULL,NULL),(361,'2021-11-25 16:44:19.000000',NULL,'الطالبة استعملت الخليوي كي تجيب على الاسئلة التي وجهت لها عبر البرنامج المحوسب','other','FEMALE','ar',NULL,NULL),(377,'2022-01-11 13:53:52.000000',NULL,'משפט כללי חדש','social','NONE','he',NULL,NULL);
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
  KEY `FK_27d0f3881f160c4724c24646b05` (`teacher_id`),
  KEY `FK_f12913dd33647ff1f4161ff2213` (`school_id`),
  CONSTRAINT `FK_27d0f3881f160c4724c24646b05` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a689766acdaccf17c42be9d281f` FOREIGN KEY (`preset_message_id`) REFERENCES `preset_messages` (`id`),
  CONSTRAINT `FK_f12913dd33647ff1f4161ff2213` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,420208,'חן השומרון','2023-07-17 12:43:07.745078',0,NULL),(2,111690,'ממד הרובע','2023-07-17 12:43:07.745078',0,NULL),(3,113563,'נעם רמות בנים','2023-07-17 12:43:07.745078',0,NULL),(4,218560,'יסודי ניין','2023-07-17 12:43:07.745078',0,NULL),(5,413559,'נעם רחובות','2023-07-17 12:43:07.745078',0,NULL),(6,414490,'שילה כפר סבא','2023-07-17 12:43:07.745078',0,NULL),(7,416438,'אלימלך כנר','2023-07-17 12:43:07.745078',0,NULL),(8,444844,'שלהבת','2023-07-17 12:43:07.745078',0,NULL),(9,475053,'מנחם בגין הוד השרון','2023-07-17 12:43:07.745078',0,NULL),(10,482372,'פסגות אפק','2023-07-17 12:43:07.745078',0,NULL),(11,482604,'נחשון','2023-07-17 12:43:07.745078',0,NULL),(12,482828,'עלי זהב','2023-07-17 12:43:07.745078',0,NULL),(13,614560,'עציון תורני','2023-07-17 12:43:07.745078',0,NULL),(14,412064,'ממד סיני רחובות','2023-07-17 12:43:07.745078',0,NULL),(15,0,'hilma','2023-07-17 12:43:07.745078',0,NULL),(16,987654,'hilma','2023-07-17 12:43:07.745078',0,NULL),(17,416437,'UNKOWN 416437','2023-07-17 12:43:07.745078',0,NULL),(18,416982,'בורג מזכרת בתיה','2023-07-17 12:43:07.745078',0,NULL),(20,111222,'UNKOWN 111222','2023-07-17 12:43:07.745078',0,NULL),(21,123456,'בית ספר של הדר','2023-07-17 12:43:07.745078',0,NULL),(22,246888,'בית ספר של הדר 2','2023-07-17 12:43:07.745078',0,NULL),(28,234567,'UNKOWN 234567','2023-07-17 12:43:07.745078',0,NULL),(29,444555,'אורטל','2023-07-17 12:43:07.745078',0,NULL),(30,222222,'ביס שני','2023-07-17 12:43:07.745078',0,NULL),(31,777777,'קוף ים','2023-07-17 12:43:07.745078',0,NULL),(32,888888,'ביס א','2023-07-17 12:43:07.745078',0,NULL),(33,999999,'ביס ב','2023-07-17 12:43:07.745078',0,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=24803 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_spam`
--

LOCK TABLES `sms_spam` WRITE;
/*!40000 ALTER TABLE `sms_spam` DISABLE KEYS */;
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
  `gp_count` tinyint unsigned DEFAULT '0',
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
  KEY `FK_de6ad4ae6936dce474e2823984e` (`class_id`),
  KEY `FK_aa8edc7905ad764f85924569647` (`school_id`),
  FULLTEXT KEY `IDX_7eed714fbf4ca56aa5c5395d43` (`first_name`,`last_name`),
  CONSTRAINT `FK_aa8edc7905ad764f85924569647` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `FK_de6ad4ae6936dce474e2823984e` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5054 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (5039,'2022-12-11 08:02:11.000000','2023-07-19 16:52:14.087955',269,13,'MALE','972585805050','','תלמיד','אחד',33,'',NULL,NULL),(5049,'2023-07-17 15:34:55.247305','2023-07-17 15:34:55.247305',272,0,'FEMALE',NULL,NULL,'נועה מיתר','אבוחצירה',32,NULL,NULL,NULL),(5050,'2023-07-17 15:34:55.251147','2023-07-17 15:34:55.251147',272,0,'FEMALE',NULL,NULL,'נועה','אהרון',32,NULL,NULL,NULL),(5053,'2023-07-23 13:52:17.719806','2023-07-23 13:52:17.719806',271,0,'FEMALE',NULL,NULL,'antoher','another',32,NULL,'',NULL);
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
  KEY `FK_516354a21459cbd381b26881a26` (`school_id`),
  KEY `FK_7186e4dbd1838ae10213694abfe` (`teacher_id`),
  CONSTRAINT `FK_516354a21459cbd381b26881a26` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_7186e4dbd1838ae10213694abfe` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_group`
--

LOCK TABLES `study_group` WRITE;
/*!40000 ALTER TABLE `study_group` DISABLE KEYS */;
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
  `is_read` tinyint unsigned NOT NULL DEFAULT '0',
  `school_id` int DEFAULT NULL,
  `sender_id` varchar(36) DEFAULT NULL,
  `receiver_id` varchar(36) DEFAULT NULL,
  `reaction_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_4117d5bdb01b097483802a9b2b` (`reaction_id`),
  KEY `IDX_3a1c82c51f2f66182c71cbbec2` (`is_read`),
  KEY `FK_c749a47e20a9a261cbd57063b44` (`school_id`),
  KEY `FK_84e8903240a901a20a6fa37df9e` (`sender_id`),
  KEY `FK_8f12643bd6cd68c95580c162967` (`receiver_id`),
  CONSTRAINT `FK_4117d5bdb01b097483802a9b2bf` FOREIGN KEY (`reaction_id`) REFERENCES `teachers_good_points_reaction` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_84e8903240a901a20a6fa37df9e` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_8f12643bd6cd68c95580c162967` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_c749a47e20a9a261cbd57063b44` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers_good_points`
--

LOCK TABLES `teachers_good_points` WRITE;
/*!40000 ALTER TABLE `teachers_good_points` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers_good_points_reaction`
--

LOCK TABLES `teachers_good_points_reaction` WRITE;
/*!40000 ALTER TABLE `teachers_good_points_reaction` DISABLE KEYS */;
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
  `phone_number` varchar(14) DEFAULT NULL,
  `notify_date` datetime DEFAULT NULL,
  `preferredLanguage` enum('he','ar') DEFAULT 'he',
  `system_notifications` tinyint DEFAULT '1',
  `emailVerified` tinyint DEFAULT '1',
  `verificationToken` varchar(150) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  KEY `IDX_6f5e46b974cb645c4d53b544fe` (`notify_date`),
  KEY `IDX_31ef2b4d30675d0c15056b7f6e` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('$2a$10$r.zbgMj3iwMDfFFhL3eND.nJFuQ/gWT0/E9qp9aoVpOjSMSjPjp1K','shani.kehati@gmail.com','MALE','שני מורה','ממד הרובע','{\"firstLogin\":false,\"firstOpeningSentences\":false}','2022-11-23 10:05:50.101087','4cb827c0-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$8UCOWgtF9YEkn4x6/AsiH.SFlV1MHKKSz3IWvu7wRh2bwa/8rFS4W','admin-1@jfkdls.com','FEMALE','אדמין ביס א','שני','{\"firstAdminLogin\":false}','2022-12-07 08:51:08.136425','4cb83437-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$.hI2DxnJUmNlAsYD.IJLFe6dwTzqVsBCaQpPnKo1ys1Krcs4.41ge','admin-2@jfkdls.com','FEMALE','jkljlk','jkljlk','{\"firstAdminLogin\":false,\"firstOpeningSentences\":false}','2022-12-07 12:41:45.485516','4cb834bc-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$gXHlRZs0yVuffH5MdojPeeHUBHhAK4KDhokAKLwqo1F02t8BA1/.O','teacher-2@jfkdls.com','FEMALE','שולמית','גרין','{}','2022-12-07 13:09:29.532677','4cb83541-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$EN2tCJGcr6qe6r5tRczqGuhuHDdVO.Xu9b5DIvA3op7MzxIiy0KNe','teacher-1@jfkdls.com','FEMALE','teacher ONE','family-name','{\"firstLogin\":false,\"firstOpeningSentences\":false,\"firstAdminLogin\":false}','2022-12-07 13:13:05.095196','4cb835ca-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-26 10:29:13.000000',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$YOs31OFiy7RCK7/TlnFEvu3D0F5QWhsC.DjoBJdor2c2kXJKNyea.','fjlkds0943@jfjlkc.com','FEMALE','ואןםרקא','מורה','{}','2022-12-07 15:31:29.231363','4cb83651-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$pYwT3ZCwUmESarxTJxUDIuobMaggOSCB9l.lXVyLijpqaNRt.2602','michal.k@hilma.tech','FEMALE','מיכל','טסט','{}','2022-12-14 16:23:33.199362','4cb836d5-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$MZwuearYVk2qx8kymDjwoeUsk/sVSPiR5WdSKDeCRde7WcaVFoJOK','noa.dolev@hilma.tech','FEMALE','נעה','דולב','{\"firstLogin\":false,\"firstOpeningSentences\":false}','2023-05-18 11:39:22.064557','4cb837de-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$8Gi6X/FyuUKx9.Tw09I65e8nrflVCrsNWFLGCxpuUxjO1FcgsdoRe','noadodo@gmail.com','FEMALE','מורה','חדשה','{}','2023-05-18 12:10:59.375885','4cb83863-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2a$10$WqHSGfZtv77i48IGy2tPb.hJJ5XUhXcQ5W1pzzoGBWWRgcOb1VBSe','n@m.com','FEMALE','רחל','אביגד','{\"firstLogin\":false}','2023-05-18 12:13:05.635705','4cb838e9-2486-11ee-9a1f-1c1bb51f4c1c','staff','2023-07-17 12:43:07.600181',NULL,NULL,'he',1,1,NULL,NULL),('$2b$10$e..DaxRrE7MoiUeyOT91v.mDkzT7u1DMqbDEQ5qXN8JMqOpEoqAy.','superAdmin@gmail.com',NULL,'super','admin!','{}','2023-11-30 10:34:36.338335','9791b6c7-d4e9-4f16-b255-81e95303dca9','staff','2023-11-30 10:34:36.338335',NULL,NULL,'he',1,1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=1024 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_password`
--

LOCK TABLES `user_password` WRITE;
/*!40000 ALTER TABLE `user_password` DISABLE KEYS */;
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
INSERT INTO `user_role` VALUES (1,'4cb827c0-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb83541-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb835ca-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb83651-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb836d5-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb837de-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb83863-2486-11ee-9a1f-1c1bb51f4c1c'),(1,'4cb838e9-2486-11ee-9a1f-1c1bb51f4c1c'),(2,'4cb83437-2486-11ee-9a1f-1c1bb51f4c1c'),(2,'4cb834bc-2486-11ee-9a1f-1c1bb51f4c1c'),(3,'9791b6c7-d4e9-4f16-b255-81e95303dca9');
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
  KEY `FK_e347864f128a9f86925d43dcc5b` (`user_id`),
  KEY `FK_e9f2e160d32efae56cecc67ff38` (`role_id`),
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
INSERT INTO `user_school` VALUES (32,'4cb827c0-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(32,'4cb83437-2486-11ee-9a1f-1c1bb51f4c1c',2,NULL),(32,'4cb835ca-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(32,'4cb83651-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(32,'4cb836d5-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(33,'4cb834bc-2486-11ee-9a1f-1c1bb51f4c1c',2,NULL),(33,'4cb83541-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(33,'4cb835ca-2486-11ee-9a1f-1c1bb51f4c1c',2,NULL),(33,'4cb837de-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(33,'4cb83863-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL),(33,'4cb838e9-2486-11ee-9a1f-1c1bb51f4c1c',1,NULL);
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

-- Dump completed on 2023-11-30 11:19:02
