-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 01, 2025 at 01:13 PM
-- Server version: 10.6.21-MariaDB
-- PHP Version: 8.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kandyisl_goldenaroma`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryType` varchar(100) DEFAULT NULL,
  `categoryStatus` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryId`, `categoryName`, `categoryType`, `categoryStatus`) VALUES
(1, 'GAS - ගෑස්', NULL, 'In stock');

-- --------------------------------------------------------

--
-- Table structure for table `chequedata`
--

CREATE TABLE `chequedata` (
  `chequeId` int(11) NOT NULL,
  `chequeNumber` varchar(255) NOT NULL,
  `chequeAmount` varchar(255) NOT NULL,
  `issuedDate` datetime DEFAULT NULL,
  `chequeDate` date NOT NULL,
  `chequeStatus` varchar(255) NOT NULL,
  `supplierId` int(11) NOT NULL,
  `stockPaymentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `costing_details`
--

CREATE TABLE `costing_details` (
  `id` int(11) NOT NULL,
  `costing_header_id` int(11) NOT NULL,
  `description_customer` varchar(255) DEFAULT NULL,
  `product_code` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `warranty` varchar(100) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `unit_cost` decimal(15,2) DEFAULT NULL,
  `our_margin_percentage` decimal(5,2) DEFAULT NULL,
  `our_margin_value` decimal(15,2) DEFAULT NULL,
  `other_margin_percentage` decimal(5,2) DEFAULT NULL,
  `other_margin_value` decimal(15,2) DEFAULT NULL,
  `price_plus_margin` decimal(15,2) DEFAULT NULL,
  `selling_rate` decimal(15,2) DEFAULT NULL,
  `selling_rate_rounded` decimal(15,2) DEFAULT NULL,
  `uom` varchar(50) DEFAULT NULL,
  `qty` int(11) DEFAULT 1,
  `unit_price` decimal(15,2) DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `discount_value` decimal(15,2) DEFAULT NULL,
  `discounted_price` decimal(15,2) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `profit` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `needImage` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `costing_headers`
--

CREATE TABLE `costing_headers` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_amount` decimal(15,2) NOT NULL,
  `total_profit` decimal(15,2) NOT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `cusId` int(11) DEFAULT NULL,
  `preparedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `cusId` int(11) NOT NULL,
  `cusName` varchar(255) NOT NULL,
  `cusCode` varchar(255) NOT NULL,
  `cusAddress` varchar(255) NOT NULL,
  `cusPhone` varchar(255) NOT NULL,
  `cusJob` varchar(255) DEFAULT NULL,
  `cusEmail` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `license` varchar(255) DEFAULT NULL,
  `customerReview` varchar(255) DEFAULT NULL,
  `customerDescription` varchar(255) DEFAULT NULL,
  `guarantorId` int(11) DEFAULT NULL,
  `nicFront` varchar(255) DEFAULT NULL,
  `nicBack` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`cusId`, `cusName`, `cusCode`, `cusAddress`, `cusPhone`, `cusJob`, `cusEmail`, `nic`, `license`, `customerReview`, `customerDescription`, `guarantorId`, `nicFront`, `nicBack`) VALUES
