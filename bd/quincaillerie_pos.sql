-- Warning: column statistics not supported by the server.
-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: quincaillerie_pos
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `user_role` varchar(50) DEFAULT NULL,
  `branch_id` bigint(20) unsigned DEFAULT NULL,
  `auditable_type` varchar(255) NOT NULL,
  `auditable_id` bigint(20) unsigned NOT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(50) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  `result` varchar(20) NOT NULL DEFAULT 'success',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_company_id_foreign` (`company_id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  KEY `audit_logs_branch_id_foreign` (`branch_id`),
  CONSTRAINT `audit_logs_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `audit_logs_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=525 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,1,NULL,NULL,'App\\Models\\StockTransfer',1,'created',NULL,NULL,'{\"company_id\":1,\"from_branch_id\":1,\"to_branch_id\":2,\"transfer_number\":\"TRSF-1783621481-440\",\"status\":\"pending\",\"notes\":null,\"id\":1}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-09 18:24:42'),(2,1,1,NULL,NULL,'App\\Models\\StockTransfer',2,'created',NULL,NULL,'{\"company_id\":1,\"from_branch_id\":1,\"to_branch_id\":2,\"transfer_number\":\"TRSF-1783621483-118\",\"status\":\"pending\",\"notes\":null,\"id\":2}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-09 18:24:43'),(3,1,1,NULL,NULL,'App\\Models\\Product',4,'created',NULL,NULL,'{\"category_id\":3,\"name\":\"pantalon\",\"sku\":\"SKU-XYZ\",\"barcode\":null,\"description\":null,\"selling_price\":3000,\"alert_quantity\":10,\"company_id\":1,\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:14:26'),(4,1,1,NULL,NULL,'App\\Models\\Customer',1,'created',NULL,NULL,'{\"name\":\"grah\",\"email\":\"desirejeanivan@gmail.com\",\"phone\":\"056628394\",\"address\":\"angre sjorobite 2\",\"credit_limit\":500000,\"debt_balance\":0,\"loyalty_points\":2,\"company_id\":1,\"id\":1}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:16:48'),(5,1,1,NULL,NULL,'App\\Models\\Purchase',1,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"supplier_id\":4,\"purchase_number\":\"BON-ACH-1783675166-604\",\"status\":\"ordered\",\"payment_status\":\"paid\",\"subtotal\":600000,\"tax_amount\":108000,\"total_amount\":708000,\"amount_paid\":0,\"notes\":null,\"id\":1}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:19:26'),(6,1,1,NULL,NULL,'App\\Models\\Product',1,'updated',NULL,'{\"cost_price\":\"0.00\"}','{\"cost_price\":30000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:28:38'),(7,1,1,NULL,NULL,'App\\Models\\Purchase',1,'updated',NULL,'{\"status\":\"ordered\"}','{\"status\":\"received\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:28:39'),(8,1,1,NULL,NULL,'App\\Models\\StockTransfer',3,'created',NULL,NULL,'{\"company_id\":1,\"from_branch_id\":1,\"to_branch_id\":2,\"transfer_number\":\"TRSF-1783675757-959\",\"status\":\"pending\",\"notes\":null,\"id\":3}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:29:17'),(9,1,1,NULL,NULL,'App\\Models\\StockTransfer',2,'updated',NULL,'{\"status\":\"pending\"}','{\"status\":\"transit\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:30:36'),(10,1,1,NULL,NULL,'App\\Models\\StockTransfer',2,'updated',NULL,'{\"status\":\"transit\"}','{\"status\":\"completed\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:31:12'),(11,1,1,NULL,NULL,'App\\Models\\StockTransfer',1,'updated',NULL,'{\"status\":\"pending\"}','{\"status\":\"transit\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:36:51'),(12,1,1,NULL,NULL,'App\\Models\\CashSession',1,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"opening_balance\":10000,\"status\":\"open\",\"notes\":null,\"opened_at\":\"2026-07-10T09:42:27.517300Z\",\"id\":1}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:42:27'),(13,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":2}','{\"loyalty_points\":23}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:44:32'),(14,1,1,NULL,NULL,'App\\Models\\Sale',1,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000001\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":18000,\"discount\":0,\"tax\":3240,\"total\":21240,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"amount_received\":200000,\"amount_change\":178760,\"id\":1}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:44:32'),(15,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":23}','{\"loyalty_points\":27}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:07'),(16,1,1,NULL,NULL,'App\\Models\\Sale',2,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000002\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":3500,\"discount\":0,\"tax\":630,\"total\":4130,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":4130,\"amount_change\":0,\"id\":2}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:07'),(17,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":27}','{\"loyalty_points\":31}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:16'),(18,1,1,NULL,NULL,'App\\Models\\Sale',3,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000003\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":3500,\"discount\":0,\"tax\":630,\"total\":4130,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":4130,\"amount_change\":0,\"id\":3}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:17'),(19,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":31}','{\"loyalty_points\":35}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:35'),(20,1,1,NULL,NULL,'App\\Models\\Sale',4,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000004\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":3500,\"discount\":0,\"tax\":630,\"total\":4130,\"payment_method\":\"card\",\"payment_status\":\"paid\",\"amount_received\":4130,\"amount_change\":0,\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 09:49:35'),(21,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":35}','{\"loyalty_points\":38}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 10:00:26'),(22,1,1,NULL,NULL,'App\\Models\\Sale',5,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000005\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":3000,\"discount\":0,\"tax\":540,\"total\":3540,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"amount_received\":20000,\"amount_change\":16460,\"id\":5}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 10:00:26'),(23,1,1,NULL,NULL,'App\\Models\\User',1,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 10:33:56'),(24,1,4,NULL,NULL,'App\\Models\\User',4,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 10:34:30'),(25,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 10:56:59'),(26,1,NULL,NULL,NULL,'App\\Models\\User',4,'updated',NULL,'{\"password\":\"$2y$12$z60ybusTyjmSNNBkdC6lL.4qFpAFaYLsDO2HoygTXXFRiQdGrpb0u\"}','{\"password\":\"$2y$12$9FT2KYaUTgUUmh2KGAC7MuJf\\/S2vL0qp.fvcsRpTrO\\/c8ey.zgl76\"}','127.0.0.1','Symfony',NULL,'success','2026-07-10 11:06:00'),(27,1,NULL,NULL,NULL,'App\\Models\\User',4,'updated',NULL,'{\"password\":\"$2y$12$9FT2KYaUTgUUmh2KGAC7MuJf\\/S2vL0qp.fvcsRpTrO\\/c8ey.zgl76\"}','{\"password\":\"$2y$12$z60ybusTyjmSNNBkdC6lL.4qFpAFaYLsDO2HoygTXXFRiQdGrpb0u\"}','127.0.0.1','Symfony',NULL,'success','2026-07-10 11:06:00'),(28,1,4,NULL,NULL,'App\\Models\\User',4,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:24:10'),(34,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:53:48'),(35,1,4,NULL,NULL,'App\\Models\\User',4,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:54:05'),(36,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:55:38'),(37,1,3,NULL,NULL,'App\\Models\\User',3,'login_pin_failed',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:55:48'),(38,1,3,NULL,NULL,'App\\Models\\User',3,'login_pin_failed',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:55:52'),(39,1,3,NULL,NULL,'App\\Models\\User',3,'login_pin_failed',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 11:55:58'),(40,1,1,NULL,NULL,'App\\Models\\User',1,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:04:22'),(41,1,1,NULL,NULL,'App\\Models\\User',1,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:09:25'),(42,1,2,NULL,NULL,'App\\Models\\User',2,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:09:47'),(43,1,2,NULL,NULL,'App\\Models\\User',2,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:11:11'),(44,1,3,NULL,NULL,'App\\Models\\User',3,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:11:21'),(45,1,3,NULL,NULL,'App\\Models\\User',3,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:12:18'),(46,1,1,NULL,NULL,'App\\Models\\User',1,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 12:12:34'),(47,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":38}','{\"loyalty_points\":255}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 13:57:13'),(48,1,1,NULL,NULL,'App\\Models\\Sale',6,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000006\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":184500,\"discount\":0,\"tax\":33210,\"total\":217710,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":217710,\"amount_change\":0,\"id\":6}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 13:57:13'),(49,1,1,NULL,NULL,'App\\Models\\CashSessionTransaction',7,'created',NULL,NULL,'{\"cash_session_id\":1,\"type\":\"deposit\",\"amount\":217710,\"description\":\"Vente VTE-000006 (geniuspay)\",\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 13:57:14'),(50,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":255}','{\"loyalty_points\":267}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:23:38'),(51,1,1,NULL,NULL,'App\\Models\\Sale',7,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000007\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":10500,\"discount\":0,\"tax\":1890,\"total\":12390,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":12390,\"amount_change\":0,\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:23:38'),(52,1,1,NULL,NULL,'App\\Models\\CashSessionTransaction',8,'created',NULL,NULL,'{\"cash_session_id\":1,\"type\":\"deposit\",\"amount\":12390,\"description\":\"Vente VTE-000007 (geniuspay)\",\"id\":8}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:23:38'),(53,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":267}','{\"loyalty_points\":269}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:30:16'),(54,1,1,NULL,NULL,'App\\Models\\Sale',8,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000008\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":2500,\"discount\":0,\"tax\":450,\"total\":2950,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":2950,\"amount_change\":0,\"id\":8}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:30:16'),(55,1,1,NULL,NULL,'App\\Models\\CashSessionTransaction',9,'created',NULL,NULL,'{\"cash_session_id\":1,\"type\":\"deposit\",\"amount\":2950,\"description\":\"Vente VTE-000008 (geniuspay)\",\"id\":9}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:30:17'),(56,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":269}','{\"loyalty_points\":271}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:34:09'),(57,1,1,NULL,NULL,'App\\Models\\Sale',9,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000009\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":2500,\"discount\":0,\"tax\":450,\"total\":2950,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":2950,\"amount_change\":0,\"id\":9}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:34:09'),(58,1,1,NULL,NULL,'App\\Models\\CashSessionTransaction',10,'created',NULL,NULL,'{\"cash_session_id\":1,\"type\":\"deposit\",\"amount\":2950,\"description\":\"Vente VTE-000009 (geniuspay)\",\"id\":10}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:34:09'),(59,1,1,NULL,NULL,'App\\Models\\Customer',1,'updated',NULL,'{\"loyalty_points\":271}','{\"loyalty_points\":273}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:37:04'),(60,1,1,NULL,NULL,'App\\Models\\Sale',10,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"user_id\":1,\"cash_session_id\":1,\"customer_id\":1,\"sale_number\":\"VTE-000010\",\"client_name\":\"grah\",\"client_phone\":\"056628394\",\"subtotal\":2500,\"discount\":0,\"tax\":450,\"total\":2950,\"payment_method\":\"geniuspay\",\"payment_status\":\"paid\",\"amount_received\":2950,\"amount_change\":0,\"id\":10}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:37:04'),(61,1,1,NULL,NULL,'App\\Models\\CashSessionTransaction',11,'created',NULL,NULL,'{\"cash_session_id\":1,\"type\":\"deposit\",\"amount\":2950,\"description\":\"Vente VTE-000010 (geniuspay)\",\"id\":11}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 14:37:05'),(62,1,1,NULL,NULL,'App\\Models\\StockMovement',18,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"product_id\":1,\"quantity\":5,\"type\":\"adjustment\",\"description\":\"Inventaire correctif\",\"id\":18}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-10 15:31:56'),(63,1,4,NULL,NULL,'App\\Models\\User',4,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 07:44:34'),(64,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 07:44:47'),(65,1,2,NULL,NULL,'App\\Models\\User',2,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 07:45:00'),(66,1,4,NULL,NULL,'App\\Models\\User',4,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:50:22'),(67,1,4,NULL,NULL,'App\\Models\\Company',1,'system_backup',NULL,NULL,'{\"backup_file\":\"backup-1784533983.sql.gz\",\"status\":\"completed\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:53:03'),(68,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:54:47'),(69,1,4,NULL,NULL,'App\\Models\\User',4,'login_pin_failed',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:55:11'),(70,1,1,NULL,NULL,'App\\Models\\User',1,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:55:27'),(71,1,NULL,NULL,NULL,'App\\Models\\Company',3,'created',NULL,NULL,'{\"name\":\"premmar Boutiques\",\"id\":3}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:57:47'),(72,1,NULL,NULL,NULL,'App\\Models\\Branch',4,'created',NULL,NULL,'{\"company_id\":3,\"name\":\"Boutique Centrale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:57:47'),(73,1,NULL,NULL,NULL,'App\\Models\\User',6,'created',NULL,NULL,'{\"company_id\":3,\"branch_id\":4,\"role_id\":2,\"name\":\"grah desire\",\"email\":\"desirejeanivangrah@gmail.com\",\"status\":\"active\",\"id\":6}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:57:47'),(74,3,6,NULL,NULL,'App\\Models\\User',6,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:58:14'),(75,1,4,NULL,NULL,'App\\Models\\User',4,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 07:59:09'),(76,4,NULL,NULL,NULL,'App\\Models\\Branch',5,'created',NULL,NULL,'{\"company_id\":4,\"name\":\"Boutique Principale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":5}','127.0.0.1','Symfony',NULL,'success','2026-07-20 08:07:38'),(77,4,NULL,NULL,NULL,'App\\Models\\Role',6,'created',NULL,NULL,'{\"company_id\":4,\"slug\":\"admin\",\"name\":\"Administrateur Entreprise\",\"id\":6}','127.0.0.1','Symfony',NULL,'success','2026-07-20 08:07:38'),(78,4,NULL,NULL,NULL,'App\\Models\\User',7,'created',NULL,NULL,'{\"company_id\":4,\"branch_id\":5,\"role_id\":6,\"name\":\"Admin Test Quincaillerie Express\",\"email\":\"admin_4@express.com\",\"status\":\"active\",\"id\":7}','127.0.0.1','Symfony',NULL,'success','2026-07-20 08:07:39'),(79,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 08:09:12'),(80,3,6,NULL,NULL,'App\\Models\\User',6,'password_reset_requested',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 08:11:32'),(81,1,1,NULL,NULL,'App\\Models\\User',1,'password_reset_requested',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 08:14:08'),(82,3,6,NULL,NULL,'App\\Models\\User',6,'password_reset_requested',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 08:37:10'),(83,3,6,NULL,NULL,'App\\Models\\User',6,'password_reset_requested',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 08:38:18'),(84,3,6,NULL,NULL,'App\\Models\\User',6,'password_reset_requested',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 08:47:32'),(85,1,4,NULL,NULL,'App\\Models\\User',4,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 09:03:22'),(86,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-20 09:04:37'),(87,1,NULL,NULL,NULL,'App\\Models\\Company',5,'created',NULL,NULL,'{\"name\":\"Librairie de France\",\"id\":5}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 15:04:48'),(88,1,NULL,NULL,NULL,'App\\Models\\Branch',6,'created',NULL,NULL,'{\"company_id\":5,\"name\":\"Boutique Centrale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":6}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 15:04:48'),(89,1,NULL,NULL,NULL,'App\\Models\\User',8,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"role_id\":2,\"name\":\"BAGUI RODRIGUE\",\"email\":\"bagui@gmail.com\",\"status\":\"active\",\"id\":8}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 15:04:49'),(90,5,8,NULL,NULL,'App\\Models\\User',8,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 15:08:11'),(91,5,8,NULL,NULL,'App\\Models\\User',8,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-20 15:12:48'),(92,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 13:50:05'),(93,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 13:50:06'),(94,1,1,NULL,NULL,'App\\Models\\Company',1,'updated',NULL,'{\"tax_settings\":null}','{\"tax_settings\":\"{\\\"tax_rate\\\":18,\\\"enable_tax\\\":true}\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 13:50:06'),(95,1,1,NULL,NULL,'App\\Models\\User',1,'company_tax_settings_updated',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 13:50:06'),(96,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 13:50:10'),(97,1,1,NULL,NULL,'App\\Models\\User',1,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 14:50:06'),(98,1,NULL,NULL,NULL,'App\\Models\\User',1,'updated',NULL,'{\"pin_code\":\"$2y$12$trzwE2lTYzk1OZyXwfmEheUO2bzUo3eBl5C78hzVl1Rq7.3qlM68K\"}','{\"pin_code\":\"$2y$12$6l.9UIRzyX2w972XIS3DTOXmrj9CBlJNAwdjHKc7XN6S0y5zfjhcm\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:16'),(99,1,NULL,NULL,NULL,'App\\Models\\User',2,'updated',NULL,'{\"pin_code\":\"$2y$12$vQ3uwjLJFv\\/f4UIKo8lrDOy1tdVZCUPZqMVmB69aOeFMPwTKMot8q\"}','{\"pin_code\":\"$2y$12$3bur8ZUDLFPhRGMS3W0L.OdPxL4oaxGGQBTYH.vL\\/cLkJvbuULbJ2\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:17'),(100,1,NULL,NULL,NULL,'App\\Models\\User',3,'updated',NULL,'{\"pin_code\":\"$2y$12$P0EQmJR6OiVRcCBBa2d6rOr7NOhELjBibNQJF3WStKkr.ie1nbT5a\"}','{\"pin_code\":\"$2y$12$4T1dIHng.xq8EEhZa.OE7.VP3rRJ4upqspRWqRA1LgQR4yg\\/XUijC\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:18'),(101,1,NULL,NULL,NULL,'App\\Models\\User',4,'updated',NULL,'{\"pin_code\":\"$2y$12$DrwTcK78DjAN7mb2e4JSuews2Pvd9SMZ1z3wu3ZqCVWuJl1r5evKO\"}','{\"pin_code\":\"$2y$12$05Pj1glUDNiZw8kTvLoMuOcL8.Md1IOL.M83PBXZNpi24SOKIJjme\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:18'),(102,3,NULL,NULL,NULL,'App\\Models\\User',6,'updated',NULL,'{\"pin_code\":\"$2y$12$lhCjkkHxaq20qaIy51lAcekWIjN79cCdoJWnsxA6Jgb6fLB7i7hji\"}','{\"pin_code\":\"$2y$12$QoBLfJyzW1RiM8k8NcDGO.cOSa1\\/G\\/sbysS.EjJVPahoVLU0z9HWC\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:19'),(103,4,NULL,NULL,NULL,'App\\Models\\User',7,'updated',NULL,'{\"pin_code\":\"$2y$12$kqALVsy\\/iSH7aYn4ExrqY.Jv1WHzQroOprxVoqymIml75wuM0BCju\"}','{\"pin_code\":\"$2y$12$3weXrCIpxJxC1xyFYDqKpuAde4IJUFMN5brKT2anxLoWuu.xmrIKC\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:20'),(104,5,NULL,NULL,NULL,'App\\Models\\User',8,'updated',NULL,'{\"pin_code\":\"$2y$12$aAzozi42CSDJEPWFnhORruuuze0\\/zafM46.862RrlvvzS1WUzWUl6\"}','{\"pin_code\":\"$2y$12$WOHzKyKQJ2eHnjSOyrK4z.Acymb7V9NbONrFcn4gw2QsMN.lrNx62\"}','127.0.0.1','Symfony',NULL,'success','2026-07-21 14:57:20'),(105,1,1,NULL,NULL,'App\\Models\\User',1,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 14:57:36'),(106,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:03:07'),(107,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:05:07'),(108,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:14:50'),(109,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:20:48'),(110,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:21:10'),(111,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:21:40'),(112,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:22:00'),(113,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:22:24'),(114,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 15:23:34'),(115,3,6,NULL,NULL,'App\\Models\\CashSession',2,'created',NULL,NULL,'{\"company_id\":3,\"branch_id\":4,\"user_id\":6,\"opening_balance\":10000,\"status\":\"open\",\"notes\":null,\"opened_at\":\"2026-07-21T15:25:46.124079Z\",\"id\":2}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:25:46'),(116,3,6,NULL,NULL,'App\\Models\\User',6,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:37:07'),(117,6,NULL,NULL,NULL,'App\\Models\\Branch',7,'created',NULL,NULL,'{\"company_id\":6,\"name\":\"Boutique Centrale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:52:04'),(118,6,NULL,NULL,NULL,'App\\Models\\User',9,'created',NULL,NULL,'{\"company_id\":6,\"branch_id\":7,\"role_id\":2,\"name\":\"YASMINE BAMBA\",\"email\":\"yasmine@gmail.com\",\"status\":\"active\",\"id\":9}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:52:05'),(119,6,9,NULL,NULL,'App\\Models\\User',9,'updated',NULL,'{\"pin_code\":\"$2y$12$Nt7gCprIutX2qpGXfywvruIJA7NHP0RHrP9S6ngIED3cMIYCrcm\\/q\"}','{\"pin_code\":\"$2y$12$kNhbPuaOpgTAlfRt6w5bfumZcsOYths7hP1ZB01xgdZ7AIehWx1kC\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:53:01'),(120,6,9,NULL,NULL,'App\\Models\\User',9,'profile_updated',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:53:01'),(121,6,9,NULL,NULL,'App\\Models\\User',10,'created',NULL,NULL,'{\"company_id\":6,\"branch_id\":null,\"role_id\":\"3\",\"name\":\"h\\u00e9l\\u00e8ne kouam\\u00e9\",\"email\":\"helene@gmail.com\",\"status\":\"active\",\"id\":10}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:54:23'),(122,6,9,NULL,NULL,'App\\Models\\User',9,'user_created',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:54:23'),(123,6,9,NULL,NULL,'App\\Models\\User',9,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:54:33'),(124,4,7,NULL,NULL,'App\\Models\\User',7,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:57:34'),(125,4,7,NULL,NULL,'App\\Models\\User',7,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:58:42'),(126,6,9,NULL,NULL,'App\\Models\\User',9,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:58:59'),(127,6,9,NULL,NULL,'App\\Models\\User',9,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:59:35'),(128,6,10,NULL,NULL,'App\\Models\\User',10,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 15:59:43'),(129,6,10,NULL,NULL,'App\\Models\\User',10,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:02:37'),(130,1,4,NULL,NULL,'App\\Models\\User',4,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:03:08'),(131,1,4,NULL,NULL,'App\\Models\\User',4,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:04:20'),(132,1,1,NULL,NULL,'App\\Models\\User',1,'login_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 16:09:23'),(133,5,8,NULL,NULL,'App\\Models\\User',8,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:14:30'),(134,5,8,NULL,NULL,'App\\Models\\User',8,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:14:39'),(135,5,8,NULL,NULL,'App\\Models\\User',8,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:15:43'),(136,5,8,NULL,NULL,'App\\Models\\Category',7,'created',NULL,NULL,'{\"name\":\"spays\",\"slug\":\"spays\",\"image_path\":\"\\/storage\\/categories\\/0HzM7hrmOw1GbxymhF4u5cgQHmRF1rED9Cte64xj.png\",\"company_id\":5,\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:47:11'),(137,5,8,NULL,NULL,'App\\Models\\Product',5,'created',NULL,NULL,'{\"category_id\":\"7\",\"name\":\"spray\",\"sku\":\"sku-ure-123\",\"barcode\":\"dsqzefg\",\"selling_price\":\"2000\",\"alert_quantity\":\"10\",\"image_path\":\"\\/storage\\/products\\/qhj77uESwYuOnWUMYWE2UjdyMujPdlUz2Zcv31Lk.png\",\"company_id\":5,\"id\":5}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 16:47:43'),(138,3,6,NULL,NULL,'App\\Models\\User',6,'login_pin_success',NULL,NULL,'{\"device\":\"curl\\/8.5.0\",\"status\":\"success\"}','127.0.0.1','curl/8.5.0',NULL,'success','2026-07-21 16:55:22'),(139,5,8,NULL,NULL,'App\\Models\\Branch',8,'created',NULL,NULL,'{\"name\":\"boutique bouake\",\"address\":\"bouake kennedy\",\"phone\":\"+225 0566289394\",\"company_id\":5,\"id\":8}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:09:55'),(140,5,8,NULL,NULL,'App\\Models\\Branch',8,'updated',NULL,'{\"address\":\"bouake kennedy\"}','{\"address\":\"bouake kenedy\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:10:06'),(141,5,8,NULL,NULL,'App\\Models\\Customer',2,'created',NULL,NULL,'{\"name\":\"grah desire\",\"email\":\"desirejeanivangrah@gmail.com\",\"phone\":\"O566289394\",\"address\":\"angre\",\"credit_limit\":500000,\"debt_balance\":0,\"loyalty_points\":0,\"company_id\":5,\"id\":2}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:15:41'),(142,5,8,NULL,NULL,'App\\Models\\CashSession',3,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"user_id\":8,\"opening_balance\":10000,\"status\":\"open\",\"notes\":null,\"opened_at\":\"2026-07-21T17:15:46.323130Z\",\"id\":3}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:15:46'),(143,5,8,NULL,NULL,'App\\Models\\CashSessionTransaction',12,'created',NULL,NULL,'{\"cash_session_id\":3,\"type\":\"deposit\",\"amount\":20000,\"description\":\"monnaie\",\"id\":12}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:16:03'),(144,5,8,NULL,NULL,'App\\Models\\CashSessionTransaction',13,'created',NULL,NULL,'{\"cash_session_id\":3,\"type\":\"deposit\",\"amount\":20000,\"description\":\"Monnaie\",\"id\":13}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:16:22'),(145,5,8,NULL,NULL,'App\\Models\\Company',5,'updated',NULL,'{\"tax_settings\":null}','{\"tax_settings\":\"{\\\"tax_rate\\\":18,\\\"enable_tax\\\":false}\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:18:08'),(146,5,8,NULL,NULL,'App\\Models\\User',8,'company_tax_settings_updated',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:18:09'),(147,5,8,NULL,NULL,'App\\Models\\Company',5,'updated',NULL,'{\"tax_settings\":{\"tax_rate\":18,\"enable_tax\":false}}','{\"tax_settings\":\"{\\\"tax_rate\\\":10,\\\"enable_tax\\\":true}\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:24:02'),(148,5,8,NULL,NULL,'App\\Models\\User',8,'company_tax_settings_updated',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:24:02'),(149,5,8,NULL,NULL,'App\\Models\\Sale',11,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"user_id\":8,\"cash_session_id\":3,\"customer_id\":null,\"sale_number\":\"VTE-000001\",\"client_name\":\"Client Comptant\",\"client_phone\":null,\"subtotal\":2000,\"discount\":0,\"tax\":200,\"total\":2200,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"amount_received\":5000,\"amount_change\":2800,\"id\":11}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:28:24'),(150,5,8,NULL,NULL,'App\\Models\\CashSessionTransaction',14,'created',NULL,NULL,'{\"cash_session_id\":3,\"type\":\"deposit\",\"amount\":2200,\"description\":\"Vente VTE-000001 (cash)\",\"id\":14}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:28:24'),(151,5,8,NULL,NULL,'App\\Models\\CashSession',3,'updated',NULL,'{\"closing_balance\":null,\"theoretical_balance\":null,\"status\":\"open\",\"closed_at\":null}','{\"closing_balance\":52200,\"theoretical_balance\":52200,\"status\":\"closed\",\"closed_at\":\"2026-07-21T17:44:26.564860Z\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:44:26'),(152,5,8,NULL,NULL,'App\\Models\\StockTransfer',4,'created',NULL,NULL,'{\"company_id\":5,\"from_branch_id\":8,\"to_branch_id\":6,\"transfer_number\":\"TRSF-1784655917-300\",\"status\":\"pending\",\"notes\":null,\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 17:45:17'),(153,5,8,NULL,NULL,'App\\Models\\Supplier',5,'created',NULL,NULL,'{\"name\":\"Moussa Sanogo\",\"email\":\"moussa@gmail.com\",\"phone\":\"+225076193753\",\"address\":\"Abobo\",\"debt_balance\":0,\"company_id\":5,\"id\":5}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 21:35:42'),(154,5,8,NULL,NULL,'App\\Models\\StockMovement',20,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":1,\"product_id\":1,\"quantity\":10,\"type\":\"adjustment\",\"description\":\"ajustements\",\"id\":20}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-21 21:37:34'),(155,1,1,NULL,NULL,'App\\Models\\Purchase',2,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"supplier_id\":1,\"purchase_number\":\"BON-ACH-1784710828-893\",\"status\":\"received\",\"payment_status\":\"partially_paid\",\"subtotal\":2000,\"tax_amount\":360,\"total_amount\":2360,\"amount_paid\":5000,\"notes\":\"Test approvisionnement automatique\",\"id\":2}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:00:28'),(156,1,1,NULL,NULL,'App\\Models\\Product',3,'updated',NULL,'{\"cost_price\":\"0.00\"}','{\"cost_price\":1000}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:00:28'),(157,1,1,NULL,NULL,'App\\Models\\StockMovement',21,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"product_id\":3,\"quantity\":2,\"type\":\"purchase\",\"reference_id\":2,\"description\":\"R\\u00e9ception achat Bon #2\",\"id\":21}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:00:28'),(158,5,8,NULL,NULL,'App\\Models\\Purchase',3,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":8,\"supplier_id\":5,\"purchase_number\":\"BON-ACH-1784710944-993\",\"status\":\"ordered\",\"payment_status\":\"paid\",\"subtotal\":120000,\"tax_amount\":0,\"total_amount\":120000,\"amount_paid\":0,\"notes\":null,\"id\":3}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:24'),(159,5,8,NULL,NULL,'App\\Models\\Product',5,'updated',NULL,'{\"cost_price\":\"0.00\"}','{\"cost_price\":1200}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:34'),(160,5,8,NULL,NULL,'App\\Models\\StockMovement',22,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":8,\"product_id\":5,\"quantity\":\"100.00\",\"type\":\"purchase\",\"reference_id\":3,\"description\":\"R\\u00e9ception achat Bon #3\",\"id\":22}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:34'),(161,5,8,NULL,NULL,'App\\Models\\Purchase',3,'updated',NULL,'{\"status\":\"ordered\"}','{\"status\":\"received\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:34'),(162,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"0.00\"}','{\"debt_balance\":120000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:34'),(163,5,8,NULL,NULL,'App\\Models\\StockMovement',23,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":8,\"product_id\":5,\"quantity\":-1,\"type\":\"transfer\",\"reference_id\":4,\"description\":\"Sortie transfert inter-boutique #4\",\"id\":23}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:55'),(164,5,8,NULL,NULL,'App\\Models\\StockTransfer',4,'updated',NULL,'{\"status\":\"pending\"}','{\"status\":\"transit\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:02:55'),(165,5,8,NULL,NULL,'App\\Models\\StockMovement',24,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"product_id\":5,\"quantity\":\"1.00\",\"type\":\"transfer\",\"reference_id\":4,\"description\":\"Entr\\u00e9e transfert inter-boutique #4\",\"id\":24}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:03:06'),(166,5,8,NULL,NULL,'App\\Models\\StockTransfer',4,'updated',NULL,'{\"status\":\"transit\"}','{\"status\":\"completed\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 09:03:06'),(167,1,1,NULL,NULL,'App\\Models\\Branch',9,'created',NULL,NULL,'{\"company_id\":1,\"name\":\"Entrep\\u00f4t Central Dakar\",\"type\":\"warehouse\",\"is_warehouse\":true,\"status\":\"open\",\"id\":9}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:29'),(168,1,1,NULL,NULL,'App\\Models\\User',11,'created',NULL,NULL,'{\"email\":\"jean.vendeur@dls.com\",\"company_id\":1,\"branch_id\":1,\"role_id\":3,\"name\":\"Jean Vendeur\",\"status\":\"active\",\"id\":11}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:30'),(169,1,1,NULL,NULL,'App\\Models\\Branch',10,'created',NULL,NULL,'{\"company_id\":1,\"name\":\"Boutique Test Maintenance\",\"status\":\"maintenance\",\"id\":10}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:30'),(170,1,1,NULL,NULL,'App\\Models\\Branch',10,'deleted',NULL,'{\"company_id\":1,\"name\":\"Boutique Test Maintenance\",\"status\":\"maintenance\",\"id\":10,\"deleted_at\":\"2026-07-22T09:45:31.000000Z\"}',NULL,'127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:31'),(171,1,1,NULL,NULL,'App\\Models\\CashRegister',1,'created',NULL,NULL,'{\"company_id\":1,\"branch_id\":1,\"name\":\"Caisse Principale N\\u00b01\",\"code\":\"POS-01\",\"status\":\"active\",\"id\":1}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:31'),(172,1,1,NULL,NULL,'App\\Models\\Product',6,'created',NULL,NULL,'{\"company_id\":1,\"category_id\":1,\"name\":\"Produit Test Corbeille\",\"sku\":\"TEST-TRASH-1784713531\",\"selling_price\":500,\"cost_price\":300,\"id\":6}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:31'),(173,1,1,NULL,NULL,'App\\Models\\Product',6,'deleted',NULL,'{\"company_id\":1,\"category_id\":1,\"name\":\"Produit Test Corbeille\",\"sku\":\"TEST-TRASH-1784713531\",\"selling_price\":500,\"cost_price\":300,\"id\":6,\"deleted_at\":\"2026-07-22T09:45:31.000000Z\"}',NULL,'127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:32'),(174,1,1,NULL,NULL,'App\\Models\\Product',6,'updated',NULL,'{\"deleted_at\":\"2026-07-22T09:45:31.000000Z\"}','{\"deleted_at\":null}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:32'),(175,1,1,NULL,NULL,'App\\Models\\Product',6,'deleted',NULL,'{\"company_id\":1,\"category_id\":1,\"name\":\"Produit Test Corbeille\",\"sku\":\"TEST-TRASH-1784713531\",\"selling_price\":500,\"cost_price\":300,\"id\":6,\"deleted_at\":null}',NULL,'127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:32'),(176,1,1,NULL,NULL,'App\\Models\\StockTransfer',5,'created',NULL,NULL,'{\"company_id\":1,\"from_branch_id\":9,\"to_branch_id\":1,\"transfer_number\":\"TRSF-TEST-1784713532\",\"status\":\"draft\",\"id\":5}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:32'),(177,1,1,NULL,NULL,'App\\Models\\StockTransfer',5,'updated',NULL,'{\"status\":\"draft\"}','{\"status\":\"approved\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:32'),(178,1,1,NULL,NULL,'App\\Models\\StockTransfer',5,'updated',NULL,'{\"status\":\"approved\"}','{\"status\":\"shipped\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:33'),(179,1,1,NULL,NULL,'App\\Models\\StockTransfer',5,'updated',NULL,'{\"status\":\"shipped\"}','{\"status\":\"received\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:45:33'),(180,1,1,NULL,NULL,'App\\Models\\Sale',1,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(181,1,1,NULL,NULL,'App\\Models\\Sale',2,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(182,1,1,NULL,NULL,'App\\Models\\Sale',3,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(183,1,1,NULL,NULL,'App\\Models\\Sale',4,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(184,1,1,NULL,NULL,'App\\Models\\Sale',5,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(185,1,1,NULL,NULL,'App\\Models\\Sale',6,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(186,1,1,NULL,NULL,'App\\Models\\Sale',7,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(187,1,1,NULL,NULL,'App\\Models\\Sale',8,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(188,1,1,NULL,NULL,'App\\Models\\Sale',9,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(189,1,1,NULL,NULL,'App\\Models\\Sale',10,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(190,1,1,NULL,NULL,'App\\Models\\Sale',11,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(191,1,1,NULL,NULL,'App\\Models\\Sale',12,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(192,1,1,NULL,NULL,'App\\Models\\Sale',13,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(193,1,1,NULL,NULL,'App\\Models\\Sale',14,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(194,1,1,NULL,NULL,'App\\Models\\Sale',15,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(195,1,1,NULL,NULL,'App\\Models\\Sale',16,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(196,1,1,NULL,NULL,'App\\Models\\Sale',17,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(197,1,1,NULL,NULL,'App\\Models\\Sale',18,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(198,1,1,NULL,NULL,'App\\Models\\Sale',19,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:33'),(199,1,1,NULL,NULL,'App\\Models\\Sale',20,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(200,1,1,NULL,NULL,'App\\Models\\Sale',21,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(201,1,1,NULL,NULL,'App\\Models\\Sale',22,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(202,1,1,NULL,NULL,'App\\Models\\Sale',23,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(203,1,1,NULL,NULL,'App\\Models\\Sale',24,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(204,1,1,NULL,NULL,'App\\Models\\Sale',25,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(205,1,1,NULL,NULL,'App\\Models\\Sale',26,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(206,1,1,NULL,NULL,'App\\Models\\Sale',27,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(207,1,1,NULL,NULL,'App\\Models\\Sale',28,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(208,1,1,NULL,NULL,'App\\Models\\Sale',29,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(209,1,1,NULL,NULL,'App\\Models\\Sale',30,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(210,1,1,NULL,NULL,'App\\Models\\Sale',31,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:34'),(211,1,1,NULL,NULL,'App\\Models\\Sale',32,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(212,1,1,NULL,NULL,'App\\Models\\Sale',33,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(213,1,1,NULL,NULL,'App\\Models\\Sale',34,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(214,1,1,NULL,NULL,'App\\Models\\Sale',35,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(215,1,1,NULL,NULL,'App\\Models\\Sale',36,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(216,1,1,NULL,NULL,'App\\Models\\Sale',37,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(217,1,1,NULL,NULL,'App\\Models\\Sale',38,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(218,1,1,NULL,NULL,'App\\Models\\Sale',39,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(219,1,1,NULL,NULL,'App\\Models\\Sale',40,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(220,1,1,NULL,NULL,'App\\Models\\Sale',41,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(221,1,1,NULL,NULL,'App\\Models\\Sale',42,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(222,1,1,NULL,NULL,'App\\Models\\Sale',43,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(223,1,1,NULL,NULL,'App\\Models\\Sale',44,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(224,1,1,NULL,NULL,'App\\Models\\Sale',45,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(225,1,1,NULL,NULL,'App\\Models\\Sale',46,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(226,1,1,NULL,NULL,'App\\Models\\Sale',47,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(227,1,1,NULL,NULL,'App\\Models\\Sale',48,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:35'),(228,1,1,NULL,NULL,'App\\Models\\Sale',49,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(229,1,1,NULL,NULL,'App\\Models\\Sale',50,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(230,1,1,NULL,NULL,'App\\Models\\Sale',51,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(231,1,1,NULL,NULL,'App\\Models\\Sale',52,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(232,1,1,NULL,NULL,'App\\Models\\Sale',53,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(233,1,1,NULL,NULL,'App\\Models\\Sale',54,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(234,1,1,NULL,NULL,'App\\Models\\Sale',55,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(235,1,1,NULL,NULL,'App\\Models\\Sale',56,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(236,1,1,NULL,NULL,'App\\Models\\Sale',57,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(237,1,1,NULL,NULL,'App\\Models\\Sale',58,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(238,1,1,NULL,NULL,'App\\Models\\Sale',59,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(239,1,1,NULL,NULL,'App\\Models\\Sale',60,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(240,1,1,NULL,NULL,'App\\Models\\Sale',61,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(241,1,1,NULL,NULL,'App\\Models\\Sale',62,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(242,1,1,NULL,NULL,'App\\Models\\Sale',63,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(243,1,1,NULL,NULL,'App\\Models\\Sale',64,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:36'),(244,1,1,NULL,NULL,'App\\Models\\Sale',65,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(245,1,1,NULL,NULL,'App\\Models\\Sale',66,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(246,1,1,NULL,NULL,'App\\Models\\Sale',67,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(247,1,1,NULL,NULL,'App\\Models\\Sale',68,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(248,1,1,NULL,NULL,'App\\Models\\Sale',69,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(249,1,1,NULL,NULL,'App\\Models\\Sale',70,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(250,1,1,NULL,NULL,'App\\Models\\Sale',71,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(251,1,1,NULL,NULL,'App\\Models\\Sale',72,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(252,1,1,NULL,NULL,'App\\Models\\Sale',73,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(253,1,1,NULL,NULL,'App\\Models\\Sale',74,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(254,1,1,NULL,NULL,'App\\Models\\Sale',75,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(255,1,1,NULL,NULL,'App\\Models\\Sale',76,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(256,1,1,NULL,NULL,'App\\Models\\Sale',77,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(257,1,1,NULL,NULL,'App\\Models\\Sale',78,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:37'),(258,1,1,NULL,NULL,'App\\Models\\Sale',79,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(259,1,1,NULL,NULL,'App\\Models\\Sale',80,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(260,1,1,NULL,NULL,'App\\Models\\Sale',81,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(261,1,1,NULL,NULL,'App\\Models\\Sale',82,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(262,1,1,NULL,NULL,'App\\Models\\Sale',83,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(263,1,1,NULL,NULL,'App\\Models\\Sale',84,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(264,1,1,NULL,NULL,'App\\Models\\Sale',85,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(265,1,1,NULL,NULL,'App\\Models\\Sale',86,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(266,1,1,NULL,NULL,'App\\Models\\Sale',87,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(267,1,1,NULL,NULL,'App\\Models\\Sale',88,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(268,1,1,NULL,NULL,'App\\Models\\Sale',89,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(269,1,1,NULL,NULL,'App\\Models\\Sale',90,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(270,1,1,NULL,NULL,'App\\Models\\Sale',91,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(271,1,1,NULL,NULL,'App\\Models\\Sale',92,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(272,1,1,NULL,NULL,'App\\Models\\Sale',93,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(273,1,1,NULL,NULL,'App\\Models\\Sale',94,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(274,1,1,NULL,NULL,'App\\Models\\Sale',95,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(275,1,1,NULL,NULL,'App\\Models\\Sale',96,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(276,1,1,NULL,NULL,'App\\Models\\Sale',97,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(277,1,1,NULL,NULL,'App\\Models\\Sale',98,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:38'),(278,1,1,NULL,NULL,'App\\Models\\Sale',99,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:39'),(279,1,1,NULL,NULL,'App\\Models\\Sale',100,'created',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:45:39'),(280,1,4,NULL,NULL,'App\\Models\\Company',1,'system_backup',NULL,NULL,'{\"backup_file\":\"backup-quincaillerie-2026-07-22_09-56-26.sql\",\"size_bytes\":235079,\"status\":\"completed\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 09:56:26'),(281,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:26'),(282,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:26'),(283,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:26'),(284,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(285,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(286,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(287,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(288,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(289,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(290,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(291,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(292,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(293,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(294,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(295,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(296,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(297,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(298,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(299,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(300,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(301,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(302,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(303,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:27'),(304,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(305,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(306,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(307,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(308,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(309,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(310,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(311,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(312,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(313,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(314,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(315,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(316,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(317,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(318,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(319,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:28'),(320,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(321,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(322,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(323,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(324,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(325,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(326,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(327,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(328,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(329,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(330,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(331,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(332,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(333,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(334,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(335,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(336,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(337,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(338,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(339,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(340,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(341,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(342,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(343,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:29'),(344,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(345,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(346,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(347,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(348,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(349,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(350,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(351,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(352,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(353,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(354,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(355,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(356,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(357,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(358,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(359,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(360,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(361,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(362,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(363,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(364,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(365,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(366,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:30'),(367,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(368,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(369,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(370,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(371,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(372,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(373,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(374,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(375,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(376,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(377,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(378,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(379,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(380,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:56:31'),(381,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:51'),(382,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:51'),(383,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(384,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(385,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(386,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(387,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(388,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(389,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(390,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(391,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(392,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(393,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(394,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(395,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(396,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(397,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(398,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:52'),(399,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:53'),(400,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:53'),(401,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:53'),(402,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:53'),(403,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:53'),(404,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(405,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(406,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(407,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(408,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(409,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(410,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(411,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(412,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(413,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(414,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(415,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(416,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(417,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(418,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(419,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(420,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:54'),(421,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(422,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(423,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(424,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(425,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(426,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(427,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(428,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(429,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(430,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(431,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(432,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(433,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(434,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(435,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(436,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(437,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(438,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(439,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(440,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(441,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:55'),(442,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(443,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(444,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(445,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(446,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(447,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(448,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(449,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(450,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(451,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(452,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(453,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(454,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(455,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(456,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(457,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(458,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(459,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(460,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:56'),(461,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(462,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(463,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(464,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(465,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(466,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(467,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(468,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(469,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(470,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(471,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(472,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(473,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(474,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(475,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(476,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(477,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(478,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(479,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(480,1,4,NULL,NULL,'App\\Models\\Product',1,'qualification_load_test',NULL,NULL,NULL,NULL,NULL,NULL,'success','2026-07-22 09:57:57'),(481,5,8,NULL,NULL,'App\\Models\\User',8,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:02:20'),(482,1,1,NULL,NULL,'App\\Models\\Branch',1,'updated',NULL,'{\"status\":\"open\"}','{\"status\":\"closed\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 10:06:54'),(483,1,1,NULL,NULL,'App\\Models\\Branch',1,'updated',NULL,'{\"status\":\"closed\"}','{\"status\":\"open\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 10:07:07'),(484,5,8,NULL,NULL,'App\\Models\\Branch',8,'updated',NULL,'{\"status\":\"open\"}','{\"status\":\"closed\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:08:03'),(485,5,8,NULL,NULL,'App\\Models\\Branch',8,'updated',NULL,'{\"status\":\"closed\"}','{\"status\":\"open\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:08:05'),(486,5,8,NULL,NULL,'App\\Models\\Branch',8,'updated',NULL,'{\"status\":\"open\"}','{\"status\":\"closed\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:08:40'),(487,5,8,NULL,NULL,'App\\Models\\Branch',8,'updated',NULL,'{\"status\":\"closed\"}','{\"status\":\"open\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:08:43'),(488,5,8,NULL,NULL,'App\\Models\\CashSession',4,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"user_id\":8,\"opening_balance\":50000,\"status\":\"open\",\"notes\":null,\"opened_at\":\"2026-07-22T10:09:23.025194Z\",\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:09:23'),(489,5,8,NULL,NULL,'App\\Models\\CashSessionTransaction',15,'created',NULL,NULL,'{\"cash_session_id\":4,\"type\":\"deposit\",\"amount\":10000,\"description\":\"monnaie\",\"id\":15}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:09:38'),(490,5,8,NULL,NULL,'App\\Models\\Company',5,'updated',NULL,'{\"tax_settings\":{\"tax_rate\":10,\"enable_tax\":true}}','{\"tax_settings\":\"{\\\"tax_rate\\\":0,\\\"enable_tax\\\":false}\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:10:08'),(491,5,8,NULL,NULL,'App\\Models\\User',8,'company_tax_settings_updated',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:10:08'),(492,5,8,NULL,NULL,'App\\Models\\Sale',12,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"user_id\":8,\"cash_session_id\":4,\"customer_id\":null,\"sale_number\":\"VTE-000002\",\"client_name\":\"Client Comptant\",\"client_phone\":null,\"subtotal\":2000,\"discount\":0,\"tax\":0,\"total\":2000,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"amount_received\":2000,\"amount_change\":0,\"id\":12}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:10:20'),(493,5,8,NULL,NULL,'App\\Models\\CashSessionTransaction',16,'created',NULL,NULL,'{\"cash_session_id\":4,\"type\":\"deposit\",\"amount\":2000,\"description\":\"Vente VTE-000002 (cash)\",\"id\":16}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:10:20'),(494,5,8,NULL,NULL,'App\\Models\\Category',8,'created',NULL,NULL,'{\"name\":\"plomberie\",\"slug\":\"plomberie\",\"image_path\":\"\\/storage\\/categories\\/sGwHJoCmjP29lE9PaakbH9KlXJdpjKdhKVbZsQ0g.png\",\"company_id\":5,\"id\":8}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:18:22'),(495,5,8,NULL,NULL,'App\\Models\\Product',7,'created',NULL,NULL,'{\"category_id\":\"8\",\"name\":\"robinet\",\"sku\":\"TY6-FDRE-GEDFE\",\"barcode\":\"VDVDDFVcsfs\",\"selling_price\":\"5000\",\"alert_quantity\":\"200\",\"image_path\":\"\\/storage\\/products\\/TDsVDphVx8XvwOH7yKaQRbj2c5WV2fSwS6dP8qgq.png\",\"company_id\":5,\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:19:37'),(496,5,8,NULL,NULL,'App\\Models\\StockMovement',26,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":1,\"product_id\":1,\"quantity\":23,\"type\":\"adjustment\",\"description\":\"ajustements\",\"id\":26}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:20:36'),(497,5,8,NULL,NULL,'App\\Models\\StockMovement',27,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":2,\"product_id\":1,\"quantity\":10,\"type\":\"adjustment\",\"description\":\"correctif\",\"id\":27}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:20:59'),(498,5,8,NULL,NULL,'App\\Models\\StockTransfer',6,'created',NULL,NULL,'{\"company_id\":5,\"from_branch_id\":6,\"to_branch_id\":8,\"transfer_number\":\"TRSF-1784715691-890\",\"status\":\"pending\",\"notes\":null,\"id\":6}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:21:31'),(499,5,8,NULL,NULL,'App\\Models\\Purchase',4,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"supplier_id\":5,\"purchase_number\":\"BON-ACH-1784716003-300\",\"status\":\"received\",\"payment_status\":\"unpaid\",\"subtotal\":1000000,\"tax_amount\":20000,\"total_amount\":1020000,\"amount_paid\":0,\"notes\":null,\"id\":4}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:26:43'),(500,5,8,NULL,NULL,'App\\Models\\Product',7,'updated',NULL,'{\"cost_price\":\"0.00\"}','{\"cost_price\":1428.5714285714287}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:26:43'),(501,5,8,NULL,NULL,'App\\Models\\StockMovement',28,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"product_id\":7,\"quantity\":500,\"type\":\"purchase\",\"reference_id\":4,\"description\":\"R\\u00e9ception achat Bon #4\",\"id\":28}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:26:43'),(502,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"120000.00\"}','{\"debt_balance\":1140000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:26:43'),(503,5,8,NULL,NULL,'App\\Models\\StockMovement',29,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"product_id\":7,\"quantity\":100,\"type\":\"adjustment\",\"description\":\"ajout\",\"id\":29}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:28:16'),(504,5,8,NULL,NULL,'App\\Models\\StockMovement',30,'created',NULL,NULL,'{\"company_id\":5,\"branch_id\":6,\"product_id\":7,\"quantity\":-50,\"type\":\"transfer\",\"reference_id\":6,\"description\":\"Sortie transfert inter-boutique #6\",\"id\":30}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:28:34'),(505,5,8,NULL,NULL,'App\\Models\\StockTransfer',6,'updated',NULL,'{\"status\":\"pending\"}','{\"status\":\"shipped\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:28:34'),(506,1,1,NULL,NULL,'App\\Models\\Supplier',1,'updated',NULL,'{\"email\":\"contact@alazhar.sn\",\"phone\":\"+221 33 824 55 66\"}','{\"email\":\"contact.fournisseur@test.com\",\"phone\":\"+221 77 000 11 22\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 10:29:47'),(507,1,1,NULL,NULL,'App\\Models\\Purchase',1,'updated',NULL,'{\"payment_status\":\"paid\",\"amount_paid\":\"0.00\",\"notes\":null}','{\"payment_status\":\"partially_paid\",\"amount_paid\":1000,\"notes\":\"Achat v\\u00e9rifi\\u00e9 et mis \\u00e0 jour.\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 10:29:47'),(508,1,1,NULL,NULL,'App\\Models\\Supplier',4,'updated',NULL,'{\"debt_balance\":\"708000.00\"}','{\"debt_balance\":707000}','127.0.0.1','Symfony',NULL,'success','2026-07-22 10:29:47'),(509,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"1140000.00\"}','{\"debt_balance\":1140000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:30:44'),(510,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"1140000.00\"}','{\"debt_balance\":1140000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:30:48'),(511,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"1140000.00\"}','{\"debt_balance\":0}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:31:02'),(512,5,8,NULL,NULL,'App\\Models\\Purchase',4,'updated',NULL,'{\"amount_paid\":\"0.00\"}','{\"amount_paid\":1020000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:36:23'),(513,5,8,NULL,NULL,'App\\Models\\Supplier',5,'updated',NULL,'{\"debt_balance\":\"0.00\"}','{\"debt_balance\":-1020000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:36:23'),(514,5,8,NULL,NULL,'App\\Models\\Purchase',4,'updated',NULL,'{\"payment_status\":\"unpaid\",\"amount_paid\":\"1020000.00\"}','{\"payment_status\":\"paid\",\"amount_paid\":1020000}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:36:36'),(515,5,NULL,NULL,NULL,'App\\Models\\Company',7,'created',NULL,NULL,'{\"name\":\"Fruitfox\",\"code\":\"WC1P-CEME\",\"id\":7}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:38:18'),(516,5,NULL,NULL,NULL,'App\\Models\\Branch',11,'created',NULL,NULL,'{\"company_id\":7,\"name\":\"Boutique Centrale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":11}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:38:18'),(517,5,NULL,NULL,NULL,'App\\Models\\User',12,'created',NULL,NULL,'{\"company_id\":7,\"branch_id\":11,\"role_id\":2,\"name\":\"Tape Desire\",\"email\":\"tapedesire@gmail.com\",\"status\":\"active\",\"id\":12}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:38:19'),(518,7,12,NULL,NULL,'App\\Models\\User',12,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:44:52'),(519,8,NULL,NULL,NULL,'App\\Models\\Branch',12,'created',NULL,NULL,'{\"company_id\":8,\"name\":\"Boutique Centrale\",\"address\":\"Si\\u00e8ge Social\",\"phone\":\"+221 33 000 00 00\",\"id\":12}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:46:02'),(520,8,NULL,NULL,NULL,'App\\Models\\User',13,'created',NULL,NULL,'{\"company_id\":8,\"branch_id\":12,\"role_id\":2,\"name\":\"jayson smith\",\"email\":\"jaysonsmith@gmail.com\",\"status\":\"active\",\"id\":13}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:46:02'),(521,8,13,NULL,NULL,'App\\Models\\User',13,'login_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:46:34'),(522,8,13,NULL,NULL,'App\\Models\\User',13,'logout',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:48:24'),(523,5,8,NULL,NULL,'App\\Models\\User',8,'login_pin_success',NULL,NULL,'{\"device\":\"Mozilla\\/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko\\/20100101 Firefox\\/152.0\",\"status\":\"success\"}','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',NULL,'success','2026-07-22 10:49:51'),(524,1,NULL,NULL,NULL,'App\\Models\\User',4,'updated',NULL,'{\"password\":\"$2y$12$z60ybusTyjmSNNBkdC6lL.4qFpAFaYLsDO2HoygTXXFRiQdGrpb0u\"}','{\"password\":\"$2y$12$S1NmhklG8eITGDdZC4It1us36T7cQJR\\/ko0UY5EUXEhjLHliXR08O\"}','127.0.0.1','Symfony',NULL,'success','2026-07-22 15:34:08');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_products`
--

DROP TABLE IF EXISTS `branch_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `branch_products_branch_id_product_id_unique` (`branch_id`,`product_id`),
  KEY `branch_products_product_id_foreign` (`product_id`),
  CONSTRAINT `branch_products_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `branch_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_products`
--

LOCK TABLES `branch_products` WRITE;
/*!40000 ALTER TABLE `branch_products` DISABLE KEYS */;
INSERT INTO `branch_products` VALUES (1,1,1,46.00,'2026-07-10 09:28:39','2026-07-22 10:20:36'),(2,2,1,11.00,'2026-07-10 09:31:12','2026-07-22 10:20:59'),(3,1,3,2.00,'2026-07-22 09:00:28','2026-07-22 09:00:28'),(4,8,5,99.00,'2026-07-22 09:02:34','2026-07-22 09:02:55'),(5,6,5,0.00,'2026-07-22 09:03:06','2026-07-22 10:10:20'),(6,1,7,200.00,'2026-07-22 10:24:18','2026-07-22 10:24:18'),(7,6,7,550.00,'2026-07-22 10:26:43','2026-07-22 10:28:34');
/*!40000 ALTER TABLE `branch_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('store','warehouse') NOT NULL DEFAULT 'store',
  `is_warehouse` tinyint(1) NOT NULL DEFAULT 0,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('open','closed','maintenance','suspended','archived') NOT NULL DEFAULT 'open',
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branches_company_id_foreign` (`company_id`),
  CONSTRAINT `branches_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,1,'Boutique Centrale','store',0,'Dakar Plateau','+221338000000','open',NULL,'2026-07-09 12:36:22','2026-07-22 10:07:06',NULL),(2,1,'Boutique Rufisque','store',0,'Route de Rufisque, Rufisque','+221338991122','open',NULL,'2026-07-09 12:36:22','2026-07-09 12:36:22',NULL),(4,3,'Boutique Centrale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-20 07:57:47','2026-07-20 07:57:47',NULL),(5,4,'Boutique Principale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-20 08:07:38','2026-07-20 08:07:38',NULL),(6,5,'Boutique Centrale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-20 15:04:48','2026-07-20 15:04:48',NULL),(7,6,'Boutique Centrale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-21 15:52:04','2026-07-21 15:52:04',NULL),(8,5,'boutique bouake','store',0,'bouake kenedy','+225 0566289394','open',NULL,'2026-07-21 17:09:54','2026-07-22 10:08:43',NULL),(9,1,'Entrepôt Central Dakar','warehouse',1,NULL,NULL,'open',NULL,'2026-07-22 09:45:29','2026-07-22 09:45:29',NULL),(10,1,'Boutique Test Maintenance','store',0,NULL,NULL,'maintenance',NULL,'2026-07-22 09:45:30','2026-07-22 09:45:31','2026-07-22 09:45:31'),(11,7,'Boutique Centrale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-22 10:38:18','2026-07-22 10:38:18',NULL),(12,8,'Boutique Centrale','store',0,'Siège Social','+221 33 000 00 00','open',NULL,'2026-07-22 10:46:02','2026-07-22 10:46:02',NULL);
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba','i:1;',1784717451),('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer','i:1784717451;',1784717451);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_registers`
--

DROP TABLE IF EXISTS `cash_registers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_registers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cash_registers_company_id_foreign` (`company_id`),
  KEY `cash_registers_branch_id_foreign` (`branch_id`),
  CONSTRAINT `cash_registers_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cash_registers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_registers`
--

LOCK TABLES `cash_registers` WRITE;
/*!40000 ALTER TABLE `cash_registers` DISABLE KEYS */;
INSERT INTO `cash_registers` VALUES (1,1,1,'Caisse Principale N°1','POS-01','active','2026-07-22 09:45:31','2026-07-22 09:45:31');
/*!40000 ALTER TABLE `cash_registers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_session_transactions`
--

DROP TABLE IF EXISTS `cash_session_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_session_transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cash_session_id` bigint(20) unsigned NOT NULL,
  `type` enum('deposit','withdrawal') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cash_session_transactions_cash_session_id_foreign` (`cash_session_id`),
  CONSTRAINT `cash_session_transactions_cash_session_id_foreign` FOREIGN KEY (`cash_session_id`) REFERENCES `cash_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_session_transactions`
--

LOCK TABLES `cash_session_transactions` WRITE;
/*!40000 ALTER TABLE `cash_session_transactions` DISABLE KEYS */;
INSERT INTO `cash_session_transactions` VALUES (1,1,'deposit',20000.00,'dépot d emonnaie','2026-07-10 09:42:48','2026-07-10 09:42:48'),(2,1,'deposit',21240.00,'Vente VTE-000001 (cash)','2026-07-10 09:44:33','2026-07-10 09:44:33'),(3,1,'deposit',4130.00,'Vente VTE-000002 (geniuspay)','2026-07-10 09:49:07','2026-07-10 09:49:07'),(4,1,'deposit',4130.00,'Vente VTE-000003 (geniuspay)','2026-07-10 09:49:17','2026-07-10 09:49:17'),(5,1,'deposit',4130.00,'Vente VTE-000004 (card)','2026-07-10 09:49:36','2026-07-10 09:49:36'),(6,1,'deposit',3540.00,'Vente VTE-000005 (cash)','2026-07-10 10:00:27','2026-07-10 10:00:27'),(7,1,'deposit',217710.00,'Vente VTE-000006 (geniuspay)','2026-07-10 13:57:14','2026-07-10 13:57:14'),(8,1,'deposit',12390.00,'Vente VTE-000007 (geniuspay)','2026-07-10 14:23:38','2026-07-10 14:23:38'),(9,1,'deposit',2950.00,'Vente VTE-000008 (geniuspay)','2026-07-10 14:30:17','2026-07-10 14:30:17'),(10,1,'deposit',2950.00,'Vente VTE-000009 (geniuspay)','2026-07-10 14:34:09','2026-07-10 14:34:09'),(11,1,'deposit',2950.00,'Vente VTE-000010 (geniuspay)','2026-07-10 14:37:05','2026-07-10 14:37:05'),(12,3,'deposit',20000.00,'monnaie','2026-07-21 17:16:03','2026-07-21 17:16:03'),(13,3,'deposit',20000.00,'Monnaie','2026-07-21 17:16:22','2026-07-21 17:16:22'),(14,3,'deposit',2200.00,'Vente VTE-000001 (cash)','2026-07-21 17:28:24','2026-07-21 17:28:24'),(15,4,'deposit',10000.00,'monnaie','2026-07-22 10:09:38','2026-07-22 10:09:38'),(16,4,'deposit',2000.00,'Vente VTE-000002 (cash)','2026-07-22 10:10:20','2026-07-22 10:10:20');
/*!40000 ALTER TABLE `cash_session_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_sessions`
--

DROP TABLE IF EXISTS `cash_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `cash_register_id` bigint(20) unsigned DEFAULT NULL,
  `terminal_id` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `opening_balance` decimal(12,2) NOT NULL,
  `closing_balance` decimal(12,2) DEFAULT NULL,
  `theoretical_balance` decimal(12,2) DEFAULT NULL,
  `status` enum('open','closed','validated') NOT NULL DEFAULT 'open',
  `opened_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `closed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `validated_by` bigint(20) unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `validation_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cash_sessions_company_id_foreign` (`company_id`),
  KEY `cash_sessions_branch_id_foreign` (`branch_id`),
  KEY `cash_sessions_user_id_foreign` (`user_id`),
  KEY `cash_sessions_validated_by_foreign` (`validated_by`),
  KEY `cash_sessions_cash_register_id_foreign` (`cash_register_id`),
  CONSTRAINT `cash_sessions_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cash_sessions_cash_register_id_foreign` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cash_sessions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cash_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cash_sessions_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_sessions`
--

LOCK TABLES `cash_sessions` WRITE;
/*!40000 ALTER TABLE `cash_sessions` DISABLE KEYS */;
INSERT INTO `cash_sessions` VALUES (1,1,1,NULL,NULL,1,10000.00,NULL,NULL,'open','2026-07-10 09:42:27',NULL,NULL,NULL,NULL,NULL,'2026-07-10 09:42:27','2026-07-10 09:42:27'),(2,3,4,NULL,NULL,6,10000.00,NULL,NULL,'open','2026-07-21 15:25:46',NULL,NULL,NULL,NULL,NULL,'2026-07-21 15:25:46','2026-07-21 15:25:46'),(3,5,6,NULL,NULL,8,10000.00,52200.00,52200.00,'closed','2026-07-21 17:15:46','2026-07-21 17:44:26',NULL,NULL,NULL,NULL,'2026-07-21 17:15:46','2026-07-21 17:44:26'),(4,5,6,NULL,NULL,8,50000.00,NULL,NULL,'open','2026-07-22 10:09:23',NULL,NULL,NULL,NULL,NULL,'2026-07-22 10:09:23','2026-07-22 10:09:23');
/*!40000 ALTER TABLE `cash_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_company_id_slug_unique` (`company_id`,`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `categories_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,NULL,'Matériaux de construction','materiaux-de-construction',NULL,'2026-07-09 12:36:29','2026-07-09 12:36:29',NULL),(2,1,NULL,'Outillage','outillage',NULL,'2026-07-09 12:36:29','2026-07-09 12:36:29',NULL),(3,1,NULL,'habits','habits',NULL,'2026-07-09 13:07:41','2026-07-09 13:07:41',NULL),(6,1,NULL,'ménuiserie','menuiserie',NULL,'2026-07-10 08:59:24','2026-07-10 08:59:24',NULL),(7,5,NULL,'spays','spays','/storage/categories/0HzM7hrmOw1GbxymhF4u5cgQHmRF1rED9Cte64xj.png','2026-07-21 16:47:11','2026-07-21 16:47:11',NULL),(8,5,NULL,'plomberie','plomberie','/storage/categories/sGwHJoCmjP29lE9PaakbH9KlXJdpjKdhKVbZsQ0g.png','2026-07-22 10:18:22','2026-07-22 10:18:22',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `timezone` varchar(50) NOT NULL DEFAULT 'Africa/Dakar',
  `currency` varchar(10) NOT NULL DEFAULT 'XOF',
  `tax_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tax_settings`)),
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `subscription_plan` varchar(255) NOT NULL DEFAULT 'basic',
  `subscription_expires_at` timestamp NULL DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'DLS Corporation','C5J6-ZS9H','Africa/Dakar','XOF','{\"tax_rate\":18,\"enable_tax\":true}','active','premium','2026-08-09 10:50:18',NULL,'2026-07-09 12:36:22','2026-07-22 12:28:11'),(3,'premmar Boutiques','LLEQ-O7EZ','Africa/Dakar','XOF',NULL,'active','basic',NULL,NULL,'2026-07-20 07:57:47','2026-07-20 07:57:47'),(4,'Test Quincaillerie Express','8OUW-AXFY','Africa/Dakar','XOF',NULL,'active','basic',NULL,NULL,'2026-07-20 08:07:37','2026-07-20 08:07:37'),(5,'Librairie de France','MFQN-2RIX','Africa/Dakar','XOF','{\"tax_rate\":0,\"enable_tax\":false}','active','basic',NULL,NULL,'2026-07-20 15:04:48','2026-07-22 10:10:08'),(6,'shoppinglow','KFAL-G3OK','Africa/Dakar','XOF',NULL,'active','basic',NULL,NULL,'2026-07-21 15:52:04','2026-07-21 15:52:04'),(7,'Fruitfox','WC1P-CEME','Africa/Dakar','XOF',NULL,'active','basic',NULL,NULL,'2026-07-22 10:38:18','2026-07-22 10:38:18'),(8,'rivermontain','ZY8X-UIDI','Africa/Dakar','XOF',NULL,'active','basic',NULL,NULL,'2026-07-22 10:46:02','2026-07-22 10:46:02');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `credit_limit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `debt_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `loyalty_points` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_company_id_phone_unique` (`company_id`,`phone`),
  CONSTRAINT `customers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'grah','desirejeanivan@gmail.com','056628394','angre sjorobite 2',500000.00,0.00,273,'2026-07-10 09:16:48','2026-07-10 14:37:04',NULL),(2,5,'grah desire','desirejeanivangrah@gmail.com','O566289394','angre',500000.00,0.00,0,'2026-07-21 17:15:41','2026-07-21 17:15:41',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000001_create_cache_table',1),(2,'0001_01_01_000002_create_jobs_table',1),(3,'2026_07_08_165546_create_companies_table',1),(4,'2026_07_08_165547_create_branches_table',1),(5,'2026_07_08_172123_create_personal_access_tokens_table',1),(6,'2026_07_08_173000_create_roles_table',1),(7,'2026_07_08_173001_create_permissions_table',1),(8,'2026_07_08_173002_create_role_permission_table',1),(9,'2026_07_08_173005_create_users_table',1),(10,'2026_07_08_175252_create_categories_table',1),(11,'2026_07_08_175252_create_products_table',1),(12,'2026_07_08_175855_create_suppliers_table',1),(13,'2026_07_08_180441_create_purchases_table',1),(14,'2026_07_08_180442_create_branch_products_table',1),(15,'2026_07_08_180442_create_stock_movements_table',1),(16,'2026_07_08_180443_create_purchase_details_table',1),(17,'2026_07_08_180446_add_cost_price_to_products_table',1),(18,'2026_07_08_181351_create_stock_transfers_table',1),(19,'2026_07_08_181353_create_stock_transfer_details_table',1),(20,'2026_07_08_181831_create_cash_sessions_table',1),(21,'2026_07_08_181832_create_cash_session_transactions_table',1),(22,'2026_07_08_182217_create_sales_table',1),(23,'2026_07_08_182220_create_sale_details_table',1),(24,'2026_07_09_110654_create_audit_logs_table',1),(25,'2026_07_09_135200_create_customers_table',2),(26,'2026_07_09_135201_add_customer_id_to_sales_table',2),(27,'2026_07_09_161140_seed_super_admin_user',3),(28,'2026_07_09_173842_add_image_fields_to_tables',4),(29,'2026_07_10_104417_add_subscription_fields_to_companies_table',5),(30,'2026_07_21_143000_add_code_to_companies_table',6),(31,'2026_07_22_000001_create_user_branches_table',7),(32,'2026_07_22_000002_add_status_to_branches_table',7),(33,'2026_07_22_000003_create_cash_registers_table',7),(34,'2026_07_22_000004_add_register_and_terminal_to_cash_sessions_and_sales',7),(35,'2026_07_22_000005_enhance_audit_logs_table',7),(36,'2026_07_22_000006_update_stock_transfers_status_enum',7),(37,'2026_07_22_000007_create_user_branch_permissions_table',8),(38,'2026_07_22_000008_add_warehouse_softdeletes_settings_to_tables',8),(39,'2026_07_22_000009_create_notifications_table',8),(40,'2026_07_22_000010_create_system_error_logs_table',9);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_company_id_foreign` (`company_id`),
  KEY `notifications_branch_id_foreign` (`branch_id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,1,11,'low_stock','Alerte Stock Faible','Le stock de Ciment est passé sous le seuil d\'alerte.',NULL,NULL,'2026-07-22 09:45:32','2026-07-22 09:45:32'),(2,5,8,NULL,'transfer_shipped','Transfert de stock expédié','Un transfert de stock TRSF-1784715691-890 a été expédié vers votre boutique.',NULL,NULL,'2026-07-22 10:28:34','2026-07-22 10:28:34');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES ('admin@dls.com','725325','2026-07-20 08:14:08'),('desirejeanivangrah@gmail.com','342213','2026-07-20 08:47:30');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'Voir les produits','products.view','2026-07-09 12:36:23','2026-07-09 12:36:23'),(2,'Créer des produits','products.create','2026-07-09 12:36:23','2026-07-09 12:36:23'),(3,'Modifier des produits','products.update','2026-07-09 12:36:23','2026-07-09 12:36:23'),(4,'Supprimer des produits','products.delete','2026-07-09 12:36:23','2026-07-09 12:36:23'),(5,'Voir les ventes','sales.view','2026-07-09 12:36:23','2026-07-09 12:36:23'),(6,'Effectuer une vente','sales.create','2026-07-09 12:36:23','2026-07-09 12:36:23'),(7,'Appliquer une remise','sales.discount','2026-07-09 12:36:23','2026-07-09 12:36:23'),(8,'Annuler une vente','sales.cancel','2026-07-09 12:36:23','2026-07-09 12:36:23'),(9,'Gérer les sessions de caisse','cash-sessions.manage','2026-07-09 12:36:23','2026-07-09 12:36:23'),(10,'Voir les utilisateurs','users.view','2026-07-09 12:36:23','2026-07-09 12:36:23'),(11,'Créer des utilisateurs','users.create','2026-07-09 12:36:24','2026-07-09 12:36:24'),(12,'Modifier des utilisateurs','users.update','2026-07-09 12:36:24','2026-07-09 12:36:24'),(13,'Supprimer des utilisateurs','users.delete','2026-07-09 12:36:24','2026-07-09 12:36:24'),(14,'Voir les fournisseurs','suppliers.view','2026-07-09 12:36:24','2026-07-09 12:36:24'),(15,'Créer des fournisseurs','suppliers.create','2026-07-09 12:36:24','2026-07-09 12:36:24'),(16,'Modifier des fournisseurs','suppliers.update','2026-07-09 12:36:24','2026-07-09 12:36:24'),(17,'Supprimer des fournisseurs','suppliers.delete','2026-07-09 12:36:24','2026-07-09 12:36:24'),(18,'Voir les rapports financiers','reports.view','2026-07-09 12:36:24','2026-07-09 12:36:24'),(19,'Modifier les paramètres de l\'entreprise','settings.update','2026-07-09 12:36:24','2026-07-09 12:36:24');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (7,'App\\Models\\User',4,'test','03be040297276b84a836a29366ef70d2c9c4028b76daaa20cddb6f954ecc5cb1','[\"*\"]',NULL,NULL,'2026-07-10 08:57:05','2026-07-10 08:57:05'),(8,'App\\Models\\User',4,'test','38d163c62a9fee1a974a2e15b6244f4b05913d23858c9a67e229ddda517d2835','[\"*\"]','2026-07-10 08:58:28',NULL,'2026-07-10 08:58:28','2026-07-10 08:58:28'),(9,'App\\Models\\User',4,'test','5dc01dde9bb0a65d11d859e337b352ac4db81104b5aefd27e7fa085332892054','[\"*\"]','2026-07-10 09:39:35',NULL,'2026-07-10 09:39:35','2026-07-10 09:39:35'),(16,'App\\Models\\User',1,'pos-pin-token','957b4e5831d74fe631324b90e731801a1643ecfec050f33172648d05339ab756','[\"*\"]','2026-07-10 15:33:19',NULL,'2026-07-10 12:12:34','2026-07-10 15:33:19'),(17,'App\\Models\\User',4,'pos-auth-token','faef5ba5dfbf960fb1efe21b24f936725243fea8b7b8b29891b307e1a83c468f','[\"*\"]',NULL,NULL,'2026-07-20 07:44:36','2026-07-20 07:44:36'),(18,'App\\Models\\User',1,'pos-auth-token','d6978b54a12f61eefaeeee21e50e9838811ace036a353f8da7952017416dc451','[\"*\"]',NULL,NULL,'2026-07-20 07:44:47','2026-07-20 07:44:47'),(19,'App\\Models\\User',2,'pos-pin-token','c76c836b88b0eae8a209d73aa00c1ce53a22b929227b3c4cc63c62e82372944e','[\"*\"]',NULL,NULL,'2026-07-20 07:45:00','2026-07-20 07:45:00'),(21,'App\\Models\\User',1,'pos-pin-token','357861854392b9f0800d5abc65d288f95b6d4aef284dbade62863e899f1a7dd8','[\"*\"]','2026-07-20 07:57:47',NULL,'2026-07-20 07:55:27','2026-07-20 07:57:47'),(24,'App\\Models\\User',4,'pos-auth-token','133ea4c88b697f93d7f358311f28bd4dce521e20c91fce4826f68ce6bc233585','[\"*\"]','2026-07-20 09:03:26',NULL,'2026-07-20 09:03:22','2026-07-20 09:03:26'),(25,'App\\Models\\User',1,'pos-auth-token','479dce7a6afc37c8eef3d7f58286bb7f095b1d8e5895489103b2fe9a8079617f','[\"*\"]','2026-07-20 09:04:42',NULL,'2026-07-20 09:04:38','2026-07-20 09:04:42'),(27,'App\\Models\\User',8,'pos-auth-token','4d32c5133431e60a049d058ddecd5b5d1b0175193713d7b972ead63c7c66c0d3','[\"*\"]','2026-07-21 13:59:07',NULL,'2026-07-20 15:12:48','2026-07-21 13:59:07'),(28,'App\\Models\\User',1,'pos-auth-token','3ba4d86d0a812c38f24da9124a1499a4d18d872a358c5a5f31dc0d3dbf5b34d1','[\"*\"]','2026-07-21 13:50:06',NULL,'2026-07-21 13:50:05','2026-07-21 13:50:06'),(29,'App\\Models\\User',1,'pos-auth-token','fde370261ef9df5439eaa39823cd9baf40b711eaa625e8939d98a8122ff78eeb','[\"*\"]',NULL,NULL,'2026-07-21 13:50:06','2026-07-21 13:50:06'),(30,'App\\Models\\User',1,'pos-auth-token','60a2856398bd8c1a5e6645e64bf423ba0f636ef7a1aee2b2beb8da520d59ef67','[\"*\"]',NULL,NULL,'2026-07-21 13:50:10','2026-07-21 13:50:10'),(31,'App\\Models\\User',1,'pos-auth-token','f5698e30c83003c8e96a3e28ab0a006744045c835466e31c7720a45edecfe409','[\"*\"]',NULL,NULL,'2026-07-21 14:50:07','2026-07-21 14:50:07'),(32,'App\\Models\\User',1,'pos-auth-token','ddc01ef16c0a11680bebc363e893b1f2d8650adfa908c51bfc84786bb21b0f14','[\"*\"]',NULL,NULL,'2026-07-21 14:57:36','2026-07-21 14:57:36'),(33,'App\\Models\\User',6,'pos-auth-token','ca3f396208e43c5aa9f52ca4c7942c78d9b36aa2d53c7c102758c5ae5ca0faae','[\"*\"]',NULL,NULL,'2026-07-21 15:03:08','2026-07-21 15:03:08'),(35,'App\\Models\\User',6,'pos-auth-token','dcb59bc991da4cf81038bf4c0ff5b2f64478334b46985f2dd7d7310cd57db154','[\"*\"]','2026-07-21 15:14:51',NULL,'2026-07-21 15:14:50','2026-07-21 15:14:51'),(36,'App\\Models\\User',6,'pos-auth-token','ac7c29344db20fcf33eb2b855283765c160fef328a86526934659dcda4656be6','[\"*\"]','2026-07-21 15:20:48',NULL,'2026-07-21 15:20:48','2026-07-21 15:20:48'),(37,'App\\Models\\User',6,'pos-auth-token','6af7a4630123c0ed38bf15b2a037365e7f167c6cc30af85fd07bfb4dc74d99c0','[\"*\"]','2026-07-21 15:21:10',NULL,'2026-07-21 15:21:10','2026-07-21 15:21:10'),(38,'App\\Models\\User',6,'pos-auth-token','287651230195ab02e33c90618a2d31190b96ef86d097ca1cbe18f2b8e853e20c','[\"*\"]','2026-07-21 15:21:40',NULL,'2026-07-21 15:21:40','2026-07-21 15:21:40'),(39,'App\\Models\\User',6,'pos-auth-token','94c5f6e62ab4537fc0a0473a2615397a49e00dffcdaeaf2db006fa458b72cd8d','[\"*\"]','2026-07-21 15:22:00',NULL,'2026-07-21 15:22:00','2026-07-21 15:22:00'),(40,'App\\Models\\User',6,'pos-auth-token','7efc36989b50c29cc6880625ad6783ffde44ee1ba3c565c1d09709fff0d85276','[\"*\"]','2026-07-21 15:22:24',NULL,'2026-07-21 15:22:24','2026-07-21 15:22:24'),(41,'App\\Models\\User',6,'pos-auth-token','1fbe830e2c3edcbcb2be38a7491bde8f867c2163a4fe75c8bee8969a1f5aa704','[\"*\"]','2026-07-21 15:23:34',NULL,'2026-07-21 15:23:34','2026-07-21 15:23:34'),(47,'App\\Models\\User',1,'pos-auth-token','7f825fa80cd9c6fbe3ca42a056019e2d0b0686efb4c520a4f69491970deb88ee','[\"*\"]',NULL,NULL,'2026-07-21 16:09:23','2026-07-21 16:09:23'),(49,'App\\Models\\User',8,'pos-auth-token','d8bdabeb65a1abfb402b02c947c27b3a6421cb6123beb3b5485ce237d67cc520','[\"*\"]','2026-07-22 09:46:02',NULL,'2026-07-21 16:15:43','2026-07-22 09:46:02'),(50,'App\\Models\\User',6,'pos-auth-token','4d5a5012825fc733d1baf4902f6880235bd313fef937b79b8f02609405007aae','[\"*\"]','2026-07-21 16:55:22',NULL,'2026-07-21 16:55:22','2026-07-21 16:55:22'),(51,'App\\Models\\User',8,'pos-auth-token','0f1ae28ccbf4c02503da1d9f914c70c0fb007ce14a79c428138ffc3961844b5f','[\"*\"]','2026-07-22 10:38:18',NULL,'2026-07-22 10:02:20','2026-07-22 10:38:18'),(53,'App\\Models\\User',13,'pos-auth-token','683d95c17117ff75d4224c9eb6f4c97c52f4884ad2577e154085ee02c950a319','[\"*\"]',NULL,NULL,'2026-07-22 10:46:02','2026-07-22 10:46:02'),(55,'App\\Models\\User',8,'pos-auth-token','3774c51121b5a6bd350756fa6817a977d26cbc580e637c267f30b363de301c23','[\"*\"]','2026-07-22 10:53:38',NULL,'2026-07-22 10:49:51','2026-07-22 10:53:38');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `selling_price` decimal(15,2) NOT NULL,
  `cost_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 18.00,
  `alert_quantity` decimal(10,2) NOT NULL DEFAULT 10.00,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_company_id_sku_unique` (`company_id`,`sku`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'Ciment SOCOCIM 50kg','CIM-SOCO-50','3700021300051','Sac de ciment de haute résistance 50kg',3500.00,30000.00,18.00,10.00,'active',NULL,'2026-07-09 12:36:30','2026-07-10 09:28:38',NULL),(2,1,2,'Marteau arrache-clous','MART-ARR-CLO','3700021300068','Marteau arrache-clous en acier trempé',2500.00,0.00,18.00,5.00,'active',NULL,'2026-07-09 12:36:30','2026-07-09 12:36:30',NULL),(3,1,1,'Brouette Standard','BROU-STD','3700021300075','Brouette de chantier renforcée 80L',15000.00,1000.00,18.00,2.00,'active',NULL,'2026-07-09 12:36:30','2026-07-22 09:00:28',NULL),(4,1,3,'pantalon','SKU-XYZ',NULL,NULL,3000.00,0.00,18.00,10.00,'active',NULL,'2026-07-10 09:14:26','2026-07-10 09:14:26',NULL),(5,5,7,'spray','sku-ure-123','dsqzefg',NULL,2000.00,1200.00,18.00,10.00,'active','/storage/products/qhj77uESwYuOnWUMYWE2UjdyMujPdlUz2Zcv31Lk.png','2026-07-21 16:47:43','2026-07-22 09:02:34',NULL),(7,5,8,'robinet','TY6-FDRE-GEDFE','VDVDDFVcsfs',NULL,5000.00,1428.57,18.00,200.00,'active','/storage/products/TDsVDphVx8XvwOH7yKaQRbj2c5WV2fSwS6dP8qgq.png','2026-07-22 10:19:37','2026-07-22 10:26:43',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_details`
--

DROP TABLE IF EXISTS `purchase_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `quantity_received` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cost_price` decimal(15,2) NOT NULL,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 18.00,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_details_purchase_id_foreign` (`purchase_id`),
  KEY `purchase_details_product_id_foreign` (`product_id`),
  CONSTRAINT `purchase_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_details_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_details`
--

LOCK TABLES `purchase_details` WRITE;
/*!40000 ALTER TABLE `purchase_details` DISABLE KEYS */;
INSERT INTO `purchase_details` VALUES (1,1,1,20.00,20.00,30000.00,18.00,108000.00,708000.00,'2026-07-10 09:19:26','2026-07-10 09:28:38'),(2,2,3,2.00,2.00,1000.00,18.00,360.00,2360.00,'2026-07-22 09:00:28','2026-07-22 09:00:28'),(3,3,5,100.00,100.00,1200.00,0.00,0.00,120000.00,'2026-07-22 09:02:24','2026-07-22 09:02:34'),(4,4,7,500.00,500.00,2000.00,2.00,20000.00,1020000.00,'2026-07-22 10:26:43','2026-07-22 10:26:43');
/*!40000 ALTER TABLE `purchase_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `supplier_id` bigint(20) unsigned NOT NULL,
  `purchase_number` varchar(50) NOT NULL,
  `status` enum('draft','ordered','received','cancelled') NOT NULL DEFAULT 'draft',
  `payment_status` enum('unpaid','partially_paid','paid') NOT NULL DEFAULT 'unpaid',
  `subtotal` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `amount_paid` decimal(15,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchases_company_id_purchase_number_unique` (`company_id`,`purchase_number`),
  KEY `purchases_branch_id_foreign` (`branch_id`),
  KEY `purchases_supplier_id_foreign` (`supplier_id`),
  CONSTRAINT `purchases_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchases_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (1,1,1,4,'BON-ACH-1783675166-604','received','partially_paid',600000.00,108000.00,708000.00,1000.00,'Achat vérifié et mis à jour.','2026-07-10 09:19:26','2026-07-22 10:29:47'),(2,1,1,1,'BON-ACH-1784710828-893','received','partially_paid',2000.00,360.00,2360.00,5000.00,'Test approvisionnement automatique','2026-07-22 09:00:28','2026-07-22 09:00:28'),(3,5,8,5,'BON-ACH-1784710944-993','received','paid',120000.00,0.00,120000.00,0.00,NULL,'2026-07-22 09:02:24','2026-07-22 09:02:34'),(4,5,6,5,'BON-ACH-1784716003-300','received','paid',1000000.00,20000.00,1020000.00,1020000.00,NULL,'2026-07-22 10:26:43','2026-07-22 10:36:36');
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `role_permission_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` VALUES (2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(3,1),(3,2),(3,3),(3,5),(3,6),(3,7),(3,9),(3,10),(3,14),(3,15),(3,16),(3,17),(4,1),(4,5),(4,6),(4,14),(5,5),(5,14),(5,18);
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_company_id_slug_unique` (`company_id`,`slug`),
  CONSTRAINT `roles_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,NULL,'Super-Administrateur SaaS','super-admin','2026-07-09 12:36:24','2026-07-09 12:36:24'),(2,1,'Administrateur Entreprise','admin','2026-07-09 12:36:24','2026-07-09 12:36:24'),(3,1,'Gérant de Boutique','gerant','2026-07-09 12:36:24','2026-07-09 12:36:24'),(4,1,'Caissier','caissier','2026-07-09 12:36:24','2026-07-09 12:36:24'),(5,1,'Comptable','comptable','2026-07-09 12:36:24','2026-07-09 12:36:24'),(6,4,'Administrateur Entreprise','admin','2026-07-20 08:07:38','2026-07-20 08:07:38');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_details`
--

DROP TABLE IF EXISTS `sale_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sale_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `selling_price` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_details_sale_id_foreign` (`sale_id`),
  KEY `sale_details_product_id_foreign` (`product_id`),
  CONSTRAINT `sale_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sale_details_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_details`
--

LOCK TABLES `sale_details` WRITE;
/*!40000 ALTER TABLE `sale_details` DISABLE KEYS */;
INSERT INTO `sale_details` VALUES (1,1,4,6.00,3000.00,0.00,3240.00,21240.00,'2026-07-10 09:44:32','2026-07-10 09:44:32'),(2,2,1,1.00,3500.00,0.00,630.00,4130.00,'2026-07-10 09:49:07','2026-07-10 09:49:07'),(3,3,1,1.00,3500.00,0.00,630.00,4130.00,'2026-07-10 09:49:17','2026-07-10 09:49:17'),(4,4,1,1.00,3500.00,0.00,630.00,4130.00,'2026-07-10 09:49:36','2026-07-10 09:49:36'),(5,5,4,1.00,3000.00,0.00,540.00,3540.00,'2026-07-10 10:00:26','2026-07-10 10:00:26'),(6,6,2,1.00,2500.00,0.00,450.00,2950.00,'2026-07-10 13:57:13','2026-07-10 13:57:13'),(7,6,1,4.00,3500.00,0.00,2520.00,16520.00,'2026-07-10 13:57:14','2026-07-10 13:57:14'),(8,6,3,11.00,15000.00,0.00,29700.00,194700.00,'2026-07-10 13:57:14','2026-07-10 13:57:14'),(9,6,4,1.00,3000.00,0.00,540.00,3540.00,'2026-07-10 13:57:14','2026-07-10 13:57:14'),(10,7,1,3.00,3500.00,0.00,1890.00,12390.00,'2026-07-10 14:23:38','2026-07-10 14:23:38'),(11,8,2,1.00,2500.00,0.00,450.00,2950.00,'2026-07-10 14:30:17','2026-07-10 14:30:17'),(12,9,2,1.00,2500.00,0.00,450.00,2950.00,'2026-07-10 14:34:09','2026-07-10 14:34:09'),(13,10,2,1.00,2500.00,0.00,450.00,2950.00,'2026-07-10 14:37:04','2026-07-10 14:37:04'),(14,11,5,1.00,2000.00,0.00,200.00,2200.00,'2026-07-21 17:28:24','2026-07-21 17:28:24'),(15,12,5,1.00,2000.00,0.00,0.00,2000.00,'2026-07-22 10:10:20','2026-07-22 10:10:20');
/*!40000 ALTER TABLE `sale_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `cash_register_id` bigint(20) unsigned DEFAULT NULL,
  `terminal_id` varchar(100) DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `cash_session_id` bigint(20) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned DEFAULT NULL,
  `sale_number` varchar(50) NOT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `client_phone` varchar(255) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `payment_method` varchar(30) NOT NULL,
  `payment_status` varchar(30) NOT NULL DEFAULT 'paid',
  `amount_received` decimal(12,2) DEFAULT NULL,
  `amount_change` decimal(12,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `geniuspay_transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_company_id_sale_number_unique` (`company_id`,`sale_number`),
  KEY `sales_branch_id_foreign` (`branch_id`),
  KEY `sales_user_id_foreign` (`user_id`),
  KEY `sales_cash_session_id_foreign` (`cash_session_id`),
  KEY `sales_customer_id_foreign` (`customer_id`),
  KEY `sales_cash_register_id_foreign` (`cash_register_id`),
  CONSTRAINT `sales_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_cash_register_id_foreign` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_cash_session_id_foreign` FOREIGN KEY (`cash_session_id`) REFERENCES `cash_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,1,1,NULL,NULL,1,1,1,'VTE-000001','grah','056628394',18000.00,0.00,3240.00,21240.00,'cash','paid',200000.00,178760.00,NULL,NULL,'2026-07-10 09:44:32','2026-07-10 09:44:32'),(2,1,1,NULL,NULL,1,1,1,'VTE-000002','grah','056628394',3500.00,0.00,630.00,4130.00,'geniuspay','paid',4130.00,0.00,NULL,NULL,'2026-07-10 09:49:07','2026-07-10 09:49:07'),(3,1,1,NULL,NULL,1,1,1,'VTE-000003','grah','056628394',3500.00,0.00,630.00,4130.00,'geniuspay','paid',4130.00,0.00,NULL,NULL,'2026-07-10 09:49:16','2026-07-10 09:49:16'),(4,1,1,NULL,NULL,1,1,1,'VTE-000004','grah','056628394',3500.00,0.00,630.00,4130.00,'card','paid',4130.00,0.00,NULL,NULL,'2026-07-10 09:49:35','2026-07-10 09:49:35'),(5,1,1,NULL,NULL,1,1,1,'VTE-000005','grah','056628394',3000.00,0.00,540.00,3540.00,'cash','paid',20000.00,16460.00,NULL,NULL,'2026-07-10 10:00:26','2026-07-10 10:00:26'),(6,1,1,NULL,NULL,1,1,1,'VTE-000006','grah','056628394',184500.00,0.00,33210.00,217710.00,'geniuspay','paid',217710.00,0.00,NULL,NULL,'2026-07-10 13:57:13','2026-07-10 13:57:13'),(7,1,1,NULL,NULL,1,1,1,'VTE-000007','grah','056628394',10500.00,0.00,1890.00,12390.00,'geniuspay','paid',12390.00,0.00,NULL,NULL,'2026-07-10 14:23:38','2026-07-10 14:23:38'),(8,1,1,NULL,NULL,1,1,1,'VTE-000008','grah','056628394',2500.00,0.00,450.00,2950.00,'geniuspay','paid',2950.00,0.00,NULL,NULL,'2026-07-10 14:30:16','2026-07-10 14:30:16'),(9,1,1,NULL,NULL,1,1,1,'VTE-000009','grah','056628394',2500.00,0.00,450.00,2950.00,'geniuspay','paid',2950.00,0.00,NULL,NULL,'2026-07-10 14:34:09','2026-07-10 14:34:09'),(10,1,1,NULL,NULL,1,1,1,'VTE-000010','grah','056628394',2500.00,0.00,450.00,2950.00,'geniuspay','paid',2950.00,0.00,NULL,NULL,'2026-07-10 14:37:04','2026-07-10 14:37:04'),(11,5,6,NULL,NULL,8,3,NULL,'VTE-000001','Client Comptant',NULL,2000.00,0.00,200.00,2200.00,'cash','paid',5000.00,2800.00,NULL,NULL,'2026-07-21 17:28:24','2026-07-21 17:28:24'),(12,5,6,NULL,NULL,8,4,NULL,'VTE-000002','Client Comptant',NULL,2000.00,0.00,0.00,2000.00,'cash','paid',2000.00,0.00,NULL,NULL,'2026-07-22 10:10:20','2026-07-22 10:10:20');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('BLoOble91KrOFVHANSkDz4gAwCoTiQjVqYPdrdQr',NULL,NULL,'','eyJfdG9rZW4iOiJZbHVlNmZVMnJ1QVBFN2V6OVFwS1RqNWNvNUtIaTM4Mkw2UWw3SWNEIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzoiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784641750);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `type` enum('purchase','sale','adjustment','transfer') NOT NULL,
  `reference_id` bigint(20) unsigned DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_movements_company_id_foreign` (`company_id`),
  KEY `stock_movements_branch_id_foreign` (`branch_id`),
  KEY `stock_movements_product_id_foreign` (`product_id`),
  CONSTRAINT `stock_movements_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_movements_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_movements_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
INSERT INTO `stock_movements` VALUES (1,1,1,1,20.00,'purchase',1,'Réception achat Bon #1','2026-07-10 09:28:39','2026-07-10 09:28:39'),(2,1,1,1,-1.00,'transfer',2,'Sortie transfert inter-boutique #2','2026-07-10 09:30:36','2026-07-10 09:30:36'),(3,1,2,1,1.00,'transfer',2,'Entrée transfert inter-boutique #2','2026-07-10 09:31:12','2026-07-10 09:31:12'),(4,1,1,1,-1.00,'transfer',1,'Sortie transfert inter-boutique #1','2026-07-10 09:36:51','2026-07-10 09:36:51'),(5,1,1,4,-6.00,'sale',NULL,'Vente VTE-000001 par Administrateur DLS','2026-07-10 09:44:32','2026-07-10 09:44:32'),(6,1,1,1,-1.00,'sale',NULL,'Vente VTE-000002 par Administrateur DLS','2026-07-10 09:49:07','2026-07-10 09:49:07'),(7,1,1,1,-1.00,'sale',NULL,'Vente VTE-000003 par Administrateur DLS','2026-07-10 09:49:17','2026-07-10 09:49:17'),(8,1,1,1,-1.00,'sale',NULL,'Vente VTE-000004 par Administrateur DLS','2026-07-10 09:49:36','2026-07-10 09:49:36'),(9,1,1,4,-1.00,'sale',NULL,'Vente VTE-000005 par Administrateur DLS','2026-07-10 10:00:27','2026-07-10 10:00:27'),(10,1,1,2,-1.00,'sale',NULL,'Vente VTE-000006 par Administrateur DLS','2026-07-10 13:57:14','2026-07-10 13:57:14'),(11,1,1,1,-4.00,'sale',NULL,'Vente VTE-000006 par Administrateur DLS','2026-07-10 13:57:14','2026-07-10 13:57:14'),(12,1,1,3,-11.00,'sale',NULL,'Vente VTE-000006 par Administrateur DLS','2026-07-10 13:57:14','2026-07-10 13:57:14'),(13,1,1,4,-1.00,'sale',NULL,'Vente VTE-000006 par Administrateur DLS','2026-07-10 13:57:14','2026-07-10 13:57:14'),(14,1,1,1,-3.00,'sale',NULL,'Vente VTE-000007 par Administrateur DLS','2026-07-10 14:23:38','2026-07-10 14:23:38'),(15,1,1,2,-1.00,'sale',NULL,'Vente VTE-000008 par Administrateur DLS','2026-07-10 14:30:17','2026-07-10 14:30:17'),(16,1,1,2,-1.00,'sale',NULL,'Vente VTE-000009 par Administrateur DLS','2026-07-10 14:34:09','2026-07-10 14:34:09'),(17,1,1,2,-1.00,'sale',NULL,'Vente VTE-000010 par Administrateur DLS','2026-07-10 14:37:05','2026-07-10 14:37:05'),(18,1,1,1,5.00,'adjustment',NULL,'Inventaire correctif','2026-07-10 15:31:56','2026-07-10 15:31:56'),(19,5,6,5,-1.00,'sale',NULL,'Vente VTE-000001 par BAGUI RODRIGUE','2026-07-21 17:28:24','2026-07-21 17:28:24'),(20,5,1,1,10.00,'adjustment',NULL,'ajustements','2026-07-21 21:37:34','2026-07-21 21:37:34'),(21,1,1,3,2.00,'purchase',2,'Réception achat Bon #2','2026-07-22 09:00:28','2026-07-22 09:00:28'),(22,5,8,5,100.00,'purchase',3,'Réception achat Bon #3','2026-07-22 09:02:34','2026-07-22 09:02:34'),(23,5,8,5,-1.00,'transfer',4,'Sortie transfert inter-boutique #4','2026-07-22 09:02:55','2026-07-22 09:02:55'),(24,5,6,5,1.00,'transfer',4,'Entrée transfert inter-boutique #4','2026-07-22 09:03:06','2026-07-22 09:03:06'),(25,5,6,5,-1.00,'sale',12,'Vente VTE-000002 par BAGUI RODRIGUE','2026-07-22 10:10:20','2026-07-22 10:10:20'),(26,5,1,1,23.00,'adjustment',NULL,'ajustements','2026-07-22 10:20:36','2026-07-22 10:20:36'),(27,5,2,1,10.00,'adjustment',NULL,'correctif','2026-07-22 10:20:59','2026-07-22 10:20:59'),(28,5,6,7,500.00,'purchase',4,'Réception achat Bon #4','2026-07-22 10:26:43','2026-07-22 10:26:43'),(29,5,6,7,100.00,'adjustment',NULL,'ajout','2026-07-22 10:28:16','2026-07-22 10:28:16'),(30,5,6,7,-50.00,'transfer',6,'Sortie transfert inter-boutique #6','2026-07-22 10:28:34','2026-07-22 10:28:34');
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_transfer_details`
--

DROP TABLE IF EXISTS `stock_transfer_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transfer_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `stock_transfer_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_transfer_details_stock_transfer_id_foreign` (`stock_transfer_id`),
  KEY `stock_transfer_details_product_id_foreign` (`product_id`),
  CONSTRAINT `stock_transfer_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_transfer_details_stock_transfer_id_foreign` FOREIGN KEY (`stock_transfer_id`) REFERENCES `stock_transfers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transfer_details`
--

LOCK TABLES `stock_transfer_details` WRITE;
/*!40000 ALTER TABLE `stock_transfer_details` DISABLE KEYS */;
INSERT INTO `stock_transfer_details` VALUES (1,1,1,1.00,'2026-07-09 18:24:42','2026-07-09 18:24:42'),(2,2,1,1.00,'2026-07-09 18:24:43','2026-07-09 18:24:43'),(3,3,2,50.00,'2026-07-10 09:29:17','2026-07-10 09:29:17'),(4,3,3,80.00,'2026-07-10 09:29:17','2026-07-10 09:29:17'),(5,4,5,1.00,'2026-07-21 17:45:17','2026-07-21 17:45:17'),(6,5,3,5.00,'2026-07-22 09:45:32','2026-07-22 09:45:32'),(7,6,7,50.00,'2026-07-22 10:21:31','2026-07-22 10:21:31');
/*!40000 ALTER TABLE `stock_transfer_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_transfers`
--

DROP TABLE IF EXISTS `stock_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transfers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `from_branch_id` bigint(20) unsigned NOT NULL,
  `to_branch_id` bigint(20) unsigned NOT NULL,
  `transfer_number` varchar(50) NOT NULL,
  `status` enum('draft','pending_approval','approved','shipped','received','rejected','cancelled','pending','transit','completed') DEFAULT 'draft',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stock_transfers_company_id_transfer_number_unique` (`company_id`,`transfer_number`),
  KEY `stock_transfers_from_branch_id_foreign` (`from_branch_id`),
  KEY `stock_transfers_to_branch_id_foreign` (`to_branch_id`),
  CONSTRAINT `stock_transfers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_transfers_from_branch_id_foreign` FOREIGN KEY (`from_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_transfers_to_branch_id_foreign` FOREIGN KEY (`to_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transfers`
--

LOCK TABLES `stock_transfers` WRITE;
/*!40000 ALTER TABLE `stock_transfers` DISABLE KEYS */;
INSERT INTO `stock_transfers` VALUES (1,1,1,2,'TRSF-1783621481-440','transit',NULL,'2026-07-09 18:24:41','2026-07-10 09:36:51'),(2,1,1,2,'TRSF-1783621483-118','completed',NULL,'2026-07-09 18:24:43','2026-07-10 09:31:12'),(3,1,1,2,'TRSF-1783675757-959','pending',NULL,'2026-07-10 09:29:17','2026-07-10 09:29:17'),(4,5,8,6,'TRSF-1784655917-300','completed',NULL,'2026-07-21 17:45:17','2026-07-22 09:03:06'),(5,1,9,1,'TRSF-TEST-1784713532','received',NULL,'2026-07-22 09:45:32','2026-07-22 09:45:33'),(6,5,6,8,'TRSF-1784715691-890','shipped',NULL,'2026-07-22 10:21:31','2026-07-22 10:28:34');
/*!40000 ALTER TABLE `stock_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `debt_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_company_id_name_unique` (`company_id`,`name`),
  CONSTRAINT `suppliers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,1,'Quincaillerie Al-Azhar','contact.fournisseur@test.com','+221 77 000 11 22','Avenue Blaise Diagne, Dakar',150000.00,'2026-07-09 12:36:30','2026-07-22 10:29:47',NULL),(2,1,'Sénégal Matériaux','sales@senegalmateriaux.com','+221 33 897 12 34','Zone Industrielle de Hann, Dakar',0.00,'2026-07-09 12:36:30','2026-07-09 12:36:30',NULL),(3,1,'Test Fournisseur 123','test@test.com','123456789','Dakar',0.00,'2026-07-09 13:03:37','2026-07-09 13:03:37',NULL),(4,1,'sékou','desirejeani@gmail.com','0566289394','abobo',707000.00,'2026-07-10 09:15:43','2026-07-22 10:29:47',NULL),(5,5,'Moussa Sanogo','moussa@gmail.com','+225076193753','Abobo',-1020000.00,'2026-07-21 21:35:42','2026-07-22 10:36:23',NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_error_logs`
--

DROP TABLE IF EXISTS `system_error_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_error_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned DEFAULT NULL,
  `branch_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  `error_message` text NOT NULL,
  `stack_trace` longtext DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `system_error_logs_company_id_foreign` (`company_id`),
  KEY `system_error_logs_branch_id_foreign` (`branch_id`),
  KEY `system_error_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `system_error_logs_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `system_error_logs_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `system_error_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_error_logs`
--

LOCK TABLES `system_error_logs` WRITE;
/*!40000 ALTER TABLE `system_error_logs` DISABLE KEYS */;
INSERT INTO `system_error_logs` VALUES (1,1,1,4,'QualificationTest','Test d\'erreur système capturée avec succès.','Trace exemple à la ligne 45','127.0.0.1','ApexPOS Qualification Engine','Desktop','2026-07-22 09:56:26','2026-07-22 09:56:26'),(2,1,1,4,'QualificationTest','Test d\'erreur système capturée avec succès.','Trace exemple à la ligne 45','127.0.0.1','ApexPOS Qualification Engine','Desktop','2026-07-22 09:56:54','2026-07-22 09:56:54'),(3,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:35 where `id` = 8)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:35','2026-07-22 10:02:35'),(4,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:39 where `id` = 8)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:39','2026-07-22 10:02:39'),(5,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:41 where `id` = 8)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:41','2026-07-22 10:02:41'),(6,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:41 where `id` = 8)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:41','2026-07-22 10:02:41'),(7,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:42 where `id` = 6)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:42','2026-07-22 10:02:42'),(8,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:42 where `id` = 6)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:42','2026-07-22 10:02:42'),(9,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:02:43 where `id` = 6)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:02:43','2026-07-22 10:02:43'),(10,5,6,8,'QueryException','SQLSTATE[01000]: Warning: 1265 Data truncated for column \'status\' at row 1 (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: quincaillerie_pos, SQL: update `branches` set `status` = active, `branches`.`updated_at` = 2026-07-22 10:04:11 where `id` = 8)','#0 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(813): Illuminate\\Database\\Connection->runQueryCallback()\n#1 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(614): Illuminate\\Database\\Connection->run()\n#2 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Connection.php(566): Illuminate\\Database\\Connection->affectingStatement()\n#3 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php(4321): Illuminate\\Database\\Connection->update()\n#4 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Builder.php(1272): Illuminate\\Database\\Query\\Builder->update()\n#5 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1493): Illuminate\\Database\\Eloquent\\Builder->update()\n#6 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1375): Illuminate\\Database\\Eloquent\\Model->performUpdate()\n#7 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php(1162): Illuminate\\Database\\Eloquent\\Model->save()\n#8 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Controllers/API/V1/BranchController.php(79): Illuminate\\Database\\Eloquent\\Model->update()\n#9 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php(46): App\\Http\\Controllers\\API\\V1\\BranchController->toggleStatus()\n#10 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(275): Illuminate\\Routing\\ControllerDispatcher->dispatch()\n#11 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Route.php(215): Illuminate\\Routing\\Route->runController()\n#12 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Routing/Router.php(822): Illuminate\\Routing\\Route->run()\n#13 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(180): Illuminate\\Routing\\Router->{closure:Illuminate\\Routing\\Router::runRouteWithinStack():821}()\n#14 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/CheckRoleMiddleware.php(43): Illuminate\\Pipeline\\Pipeline->{closure:Illuminate\\Pipeline\\Pipeline::prepareDestination():178}()\n#15 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(219): App\\Http\\Middleware\\CheckRoleMiddleware->handle()\n#16 /opt/lampp/htdocs/point_de_vente/laravel-pos-api/app/Http/Middleware/TenantScopeMiddleware.php(156): Illuminate\\Pipeline\\Pipeline->{closure:{closure:Illuminate\\Pipeline\\Pipeline::carry():194}:195}()\n#17 /opt/lampp/htdocs/p','127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0','Web Client','2026-07-22 10:04:11','2026-07-22 10:04:11');
/*!40000 ALTER TABLE `system_error_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_branch_permissions`
--

DROP TABLE IF EXISTS `user_branch_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_branch_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ubp_user_branch_perm_unique` (`user_id`,`branch_id`,`permission_id`),
  KEY `user_branch_permissions_branch_id_foreign` (`branch_id`),
  KEY `user_branch_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `user_branch_permissions_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_branch_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_branch_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_branch_permissions`
--

LOCK TABLES `user_branch_permissions` WRITE;
/*!40000 ALTER TABLE `user_branch_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_branch_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_branches`
--

DROP TABLE IF EXISTS `user_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_branches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Override permissions for this specific branch' CHECK (json_valid(`permissions`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_branches_user_id_branch_id_unique` (`user_id`,`branch_id`),
  KEY `user_branches_branch_id_foreign` (`branch_id`),
  CONSTRAINT `user_branches_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_branches_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_branches`
--

LOCK TABLES `user_branches` WRITE;
/*!40000 ALTER TABLE `user_branches` DISABLE KEYS */;
INSERT INTO `user_branches` VALUES (1,11,1,NULL,'2026-07-22 09:45:30','2026-07-22 09:45:30'),(2,11,9,NULL,'2026-07-22 09:45:30','2026-07-22 09:45:30');
/*!40000 ALTER TABLE `user_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) unsigned DEFAULT NULL,
  `branch_id` bigint(20) unsigned DEFAULT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `pin_code` varchar(60) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_company_id_foreign` (`company_id`),
  KEY `users_branch_id_foreign` (`branch_id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,1,2,'Administrateur DLS','admin@dls.com',NULL,'$2y$12$Z4SGMp9MpbxLtuO9P7G3q.lq799fZTSybAiQL3P4SRdpR4r.K4FOC','$2y$12$6l.9UIRzyX2w972XIS3DTOXmrj9CBlJNAwdjHKc7XN6S0y5zfjhcm','active',NULL,'2026-07-09 12:36:28','2026-07-21 14:57:16',NULL),(2,1,1,4,'Caissier DLS','caissier@dls.com',NULL,'$2y$12$buxyDhurG6othKoXHFd.Gu9EA7F1XAtRoa1/5nROjtQQOqIG9Rl5u','$2y$12$3bur8ZUDLFPhRGMS3W0L.OdPxL4oaxGGQBTYH.vL/cLkJvbuULbJ2','active',NULL,'2026-07-09 12:36:29','2026-07-21 14:57:17',NULL),(3,1,1,3,'Gérant DLS','gerant@dls.com',NULL,'$2y$12$eiER2hHC7vLmVsDT4NJnW.7utMeDu.7QQtAiOfmwuzcFwhu8RB87W','$2y$12$4T1dIHng.xq8EEhZa.OE7.VP3rRJ4upqspRWqRA1LgQR4yg/XUijC','active',NULL,'2026-07-09 12:36:29','2026-07-21 14:57:17',NULL),(4,1,NULL,1,'Super Administrateur Global','superadmin@dls.com',NULL,'$2y$12$S1NmhklG8eITGDdZC4It1us36T7cQJR/ko0UY5EUXEhjLHliXR08O','$2y$12$05Pj1glUDNiZw8kTvLoMuOcL8.Md1IOL.M83PBXZNpi24SOKIJjme','active',NULL,'2026-07-09 16:11:51','2026-07-22 15:34:08',NULL),(6,3,4,2,'grah desire','desirejeanivangrah@gmail.com',NULL,'$2y$12$jyaSFRzF36X6fR0b6rkyRejphE4YMPV6T9STXSp8JTIohWpzasL0i','$2y$12$QoBLfJyzW1RiM8k8NcDGO.cOSa1/G/sbysS.EjJVPahoVLU0z9HWC','active',NULL,'2026-07-20 07:57:47','2026-07-21 14:57:19',NULL),(7,4,5,6,'Admin Test Quincaillerie Express','admin_4@express.com',NULL,'$2y$12$33eBxChIV1BBV7GN2cmuhepOkMRW1eRyYiNfuZ.b./OKp6bAOO54u','$2y$12$3weXrCIpxJxC1xyFYDqKpuAde4IJUFMN5brKT2anxLoWuu.xmrIKC','active',NULL,'2026-07-20 08:07:39','2026-07-21 14:57:19',NULL),(8,5,6,2,'BAGUI RODRIGUE','bagui@gmail.com',NULL,'$2y$12$DdjTmP1W8BmQOamkDL7h8OkhP4ibZSNYxZeI4XzYUienU3ad39rxC','$2y$12$WOHzKyKQJ2eHnjSOyrK4z.Acymb7V9NbONrFcn4gw2QsMN.lrNx62','active',NULL,'2026-07-20 15:04:49','2026-07-21 14:57:20',NULL),(9,6,7,2,'YASMINE BAMBA','yasmine@gmail.com',NULL,'$2y$12$wz/zPcj9gKOzMmK.ZOwizu1Hz/JjPJ1R7rNC7Ckgm.96Dd0ce6EiG','$2y$12$kNhbPuaOpgTAlfRt6w5bfumZcsOYths7hP1ZB01xgdZ7AIehWx1kC','active',NULL,'2026-07-21 15:52:05','2026-07-21 15:53:01',NULL),(10,6,NULL,3,'hélène kouamé','helene@gmail.com',NULL,'$2y$12$ytN1AxxD3CnDVTayFP6swOVJPyRIZFxk5gGmi0OYEoWWfns76cGRa','$2y$12$s0sRls7qS6zg8XW4vvTKYOluH3lIbSgwBwOSbts0BdX3mWs9KhHUu','active',NULL,'2026-07-21 15:54:23','2026-07-21 15:54:23',NULL),(11,1,1,3,'Jean Vendeur','jean.vendeur@dls.com',NULL,'$2y$12$wsma7VMK2NAOieTTr.646u2ubHVn5/tEAnYd9rZHZOr36uCxzTvyS',NULL,'active',NULL,'2026-07-22 09:45:30','2026-07-22 09:45:30',NULL),(12,7,11,2,'Tape Desire','tapedesire@gmail.com',NULL,'$2y$12$BHcECgn2HUSayuxzrXg7..P5QV89O3z1IHJccEyd8e4OlmRhatKTy','$2y$12$l1ldxGMeTJYiJqVcl6WV6uDsXokEHHzYoxtNYIm3Ho04yiL5B8/W2','active',NULL,'2026-07-22 10:38:18','2026-07-22 10:38:18',NULL),(13,8,12,2,'jayson smith','jaysonsmith@gmail.com',NULL,'$2y$12$Am7qRHirnNLiF3Nh5mlGEOPeIuHif.G8AD97qMaf7cuRGaRw7X8xq','$2y$12$oQWRXrFNVUjKU/sNNMIuGOwL2GoEBw1K7nefCMeU9w670UVMHlboC','active',NULL,'2026-07-22 10:46:02','2026-07-22 10:46:02',NULL);
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

-- Dump completed on 2026-07-22 15:34:25
