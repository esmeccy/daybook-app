-- MySQL dump 10.13  Distrib 8.0.44, for macos12.7 (arm64)
--
-- Host: 127.0.0.1    Database: daybook_app
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `ec_categories`
--

DROP TABLE IF EXISTS `ec_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ec_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ec_categories`
--

LOCK TABLES `ec_categories` WRITE;
/*!40000 ALTER TABLE `ec_categories` DISABLE KEYS */;
INSERT INTO `ec_categories` (`id`, `name`) VALUES (1,'Nature'),(2,'Little Bites'),(5,'Lovely Human'),(6,'Achievement'),(7,'Gratitude'),(8,'Everyday');
/*!40000 ALTER TABLE `ec_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ec_entries`
--

DROP TABLE IF EXISTS `ec_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ec_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `reflection` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `ec_entries_users` (`user_id`),
  CONSTRAINT `ec_entries_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `ec_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ec_entries_users` FOREIGN KEY (`user_id`) REFERENCES `ec_users-table` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ec_entries`
--

LOCK TABLES `ec_entries` WRITE;
/*!40000 ALTER TABLE `ec_entries` DISABLE KEYS */;
INSERT INTO `ec_entries` (`id`, `title`, `reflection`, `image`, `category_id`, `created_at`, `user_id`) VALUES (1,'Morning Walk','The weather was even better than yesterday.','morning-walk.jpg',1,'2026-07-19 09:30:00',2),(2,'New Matcha Spot','Tried a new café after class, super yum!','matcha.jpg',2,'2026-07-18 15:00:00',2),(3,'Family Dinner','We cooked together tonight and laughed a lot.','dinner.jpg',5,'2026-07-17 19:00:00',2);
/*!40000 ALTER TABLE `ec_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ec_users-table`
--

DROP TABLE IF EXISTS `ec_users-table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ec_users-table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ec_users-table`
--

LOCK TABLES `ec_users-table` WRITE;
/*!40000 ALTER TABLE `ec_users-table` DISABLE KEYS */;
INSERT INTO `ec_users-table` (`id`, `username`, `email`, `password`, `created_at`) VALUES (2,'Esme','esme@test.com','$2b$10$J4HfA3l6HmLrdcsSFuK9buOz7ruVeWxKZjorf6/8IvdsZuzCX3d36','2026-08-08 23:32:34'),(12,'esme','esmec1004@gmail.com','$2b$10$zJPEDnTbLHauvVBC/B8Ugu1moMnQxz27pL5Jbb915eUxYkpRElDZm','2026-08-09 00:56:52');
/*!40000 ALTER TABLE `ec_users-table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-08 20:28:09
