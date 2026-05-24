-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: AutoPartsShop
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `customerinteractions`
--

DROP TABLE IF EXISTS `customerinteractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerinteractions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CustomerId` int NOT NULL,
  `UserId` int NOT NULL,
  `InteractionDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Type` enum('Call','Consultation','Order','Complaint','Other') COLLATE utf8mb4_unicode_ci DEFAULT 'Call',
  `Topic` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Result` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Notes` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `FollowUpDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  KEY `idx_customer_date` (`CustomerId`,`InteractionDate`),
  CONSTRAINT `customerinteractions_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `customerinteractions_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerinteractions`
--

LOCK TABLES `customerinteractions` WRITE;
/*!40000 ALTER TABLE `customerinteractions` DISABLE KEYS */;
INSERT INTO `customerinteractions` VALUES (1,1,5,'2026-05-23 17:43:36','Order','Оформление заказа','Заказ ORD-20260523174336 на сумму 650,00 ₽',NULL,NULL),(2,4,5,'2026-05-23 17:45:34','Order','Оформление заказа','Заказ ORD-20260523174533 на сумму 650,00 ₽',NULL,NULL),(3,1,5,'2026-05-23 19:34:32','Order','Оформление заказа','Заказ ORD-20260523193432 на сумму 2850,00 ₽',NULL,NULL),(4,1,5,'2026-05-23 19:42:09','Call',' Оформление заказа23.05.2026, 19:34:32','Заказ ORD-20260523193432 на сумму 2850,00 ₽','',NULL),(5,1,6,'2026-05-24 16:16:46','Order','Оформление заказа','Заказ ORD-20260524161645 на сумму 650,00 ₽',NULL,NULL),(6,1,6,'2026-05-24 18:19:25','Order','Оформление заказа','Заказ ORD-20260524181925 на сумму 650,00 ₽',NULL,NULL),(7,1,6,'2026-05-24 18:42:48','Order','Оформление заказа','Заказ ORD-20260524184248 на сумму 650,00 ₽',NULL,NULL),(8,5,6,'2026-05-24 18:45:37','Order','Оформление заказа','Заказ ORD-20260524184537 на сумму 550,00 ₽',NULL,NULL);
/*!40000 ALTER TABLE `customerinteractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CarModel` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CarYear` int DEFAULT NULL,
  `VIN` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Notes` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `CreatedBy` (`CreatedBy`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Сергей Климов','+79011234567','s.klimov@email.com','Toyota Camry',2015,'JTDKN3DU8A0123456',NULL,'2026-05-23 15:11:55',NULL),(2,'Анна Ветрова','+79019876543','a.vetrova@email.com','BMW X5',2018,'WBAZV41090L567890',NULL,'2026-05-23 15:11:55',NULL),(3,'Дмитрий Громов','+79015556677','d.gromov@email.com','Kia Rio',2019,'Z94C41AB9KR123456',NULL,'2026-05-23 15:11:55',NULL),(4,'Максим','89005353535',NULL,'BMG AUth 228',NULL,NULL,NULL,'2026-05-23 17:45:29',NULL),(5,'Михаил','89272163264',NULL,'BMW X5',NULL,NULL,NULL,'2026-05-24 18:44:57',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OrderId` int NOT NULL,
  `PartId` int NOT NULL,
  `Quantity` int NOT NULL,
  `PriceAtOrder` decimal(10,2) NOT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `OrderId` (`OrderId`),
  KEY `PartId` (`PartId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`PartId`) REFERENCES `parts` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `orderitems_chk_1` CHECK ((`Quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (1,2,1,1,650.00,0.00),(2,3,1,1,650.00,0.00),(3,4,1,1,650.00,0.00),(4,4,3,1,2200.00,0.00),(5,5,1,1,650.00,0.00),(6,6,1,1,650.00,0.00),(7,7,1,1,650.00,0.00);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OrderNumber` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CustomerId` int NOT NULL,
  `UserId` int NOT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('New','Paid','Shipped','Cancelled','Completed') COLLATE utf8mb4_unicode_ci DEFAULT 'New',
  `TotalAmount` decimal(10,2) DEFAULT '0.00',
  `Notes` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `IsReminderSet` tinyint(1) DEFAULT '0',
  `ReminderDate` datetime DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `OrderNumber` (`OrderNumber`),
  KEY `UserId` (`UserId`),
  KEY `idx_customer` (`CustomerId`),
  KEY `idx_status` (`Status`),
  KEY `idx_order_date` (`OrderDate`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,'ORD-20260523174336',1,5,'2026-05-23 17:43:36','New',650.00,'',0,NULL,'2026-05-23 17:43:36'),(3,'ORD-20260523174533',4,5,'2026-05-23 17:45:34','New',650.00,'',0,NULL,'2026-05-23 17:45:33'),(4,'ORD-20260523193432',1,5,'2026-05-23 19:34:32','Cancelled',2850.00,'',0,NULL,'2026-05-23 19:34:32'),(5,'ORD-20260524161645',1,6,'2026-05-24 16:16:46','Completed',650.00,'',0,NULL,'2026-05-24 16:16:45'),(6,'ORD-20260524181925',1,6,'2026-05-24 18:19:25','Shipped',650.00,'',0,NULL,'2026-05-24 18:19:25'),(7,'ORD-20260524184248',1,6,'2026-05-24 18:42:48','Paid',650.00,'',0,NULL,'2026-05-24 18:42:48');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partanalogues`
--

DROP TABLE IF EXISTS `partanalogues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partanalogues` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PartId` int NOT NULL,
  `AnaloguePartId` int NOT NULL,
  `Notes` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_analogue` (`PartId`,`AnaloguePartId`),
  KEY `AnaloguePartId` (`AnaloguePartId`),
  CONSTRAINT `partanalogues_ibfk_1` FOREIGN KEY (`PartId`) REFERENCES `parts` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `partanalogues_ibfk_2` FOREIGN KEY (`AnaloguePartId`) REFERENCES `parts` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `partanalogues_chk_1` CHECK ((`PartId` <> `AnaloguePartId`))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partanalogues`
--

LOCK TABLES `partanalogues` WRITE;
/*!40000 ALTER TABLE `partanalogues` DISABLE KEYS */;
INSERT INTO `partanalogues` VALUES (1,1,2,'Полный аналог, разные производители','2026-05-23 15:11:55'),(2,2,1,'Полный аналог, разные производители','2026-05-23 15:11:55'),(3,3,4,'Аналог, возможно незначительное отличие','2026-05-23 15:11:55'),(4,4,3,'Аналог, возможно незначительное отличие','2026-05-23 15:11:55');
/*!40000 ALTER TABLE `partanalogues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partcompatibility`
--

DROP TABLE IF EXISTS `partcompatibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partcompatibility` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PartId` int NOT NULL,
  `CarBrand` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CarModel` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CarYearFrom` int DEFAULT NULL,
  `CarYearTo` int DEFAULT NULL,
  `Engine` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Notes` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `PartId` (`PartId`),
  CONSTRAINT `partcompatibility_ibfk_1` FOREIGN KEY (`PartId`) REFERENCES `parts` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partcompatibility`
--

LOCK TABLES `partcompatibility` WRITE;
/*!40000 ALTER TABLE `partcompatibility` DISABLE KEYS */;
INSERT INTO `partcompatibility` VALUES (1,1,'Toyota','Camry',2012,2017,'2.5 бензин',NULL),(2,1,'Toyota','RAV4',2013,2018,'2.0 бензин',NULL),(3,2,'Toyota','Camry',2012,2017,'2.5 бензин',NULL),(4,3,'BMW','X5',2014,2019,'3.0 дизель',NULL),(5,3,'BMW','X3',2014,2019,'3.0 дизель',NULL),(6,5,'Kia','Rio',2017,2020,'1.6 бензин',NULL),(7,5,'Hyundai','Solaris',2017,2020,'1.6 бензин',NULL);
/*!40000 ALTER TABLE `partcompatibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parts`
--

DROP TABLE IF EXISTS `parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ArticleNumber` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Brand` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `PurchasePrice` decimal(10,2) DEFAULT NULL,
  `RetailPrice` decimal(10,2) NOT NULL,
  `StockQuantity` int DEFAULT '0',
  `MinStockQuantity` int DEFAULT '3',
  `ImageUrl` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `idx_article` (`ArticleNumber`),
  KEY `idx_name` (`Name`),
  KEY `idx_brand` (`Brand`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parts`
--

LOCK TABLES `parts` WRITE;
/*!40000 ALTER TABLE `parts` DISABLE KEYS */;
INSERT INTO `parts` VALUES (1,'2101-1000100','Масляный фильтр','Bosch',NULL,350.00,650.00,9,5,NULL,'2026-05-23 15:11:55','2026-05-24 18:42:48'),(2,'2101-1000100-01','Масляный фильтр','Mann',NULL,300.00,550.00,8,3,NULL,'2026-05-23 15:11:55','2026-05-24 21:59:44'),(3,'2101-2000100','Тормозные колодки передние','Bosch',NULL,1200.00,2200.00,2,2,NULL,'2026-05-23 15:11:55','2026-05-23 19:34:32'),(4,'2101-2000100-01','Тормозные колодки передние','TRW',NULL,1000.00,1800.00,0,2,NULL,'2026-05-23 15:11:55','2026-05-23 15:11:55'),(5,'2101-3000100','Воздушный фильтр','Mann',NULL,250.00,450.00,12,5,NULL,'2026-05-23 15:11:55','2026-05-23 15:11:55'),(6,'2101-4000100','Свечи зажигания (комплект)','NGK',NULL,800.00,1500.00,6,3,NULL,'2026-05-23 15:11:55','2026-05-23 15:11:55'),(7,'2101-5000100','Ремень ГРМ','Gates',NULL,1500.00,2800.00,1,1,NULL,'2026-05-23 15:11:55','2026-05-23 15:11:55'),(8,'2101-6000100','Амортизатор передний','KYB',NULL,2200.00,4200.00,4,2,NULL,'2026-05-23 15:11:55','2026-05-23 15:11:55');
/*!40000 ALTER TABLE `parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminders` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `CustomerId` int DEFAULT NULL,
  `OrderId` int DEFAULT NULL,
  `ReminderText` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ReminderDate` datetime NOT NULL,
  `IsCompleted` tinyint(1) DEFAULT '0',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `CustomerId` (`CustomerId`),
  KEY `OrderId` (`OrderId`),
  KEY `idx_reminder_date` (`ReminderDate`),
  KEY `idx_user_reminders` (`UserId`,`IsCompleted`),
  CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `reminders_ibfk_2` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`Id`) ON DELETE SET NULL,
  CONSTRAINT `reminders_ibfk_3` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` VALUES (1,6,5,NULL,'Перезвонить клиенту по поводу заказа','2026-05-25 10:20:00',1,'2026-05-24 22:20:36');
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `PasswordHash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Role` enum('Seller','Manager','Admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Seller',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Иван Петров','admin@example.com','$2a$11$K7Q5Y8Z1xL9mN3vR6tYwOuA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0t','+79001234567','Admin','2026-05-23 15:11:41',1),(2,'Мария Иванова','manager@example.com','$2a$11$K7Q5Y8Z1xL9mN3vR6tYwOuA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0t','+79007654321','Manager','2026-05-23 15:11:41',1),(3,'Алексей Сидоров','seller@example.com','$2a$11$K7Q5Y8Z1xL9mN3vR6tYwOuA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0t','+79001112233','Seller','2026-05-23 15:11:41',1),(4,'Тестовый Админ','test@admin.com','$2a$11$INOP2RHXqV9czM0KzTkV6O053tlR8H31VG/joMNclq7XPUTtdiXt.','+79001234567','Admin','2026-05-23 15:39:18',1),(5,'Мой Админ','myadmin@shop.com','$2a$11$lvNJtPg6ccJujBWBMDX1H.SIWeDB/46UFyqz4pmJLko13BNrWi.4C','+79001112233','Admin','2026-05-23 17:17:08',1),(6,'Новый Админ','admin@admin.com','$2a$11$CERLQfqGhhDmzNccON2Fm.LcVesdachKMBm0.jyoLKDKtzVvUDoce','+79000000000','Admin','2026-05-23 19:54:47',1),(7,'kef','email@email.com','$2a$11$XfyD5heG0lDuJxorsMEBqudvTkO1jGw1.qatJhlpequZ5Zj4eZ9Ue','89272163264','Admin','2026-05-24 15:51:43',1),(8,'Продавец Тест','seller2@shop.com','$2a$11$VSQYnIlIbOeMomfYZGzPWOOcjhiGuWFrHR.Rl2egXIRz6/f/g7YgC','+79000000000','Seller','2026-05-24 22:04:14',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-24 22:44:56