(1, 'Maleesha', 'CUS001', 'Kandy', '119', 'Maleesha', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deliverynote`
--

CREATE TABLE `deliverynote` (
  `id` int(11) NOT NULL,
  `invoiceId` int(11) NOT NULL,
  `invoiceNo` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL,
  `stockId` int(11) NOT NULL,
  `invoiceQty` int(11) NOT NULL,
  `sendQty` int(11) NOT NULL,
  `deliverdQty` int(11) NOT NULL,
  `totalAmount` int(11) NOT NULL,
  `deliveryStatus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `id` int(11) NOT NULL,
  `driverName` varchar(255) NOT NULL,
  `driverAge` int(11) DEFAULT NULL,
  `driverAddress` text DEFAULT NULL,
  `driverPhone` varchar(20) DEFAULT NULL,
  `driverStatus` varchar(50) DEFAULT NULL,
  `driverNic` varchar(20) DEFAULT NULL,
  `driverLicence` varchar(50) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duecustomer`
--

CREATE TABLE `duecustomer` (
  `duecustomerId` int(11) NOT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `transactionId` int(11) DEFAULT NULL,
  `cusId` int(11) DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `dueamount` int(11) DEFAULT NULL,
  `paidAmount` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `payType` varchar(50) DEFAULT NULL,
  `datedCheque` date DEFAULT NULL,
  `chequeDetail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `duecustomer`
--

INSERT INTO `duecustomer` (`duecustomerId`, `invoiceId`, `transactionId`, `cusId`, `dueDate`, `dueamount`, `paidAmount`, `status`, `payType`, `datedCheque`, `chequeDetail`) VALUES
(1, NULL, 4, 1, '2025-04-15', 0, 160, 'paid', 'cash', NULL, NULL),
(2, NULL, 2, 1, '2025-04-15', 0, 80, 'paid', 'cash', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expensesId` int(11) NOT NULL,
  `expensesCatId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expensesId`, `expensesCatId`, `productId`, `description`, `date`, `price`) VALUES
(1, 5, 1, 'damage', '2025-04-15', 2000);

-- --------------------------------------------------------

--
-- Table structure for table `expensescat`
--

CREATE TABLE `expensescat` (
  `expensesCatId` int(11) NOT NULL,
  `expensesCatName` varchar(255) DEFAULT NULL,
  `expensesCatType` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expensescat`
--

INSERT INTO `expensescat` (`expensesCatId`, `expensesCatName`, `expensesCatType`) VALUES
(1, 'Oil', 'Oil'),
(2, 'Service', 'Service'),
(3, 'Repair', 'Repair'),
(4, 'Other', 'Other'),
(5, 'Damage', 'Damage'),
(6, 'Return', 'Return'),
(7, 'Expire', 'Expire');

-- --------------------------------------------------------

--
-- Table structure for table `guarantor`
--

CREATE TABLE `guarantor` (
  `guarantorId` int(11) NOT NULL,
  `guarantorName` varchar(255) NOT NULL,
  `guarantorNic` varchar(255) DEFAULT NULL,
  `guarantorPhone` varchar(255) DEFAULT NULL,
  `guarantorAddress` varchar(255) DEFAULT NULL,
  `nicFront` varchar(255) DEFAULT NULL,
  `nicBack` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoiceId` int(11) NOT NULL,
  `invoiceNo` varchar(45) NOT NULL,
  `invoiceDate` datetime NOT NULL,
  `status` varchar(255) NOT NULL,
  `store` varchar(255) NOT NULL,
  `purchaseNo` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `cusId` int(11) NOT NULL,
  `invoiceTime` int(11) NOT NULL,
  `deliveryTime` int(11) NOT NULL,
  `performa` varchar(255) NOT NULL,
  `draft` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `invoiceproduct`
--

CREATE TABLE `invoiceproduct` (
  `id` int(11) NOT NULL,
  `invoiceId` int(11) NOT NULL,
  `invoiceNo` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL,
  `stockId` int(11) NOT NULL,
  `invoiceQty` int(255) NOT NULL,
  `sendQty` int(11) NOT NULL,
  `deliverdQty` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `unitAmount` int(11) NOT NULL,
  `totalAmount` int(255) NOT NULL,
  `invoiceProductStatus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `productCode` varchar(45) NOT NULL,
  `productChassi` varchar(255) DEFAULT NULL,
  `productDiscount` float DEFAULT NULL,
  `productSellingPrice` int(11) DEFAULT NULL,
  `productWarranty` varchar(100) DEFAULT NULL,
  `productEmi` varchar(255) DEFAULT NULL,
  `productDescription` varchar(255) DEFAULT NULL,
  `productImage` varchar(255) DEFAULT NULL,
  `productStatus` varchar(45) DEFAULT NULL,
  `rentOrHire` varchar(255) DEFAULT NULL,
  `category_categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `productName`, `productCode`, `productChassi`, `productDiscount`, `productSellingPrice`, `productWarranty`, `productEmi`, `productDescription`, `productImage`, `productStatus`, `rentOrHire`, `category_categoryId`) VALUES
(1, '2.3kg GAS', 'PROD-currypowder1kg-අමුතුනපහ1kg-001', '', NULL, 736, '', NULL, '2.3kg GAS', 'https://goldenaroma.kandyis.live/uploads/products/2_3kg_GAS_1745747728079.png', 'In stock', NULL, 1),
(2, '5kg GAS', 'PROD-cinnaoman10g-කුරුදු10g-001', '', NULL, 1541, '', NULL, '5kg GAS', 'https://goldenaroma.kandyis.live/uploads/products/5kg_GAS_1745747834178.png', 'In stock', NULL, 1),
(3, '12.5kg GAS', 'PROD-12.5kggas-001', NULL, NULL, 3789, NULL, NULL, '12.5kg GAS', 'https://goldenaroma.kandyis.live/uploads/products/12_5kg_GAS_1745747914889.png', 'In stock', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rentimages`
--

CREATE TABLE `rentimages` (
  `id` int(11) NOT NULL,
  `imageOne` text DEFAULT NULL,
  `imageTwo` text DEFAULT NULL,
  `imageThree` text DEFAULT NULL,
  `imageFour` text DEFAULT NULL,
  `salesId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rentimages`
--

INSERT INTO `rentimages` (`id`, `imageOne`, `imageTwo`, `imageThree`, `imageFour`, `salesId`) VALUES
(1, '/uploads/rentImages/1740224642811.jpg', '/uploads/rentImages/1740224642813.jpg', '/uploads/rentImages/1740224642814.jpg', '/uploads/rentImages/1740224642816.jpg', 1),
(2, '/uploads/rentImages/1740234522147.jpg', NULL, NULL, NULL, 4),
(3, '/uploads/rentImages/1740823055884.jpg', '/uploads/rentImages/1740823057171.jpg', NULL, NULL, 7),
(4, '/uploads/rentImages/1740823059686.jpg', '/uploads/rentImages/1740823061640.jpg', NULL, NULL, 8),
(5, '/uploads/rentImages/1740887465114.jpg', NULL, NULL, NULL, 11),
(6, '/uploads/rentImages/1741077094993.jpg', NULL, NULL, NULL, 12),
(7, '/uploads/rentImages/1741077095837.jpg', NULL, NULL, NULL, 13),
(8, '/uploads/rentImages/1741244602205.jpg', NULL, NULL, NULL, 16),
(9, '/uploads/rentImages/1741319058985.jpg', NULL, NULL, NULL, 17),
(10, '/uploads/rentImages/1741575617884.jpg', NULL, NULL, NULL, 18),
(11, '/uploads/rentImages/1742283120706.jpg', NULL, NULL, NULL, 21),
(12, '/uploads/rentImages/1742290480539.jpg', NULL, NULL, NULL, 22),
(13, '/uploads/rentImages/1742532973087.jpg', NULL, NULL, NULL, 23),
(14, '/uploads/rentImages/1743257240890.jpg', NULL, NULL, NULL, 24),
(15, '/uploads/rentImages/1744012702502.jpg', NULL, NULL, NULL, 25),
(16, '/uploads/rentImages/1744013291220.jpg', NULL, NULL, NULL, 26),
(17, '/uploads/rentImages/1744013724120.jpg', NULL, NULL, NULL, 27);

-- --------------------------------------------------------

--
-- Table structure for table `returnitems`
--

CREATE TABLE `returnitems` (
  `returnItemId` int(11) NOT NULL,
  `returnItemDate` datetime NOT NULL,
  `store_storeId` int(11) NOT NULL,
  `user_userId` int(11) NOT NULL,
  `invoice_invoiceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `returnproducts`
--

CREATE TABLE `returnproducts` (
  `returnProductId` int(11) NOT NULL,
  `returnQty` int(11) NOT NULL,
  `returnAmount` float NOT NULL,
  `returnItemType` varchar(100) DEFAULT NULL,
  `returnDate` datetime DEFAULT NULL,
  `returnNote` varchar(255) DEFAULT NULL,
  `stockId` int(11) NOT NULL,
  `invoiceProductId` int(11) NOT NULL,
  `returnItemId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `salesId` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `guarantorId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `saleDate` datetime DEFAULT NULL,
  `cashierName` varchar(255) DEFAULT NULL,
  `driverId` int(11) DEFAULT NULL,
  `transactionId` int(11) DEFAULT NULL,
  `paymentStatus` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `refund` int(11) DEFAULT NULL,
  `meeterBefore` varchar(11) DEFAULT NULL,
  `meeterAfter` varchar(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `images` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`salesId`, `customerId`, `guarantorId`, `productId`, `saleDate`, `cashierName`, `driverId`, `transactionId`, `paymentStatus`, `status`, `refund`, `meeterBefore`, `meeterAfter`, `note`, `createdAt`, `updatedAt`, `images`, `price`, `quantity`) VALUES
(1, 1, NULL, 1, '2025-04-15 08:35:00', NULL, NULL, 1, 'paid', 'rent', NULL, NULL, NULL, '', '2025-04-15 14:07:31', '2025-04-15 14:07:31', NULL, 1500, 1),
(2, 1, NULL, 2, '2025-04-15 08:35:00', NULL, NULL, 1, 'paid', 'rent', NULL, NULL, NULL, '', '2025-04-15 14:07:31', '2025-04-15 14:07:31', NULL, 80, 2),
(3, 1, NULL, 2, '2025-04-15 08:37:00', NULL, NULL, 2, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 14:08:01', '2025-04-15 14:08:01', NULL, 80, 1),
(4, NULL, NULL, 1, '2025-04-15 14:26:14', NULL, NULL, 3, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-15 14:26:14', '2025-04-15 14:26:14', NULL, 1500, 5),
(5, 1, NULL, 2, '2025-04-15 13:08:00', NULL, NULL, 4, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 18:38:42', '2025-04-15 18:38:42', NULL, 80, 2),
(6, NULL, NULL, 2, '2025-04-15 18:53:49', NULL, NULL, 5, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-15 18:53:49', '2025-04-15 18:53:49', NULL, 80, 9),
(7, NULL, NULL, 1, '2025-04-15 19:04:30', NULL, NULL, 6, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-15 19:04:30', '2025-04-15 19:04:30', NULL, 1000, 1),
(8, NULL, NULL, 2, '2025-04-15 19:04:30', NULL, NULL, 6, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-15 19:04:30', '2025-04-15 19:04:30', NULL, 80, 1),
(9, NULL, NULL, 1, '2025-04-27 09:59:11', NULL, NULL, 7, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 09:59:11', '2025-04-27 09:59:11', NULL, 736, 1),
(10, NULL, NULL, 2, '2025-04-27 10:46:52', NULL, NULL, 8, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 10:46:52', '2025-04-27 10:46:52', NULL, 1541, 1),
(11, NULL, NULL, 3, '2025-04-27 14:32:22', NULL, NULL, 9, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 14:32:22', '2025-04-27 14:32:22', NULL, 3789, 1),
(12, NULL, NULL, 1, '2025-04-27 14:32:22', NULL, NULL, 9, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 14:32:22', '2025-04-27 14:32:22', NULL, 736, 1),
(13, NULL, NULL, 3, '2025-04-27 15:48:34', NULL, NULL, 10, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 15:48:34', '2025-04-27 15:48:34', NULL, 3789, 1),
(14, NULL, NULL, 2, '2025-04-27 15:48:55', NULL, NULL, 11, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 15:48:55', '2025-04-27 15:48:55', NULL, 1541, 1),
(15, NULL, NULL, 1, '2025-04-27 15:49:22', NULL, NULL, 12, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 15:49:22', '2025-04-27 15:49:22', NULL, 736, 1),
(16, NULL, NULL, 3, '2025-04-27 15:49:46', NULL, NULL, 13, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-27 15:49:46', '2025-04-27 15:49:46', NULL, 3789, 1),
(17, NULL, NULL, 1, '2025-05-01 05:53:58', NULL, NULL, 14, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 05:53:58', '2025-05-01 05:53:58', NULL, 736, 1),
(18, NULL, NULL, 3, '2025-05-01 05:57:50', NULL, NULL, 15, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 05:57:50', '2025-05-01 05:57:50', NULL, 3789, 1),
(19, NULL, NULL, 2, '2025-05-01 06:06:55', NULL, NULL, 16, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:06:55', '2025-05-01 06:06:55', NULL, 1541, 1),
(20, NULL, NULL, 2, '2025-05-01 06:09:47', NULL, NULL, 17, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:09:47', '2025-05-01 06:09:47', NULL, 1541, 1),
(21, NULL, NULL, 1, '2025-05-01 06:09:57', NULL, NULL, 18, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:09:57', '2025-05-01 06:09:57', NULL, 736, 1),
(22, NULL, NULL, 2, '2025-05-01 06:11:43', NULL, NULL, 19, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:11:43', '2025-05-01 06:11:43', NULL, 1541, 1),
(23, NULL, NULL, 3, '2025-05-01 06:15:46', NULL, NULL, 20, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:15:46', '2025-05-01 06:15:46', NULL, 3789, 1),
(24, NULL, NULL, 3, '2025-05-01 06:15:46', NULL, NULL, 21, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:15:46', '2025-05-01 06:15:46', NULL, 3789, 1),
(25, NULL, NULL, 1, '2025-05-01 06:16:26', NULL, NULL, 22, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:16:26', '2025-05-01 06:16:26', NULL, 736, 1),
(26, NULL, NULL, 3, '2025-05-01 06:16:42', NULL, NULL, 23, NULL, 'sold', NULL, NULL, NULL, '', '2025-05-01 06:16:42', '2025-05-01 06:16:42', NULL, 3789, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `stockId` int(11) NOT NULL,
  `stockName` varchar(255) NOT NULL,
  `unitPrice` int(11) DEFAULT NULL,
  `stockPrice` float NOT NULL,
  `stockQty` int(11) NOT NULL,
  `stockDate` datetime DEFAULT NULL,
  `mfd` date DEFAULT NULL,
  `exp` date DEFAULT NULL,
  `stockDescription` varchar(255) DEFAULT NULL,
  `stockStatus` varchar(45) NOT NULL,
  `products_productId` int(11) NOT NULL,
  `supplier_supplierId` int(11) NOT NULL,
  `category_categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `stockhistory`
--

CREATE TABLE `stockhistory` (
  `stockHistoryId` int(11) NOT NULL,
  `stockHistoryQty` int(11) NOT NULL,
  `stock_stockId` int(11) NOT NULL,
  `products_productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `stockpayments`
--

CREATE TABLE `stockpayments` (
  `stockPaymentId` int(11) NOT NULL,
  `cashAmount` float NOT NULL,
  `chequeAmount` float NOT NULL,
  `due` float NOT NULL,
  `total` float NOT NULL,
  `vat` float NOT NULL,
  `stockQty` int(11) NOT NULL,
  `supplierId` int(11) DEFAULT NULL,
  `stockPayDate` datetime NOT NULL,
  `stockId` int(11) NOT NULL,
  `stockPaymentStatus` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `storeId` int(11) NOT NULL,
  `storeName` varchar(45) NOT NULL,
  `storeAddress` varchar(255) NOT NULL,
  `storeStatus` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplierId` int(11) NOT NULL,
  `supplierName` varchar(45) NOT NULL,
  `supplierAddress` varchar(255) NOT NULL,
  `supplierNic` varchar(45) DEFAULT NULL,
  `supplierEmail` varchar(45) DEFAULT NULL,
  `supplierTP` varchar(45) NOT NULL,
  `supplierSecondTP` varchar(45) DEFAULT NULL,
  `supplierStatus` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `supplierpayments`
--

CREATE TABLE `supplierpayments` (
  `payId` int(11) NOT NULL,
  `payDate` datetime NOT NULL,
  `payAmount` float NOT NULL,
  `stockPaymentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `switch`
--

CREATE TABLE `switch` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `switch`
--

INSERT INTO `switch` (`id`, `status`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transactionId` int(11) NOT NULL,
  `dateTime` datetime NOT NULL,
  `transactionType` varchar(255) DEFAULT NULL,
  `totalAmount` int(11) NOT NULL,
  `price` int(100) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `paid` float DEFAULT NULL,
  `due` float DEFAULT NULL,
  `OgDue` float NOT NULL,
  `chequeDate` date DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `invoice_invoiceId` int(11) NOT NULL,
  `user_userId` int(11) NOT NULL,
  `cusId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transactionId` int(11) NOT NULL,
  `salesId` int(11) DEFAULT NULL,
  `cusId` int(50) DEFAULT NULL,
  `returnDate` datetime DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `extraCharges` int(11) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL,
  `paymentType` varchar(50) DEFAULT NULL,
  `paidAmount` int(11) DEFAULT NULL,
  `due` int(11) DEFAULT NULL,
  `pId` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transactionId`, `salesId`, `cusId`, `returnDate`, `price`, `extraCharges`, `discount`, `totalAmount`, `paymentType`, `paidAmount`, `due`, `pId`, `note`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 1, NULL, 1660, 0, 0, 1660, 'cash', 1660, 0, 1, '', '2025-04-15 08:35:00', '2025-04-15 14:07:31'),
(2, NULL, 1, NULL, 80, 0, 0, 80, 'cash', 80, 0, 2, '', '2025-04-15 08:37:00', '2025-04-15 18:54:28'),
(3, NULL, NULL, NULL, 7500, NULL, 0, 7500, 'cash', 7500, 0, 1, '', '2025-04-15 14:26:14', '2025-04-15 14:26:14'),
(4, NULL, 1, NULL, 160, 0, 0, 160, 'cash', 160, 0, 2, '', '2025-04-15 13:08:00', '2025-04-15 18:39:00'),
(5, NULL, NULL, NULL, 720, NULL, 0, 720, 'cash', 600, 120, 2, '', '2025-04-15 18:53:49', '2025-04-15 18:53:49'),
(6, NULL, NULL, NULL, 1080, NULL, 0, 1080, 'cash', 0, 1080, 1, '', '2025-04-15 19:04:30', '2025-04-15 19:04:30'),
(7, NULL, NULL, NULL, 736, NULL, 0, 736, 'cash', 0, 736, 1, '', '2025-04-27 09:59:11', '2025-04-27 09:59:11'),
(8, NULL, NULL, NULL, 1541, NULL, 0, 1541, 'cash', 1541, 0, 2, '', '2025-04-27 10:46:52', '2025-04-27 10:46:52'),
(9, NULL, NULL, NULL, 4525, NULL, 0, 4525, 'cash', 4525, 0, 3, '', '2025-04-27 14:32:22', '2025-04-27 14:32:22'),
(10, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 5000, 0, 3, '', '2025-04-27 15:48:34', '2025-04-27 15:48:34'),
(11, NULL, NULL, NULL, 1541, NULL, 0, 1541, 'cash', 0, 1541, 2, '', '2025-04-27 15:48:55', '2025-04-27 15:48:55'),
(12, NULL, NULL, NULL, 736, NULL, 0, 736, 'cash', 1000, 0, 1, '', '2025-04-27 15:49:22', '2025-04-27 15:49:22'),
(13, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 0, 3789, 3, '', '2025-04-27 15:49:46', '2025-04-27 15:49:46'),
(14, NULL, NULL, NULL, 736, NULL, 0, 736, 'cash', 0, 736, 1, '', '2025-05-01 05:53:58', '2025-05-01 05:53:58'),
(15, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 0, 3789, 3, '', '2025-05-01 05:57:50', '2025-05-01 05:57:50'),
(16, NULL, NULL, NULL, 1541, NULL, 0, 1541, 'cash', 2000, 0, 2, '', '2025-05-01 06:06:55', '2025-05-01 06:06:55'),
(17, NULL, NULL, NULL, 1541, NULL, 0, 1541, 'cash', 0, 1541, 2, '', '2025-05-01 06:09:47', '2025-05-01 06:09:47'),
(18, NULL, NULL, NULL, 736, NULL, 0, 736, 'cash', 0, 736, 1, '', '2025-05-01 06:09:57', '2025-05-01 06:09:57'),
(19, NULL, NULL, NULL, 1541, NULL, 0, 1541, 'cash', 2000, 0, 2, '', '2025-05-01 06:11:43', '2025-05-01 06:11:43'),
(20, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 4000, 0, 3, '', '2025-05-01 06:15:46', '2025-05-01 06:15:46'),
(21, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 4000, 0, 3, '', '2025-05-01 06:15:46', '2025-05-01 06:15:46'),
(22, NULL, NULL, NULL, 736, NULL, 0, 736, 'cash', 500, 236, 1, '', '2025-05-01 06:16:26', '2025-05-01 06:16:26'),
(23, NULL, NULL, NULL, 3789, NULL, 0, 3789, 'cash', 0, 3789, 3, '', '2025-05-01 06:16:42', '2025-05-01 06:16:42');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `userTitle` varchar(45) NOT NULL,
  `userFullName` varchar(100) NOT NULL,
  `userName` varchar(45) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `userType` varchar(45) NOT NULL,
  `userEmail` varchar(45) NOT NULL,
  `userNIC` varchar(45) NOT NULL,
  `userSecondTP` varchar(45) DEFAULT NULL,
  `userTP` varchar(45) NOT NULL,
  `userAddress` varchar(255) NOT NULL,
  `userImage` varchar(255) DEFAULT NULL,
  `userStatus` varchar(45) NOT NULL,
  `store_storeId` int(11) NOT NULL,
  `is_hidden` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userTitle`, `userFullName`, `userName`, `userPassword`, `userType`, `userEmail`, `userNIC`, `userSecondTP`, `userTP`, `userAddress`, `userImage`, `userStatus`, `store_storeId`, `is_hidden`) VALUES
(4, 'Mr.', 'master', 'master', '$2b$10$YOYbjZyy3L4nBG/QLXHT5OZGqyFj80naF.fLxwH7nXRPHld6CjdCC', 'Admin', 'master@gmail.com', '123456729V', '12334567890', '1234567890', 'xxx', NULL, 'Active', 1, 1),
(5, 'Mr.', 'maleesha', 'maleeshapa', '$2b$10$SQb/n5CQrtiyuE/ABCIVoO1noHx9zPc53rEVlC7WGZ9VkFBu4Qo4m', 'Admin', 'buddhika@gmail.com', '2002832992', '12334567890', '1234567890', 'kandy', 'http://localhost:5000/uploads/users/maleeshapa_1735067279096.jpg', 'Active', 1, 1),
(6, 'Mr.', 'test', 'test', '$2b$10$Q.FEvek9ohgMdXgJlQoOwOz09N9c0Hu1xyEXyL0Y2cUa4fxlErDDG', 'Admin', 'test@gmail.com', '553456789v', '777', '555', '416/A', 'http://localhost:5000/uploads/users/test_1738601571034.jpg', 'Active', 1, 0),
(9, 'Mr.', 'indika', 'indika', '$2b$10$n8IeJdHYYJOE9Y1.F9EKke6Q1NHV30h3vxagZA9UNGiAFrKfa2n4i', 'Admin', 'indika@mail.com', '123456789v', 'null', '0772344422', 'kandy', NULL, 'Active', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryId`) USING BTREE;

--
-- Indexes for table `chequedata`
--
ALTER TABLE `chequedata`
  ADD PRIMARY KEY (`chequeId`) USING BTREE,
  ADD KEY `supplierId` (`supplierId`) USING BTREE,
  ADD KEY `stockPaymentId` (`stockPaymentId`) USING BTREE;

--
-- Indexes for table `costing_details`
--
ALTER TABLE `costing_details`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_costing_header` (`costing_header_id`) USING BTREE;

--
-- Indexes for table `costing_headers`
--
ALTER TABLE `costing_headers`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_customer` (`cusId`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`cusId`) USING BTREE,
  ADD KEY `fk_guarantor` (`guarantorId`);

--
-- Indexes for table `deliverynote`
--
ALTER TABLE `deliverynote`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `deliverynote_ibfk_1` (`invoiceId`) USING BTREE,
  ADD KEY `deliverynote_ibfk_3` (`stockId`) USING BTREE,
  ADD KEY `deliverynote_ibfk_2` (`productId`) USING BTREE;

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `driverNic` (`driverNic`),
  ADD UNIQUE KEY `driverLicence` (`driverLicence`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `duecustomer`
--
ALTER TABLE `duecustomer`
  ADD PRIMARY KEY (`duecustomerId`),
  ADD KEY `cusId` (`cusId`),
  ADD KEY `invoiceId` (`invoiceId`),
  ADD KEY `duecustomer_ibfk_3` (`transactionId`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expensesId`),
  ADD KEY `expensesCatId` (`expensesCatId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `expensescat`
--
ALTER TABLE `expensescat`
  ADD PRIMARY KEY (`expensesCatId`);

--
-- Indexes for table `guarantor`
--
ALTER TABLE `guarantor`
  ADD PRIMARY KEY (`guarantorId`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoiceId`) USING BTREE,
  ADD KEY `invoice_ibfk_1` (`cusId`) USING BTREE;

--
-- Indexes for table `invoiceproduct`
--
ALTER TABLE `invoiceproduct`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `invoiceId` (`invoiceId`) USING BTREE,
  ADD KEY `productId` (`productId`) USING BTREE,
  ADD KEY `stockId` (`stockId`) USING BTREE;

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`) USING BTREE,
  ADD UNIQUE KEY `productCode` (`productCode`) USING BTREE,
  ADD KEY `fk_products_category_idx` (`category_categoryId`) USING BTREE;

--
-- Indexes for table `rentimages`
--
ALTER TABLE `rentimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salesId` (`salesId`);

--
-- Indexes for table `returnitems`
--
ALTER TABLE `returnitems`
  ADD PRIMARY KEY (`returnItemId`) USING BTREE,
  ADD KEY `fk_return_store1_idx` (`store_storeId`) USING BTREE,
  ADD KEY `fk_return_user1_idx` (`user_userId`) USING BTREE,
  ADD KEY `fk_return_invoice1_idx` (`invoice_invoiceId`) USING BTREE;

--
-- Indexes for table `returnproducts`
--
ALTER TABLE `returnproducts`
  ADD PRIMARY KEY (`returnProductId`) USING BTREE,
  ADD KEY `returnproduct_ibfk_2` (`invoiceProductId`) USING BTREE,
  ADD KEY `returnproduct_ibfk_3` (`returnItemId`) USING BTREE,
  ADD KEY `returnproduct_ibfk_4` (`stockId`) USING BTREE,
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`salesId`),
  ADD KEY `idx_sale_date` (`saleDate`),
  ADD KEY `fk_sales_customerId` (`customerId`),
  ADD KEY `fk_sales_guarantorId` (`guarantorId`),
  ADD KEY `fk_sales_productId` (`productId`),
  ADD KEY `fk_sales_driverId` (`driverId`),
  ADD KEY `fk_sales_transactionId` (`transactionId`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`stockId`) USING BTREE,
  ADD KEY `fk_stock_products1_idx` (`products_productId`) USING BTREE,
  ADD KEY `fk_stock_supplier1_idx` (`supplier_supplierId`) USING BTREE,
  ADD KEY `fk_stock_category1_idx` (`category_categoryId`) USING BTREE;

--
-- Indexes for table `stockhistory`
--
ALTER TABLE `stockhistory`
  ADD PRIMARY KEY (`stockHistoryId`) USING BTREE,
  ADD KEY `fk_stockHistory_stock1_idx` (`stock_stockId`) USING BTREE,
  ADD KEY `fk_stockHistory_products1_idx` (`products_productId`) USING BTREE;

--
-- Indexes for table `stockpayments`
--
ALTER TABLE `stockpayments`
  ADD PRIMARY KEY (`stockPaymentId`) USING BTREE,
  ADD KEY `supplierId` (`supplierId`) USING BTREE,
  ADD KEY `stockId` (`stockId`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`storeId`) USING BTREE;

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplierId`) USING BTREE;

--
-- Indexes for table `supplierpayments`
--
ALTER TABLE `supplierpayments`
  ADD PRIMARY KEY (`payId`) USING BTREE,
  ADD KEY `stockPaymentId` (`stockPaymentId`) USING BTREE;

--
-- Indexes for table `switch`
--
ALTER TABLE `switch`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transactionId`) USING BTREE,
  ADD KEY `fk_transaction_invoice1_idx` (`invoice_invoiceId`) USING BTREE,
  ADD KEY `fk_transaction_user1_idx` (`user_userId`) USING BTREE,
  ADD KEY `cusId` (`cusId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transactionId`),
  ADD KEY `salesId` (`salesId`),
  ADD KEY `transactions_ibfk_2` (`pId`),
  ADD KEY `cusId` (`cusId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`) USING BTREE,
  ADD UNIQUE KEY `userName` (`userName`) USING BTREE,
  ADD KEY `fk_user_store1_idx` (`store_storeId`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chequedata`
--
ALTER TABLE `chequedata`
  MODIFY `chequeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `costing_details`
--
ALTER TABLE `costing_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `costing_headers`
--
ALTER TABLE `costing_headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `cusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `deliverynote`
--
ALTER TABLE `deliverynote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `driver`
--
ALTER TABLE `driver`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `duecustomer`
--
ALTER TABLE `duecustomer`
  MODIFY `duecustomerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expensesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expensescat`
--
ALTER TABLE `expensescat`
  MODIFY `expensesCatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `guarantor`
--
ALTER TABLE `guarantor`
  MODIFY `guarantorId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoiceId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoiceproduct`
--
ALTER TABLE `invoiceproduct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rentimages`
--
ALTER TABLE `rentimages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `returnitems`
--
ALTER TABLE `returnitems`
  MODIFY `returnItemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `returnproducts`
--
ALTER TABLE `returnproducts`
  MODIFY `returnProductId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `salesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `stockId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stockhistory`
--
ALTER TABLE `stockhistory`
  MODIFY `stockHistoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stockpayments`
--
ALTER TABLE `stockpayments`
  MODIFY `stockPaymentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `storeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplierId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplierpayments`
--
ALTER TABLE `supplierpayments`
  MODIFY `payId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `switch`
--
ALTER TABLE `switch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transactionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transactionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chequedata`
--
ALTER TABLE `chequedata`
  ADD CONSTRAINT `chequedata_ibfk_1` FOREIGN KEY (`stockPaymentId`) REFERENCES `stockpayments` (`stockPaymentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chequedata_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`supplierId`);

--
-- Constraints for table `costing_details`
--
ALTER TABLE `costing_details`
  ADD CONSTRAINT `fk_costing_header` FOREIGN KEY (`costing_header_id`) REFERENCES `costing_headers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `costing_headers`
--
ALTER TABLE `costing_headers`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`cusId`) REFERENCES `customer` (`cusId`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `fk_guarantor` FOREIGN KEY (`guarantorId`) REFERENCES `guarantor` (`guarantorId`);

--
-- Constraints for table `deliverynote`
--
ALTER TABLE `deliverynote`
  ADD CONSTRAINT `deliverynote_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`invoiceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `deliverynote_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `deliverynote_ibfk_3` FOREIGN KEY (`stockId`) REFERENCES `stock` (`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE SET NULL;

--
-- Constraints for table `duecustomer`
--
ALTER TABLE `duecustomer`
  ADD CONSTRAINT `duecustomer_ibfk_1` FOREIGN KEY (`cusId`) REFERENCES `customer` (`cusId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `duecustomer_ibfk_2` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`invoiceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `duecustomer_ibfk_3` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`transactionId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
