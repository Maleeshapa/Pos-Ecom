-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 09:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
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
(1, 'Car', 'Default Type', 'In stock'),
(2, 'Van', 'Default Type', 'In stock');

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
(3, 'W m nilantha sangeewa kumara', 'CUS003', '188/e gallinda watta haloluwa', '0769798111', 'Driver', NULL, '950074477v', 'B 3819305', 'Good', '', NULL, '/uploads/cusNicImages/950074477v-front.jpg', '/uploads/cusNicImages/950074477v-back.jpg'),
(5, 'L නුරාන් බණ්ඩාර තල්ගස්පිටිය', 'CUS005', '48/b/1/4,jasmine watta,peradeniya', '0752292900/0712464626', 'Buisness', NULL, '801793886v', 'A010520112', 'Good', 'Charith customer', NULL, '/uploads/cusNicImages/801793886v-front.jpg', '/uploads/cusNicImages/801793886v-back.jpg'),
(6, 'S ලහිර ප්‍රසන්නන බණ්ඩාර', 'CUS006', '853/1 බැංගලෝපාර ඇත් ගාලා ගම්පොල', '0061412519656', 'ඕස්ට්‍රේලියා', NULL, '198412202369', 'B4148330', 'Good', 'Gurudeniya tharindu frend', NULL, '/uploads/cusNicImages/198412202369-front.jpg', NULL),
(8, 'විජිත ශාන්ත අමරතුංග', 'CUS008', '107 වෘත්තලාව මහනුවර', '0704444141', 'Business', NULL, '842021570v', 'B1100137', 'Good', 'Chamara frend', NULL, '/uploads/cusNicImages/842021570v-front.jpg', NULL),
(9, 'M A මොහොමඩ් ඌයිස්', 'CUS009', '5/4 A ධර්මසේන මාවත මහියාව', '071 8522656/ 077909070', 'ශු ෆැක්ට්‍රි', NULL, '199217403297', NULL, 'Good', NULL, NULL, '/uploads/cusNicImages/199217403297-front.jpg', NULL),
(11, 'අජිත් පනාවලගේ', 'CUS010', '67/15 දිගන පාර කුණ්ඩසාලය', '0777601797', 'Business', NULL, '630091594v', 'B1355569', 'Good', NULL, NULL, '/uploads/cusNicImages/630091594v-front.jpg', '/uploads/cusNicImages/630091594v-back.jpg'),
(12, 'S ලහිරු ප්‍රසන්න බණ්ඩාර', 'CUS011', '542 zone 2  මිලේනියම් සිටි කොළඹ', '0061412519656', 'ඕස්ට්‍රේලියා', NULL, '198422202369', 'B4148330', 'Good', NULL, NULL, '/uploads/cusNicImages/198422202369-front.jpg', '/uploads/cusNicImages/198422202369-back.jpg'),
(13, 'D R M ප්‍රභාෂ් හිරන්ද දුනුවිල', 'CUS012', '318 රත්නසිරි දුනුවිල', '0762043000', 'Magcity', NULL, '199936111762', NULL, 'Good', NULL, NULL, '/uploads/cusNicImages/199936111762-front.jpg', '/uploads/cusNicImages/199936111762-back.jpg'),
(14, 'W P  ශානක කැලුම් ප්‍රසන්න fernando', 'CUS013', '44/D වීදුරුගේ වත්ත කොණ්ඩසාලේ', '0771728514', 'Business', NULL, '871121680', 'A016805002', 'Good', NULL, NULL, '/uploads/cusNicImages/871121680-front.jpg', NULL),
(15, 'MNH prince ලක්ෂාන්  Hewage', 'CUS014', '9f වතුර  ටැංකිය rd kulugammana', '0762778242', 'Land sale', NULL, '921230184', 'B1294378', 'Good', NULL, NULL, '/uploads/cusNicImages/921230184-front.jpg', '/uploads/cusNicImages/921230184-back.jpg'),
(16, 'ආනන්ද බණ්ඩාර වන්නි නායක', 'CUS015', '8 ගන්නෝරුව', '0761683218', 'ඕස්ට්‍රේලියාවේ', NULL, '542901829v', 'Coo6616', 'Good', '14 days wagon r 6500*14 100km perdy', NULL, '/uploads/cusNicImages/542901829v-front.jpg', NULL),
(17, 'WM නලින්ද බණ්ඩාර', 'CUS016', '29 පුස්සල්ලා පිටියේ නිල් දන්නා හින්න', '0777938932', 'Business', NULL, '873152036v', 'A016728849', 'Good', NULL, NULL, '/uploads/cusNicImages/873152036v-front.jpg', NULL),
(18, 'KAC අමිල බණ්ඩාර කුලතුංග', 'CUS017', '38/8බෝ මළුව පාරමාවිල් මඩ', '0713948300', 'Army', NULL, '198325804487', 'B3181648', 'Good', NULL, NULL, '/uploads/cusNicImages/198325804487-front.jpg', '/uploads/cusNicImages/198325804487-back.jpg'),
(20, 'M භාතිය මධුසංක ද සිල්වා', 'CUS018', '95/a උඩුවාවල කටුගස්තොට', '0776866222', 'සවුදි', NULL, '850444650v', NULL, 'Good', NULL, NULL, '/uploads/cusNicImages/850444650v-front.jpg', '/uploads/cusNicImages/850444650v-back.jpg'),
(21, 'MNN හුසේන් මොහොමත්', 'CUS019', '66/f ගලදෙණිය උඩතලවින්න kandy', '0752116797', 'පාමසි', NULL, '922122202v', 'B1814644', 'Good', NULL, NULL, '/uploads/cusNicImages/922122202v-front.jpg', '/uploads/cusNicImages/922122202v-back.jpg'),
(25, 'චන්ද්‍රරත්න මල්වත්ත', 'CUS020', 'ලිපිනය  අප්ඩේට් කරන්න ok', 'ෆෝන් නම්බර්  අප්ඩේට් කරන්න ok', 'අප්ඩේට් කරන්න', NULL, '763181383v', '', '', '', NULL, '/uploads/cusNicImages/763181383v-front.jpg', '/uploads/cusNicImages/763181383v-back.jpg'),
(27, 'රජන් ප්‍රධාප්', 'CUS021', '273, Peradeniya rd , kandy', '0777282613', '', NULL, '198300403098', '', 'Normal', NULL, NULL, NULL, NULL),
(36, 'අරුණ පියදර්ශන පල්ලෙමුල්ල', 'CUS022', '219 kandeyaya kumburegama', '0704027938', NULL, NULL, '841820460v', 'A016787551', 'Good', NULL, NULL, '/uploads/cusNicImages/841820460v-front.jpg', '/uploads/cusNicImages/841820460v-back.jpg'),
(37, 'Nalintha dilshan', 'CUS023', '216/2', '07763522625', 'Redio fm', NULL, '963140312v', 'Rrr', 'Good', NULL, NULL, '/uploads/cusNicImages/963140312v-front.jpg', NULL),
(38, 'PP shahan naveen', 'CUS024', '21/ uda iriya gama පේරාදෙණිය', '0773345316', NULL, NULL, '973303368v', 'B3465079', 'Good', NULL, NULL, '/uploads/cusNicImages/973303368v-front.jpg', '/uploads/cusNicImages/973303368v-back.jpg'),
(39, 'Piyal shantha', 'CUS025', 'Ambatanna', '077', 'Central finance  kandy', NULL, '730562586v', 'B392066', 'Good', NULL, NULL, '/uploads/cusNicImages/730562586v-front.jpg', '/uploads/cusNicImages/730562586v-back.jpg'),
(40, 'LWA චමින්ද වික්‍රමසිංහ', 'CUS026', '62 නවලියක්ද මැණික් හින්දා', '0771552704', 'Ctb', NULL, '752411689v', 'B831701', 'Normal', NULL, NULL, '/uploads/cusNicImages/752411689v-front.jpg', NULL),
(41, 'GG රොසන් ජයසුන්දර', 'CUS027', '116/2 අත්හැරගම මුල්ලේගම අඹතැන්න', '0721070057', NULL, NULL, '952593790v', 'B2511167', 'Normal', NULL, NULL, '/uploads/cusNicImages/952593790v-front.jpg', '/uploads/cusNicImages/952593790v-back.jpg'),
(42, 'KGFonseka', 'CUS028', '13/5 b yatiwawala katugastota', '0773496330', NULL, NULL, '197822101234', 'B1712423', 'Normal', NULL, NULL, '/uploads/cusNicImages/197822101234-front.jpg', NULL),
(43, 'මනෝජ්‍ය ප්‍රසන්න ධම්මිකුමාර', 'CUS029', '103/1 මැදගම පූජාපිටිය', '0773602592', 'Construction', NULL, '731261725v', 'B653733', 'Good', NULL, NULL, '/uploads/cusNicImages/731261725v-front.jpg', '/uploads/cusNicImages/731261725v-back.jpg'),
(44, 'WMAD dilan', 'CUS030', 'Walapane', '0777938932', NULL, NULL, '952311620v', 'Ff', 'Good', 'Lalinda bro', NULL, '/uploads/cusNicImages/952311620v-front.jpg', NULL),
(45, 'Aklam mohamad ihsan', 'CUS031', '24 aruppola watte  rd kandy', '0761715357', 'Business', NULL, '199919010082', 'B4711539', 'Normal', NULL, NULL, '/uploads/cusNicImages/199919010082-front.jpg', '/uploads/cusNicImages/199919010082-back.jpg'),
(46, 'test', 'CUS032', '416/A', '123', 'ssss', NULL, '123', NULL, 'Good', 'test', NULL, NULL, NULL);

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
(2, NULL, 4, 46, '2025-04-14', 4600, 200, 'paid', 'cash', NULL, NULL),
(3, NULL, 5, 46, '2025-04-15', 1000, 4000, 'paid', 'cash', NULL, NULL),
(4, NULL, 7, 46, '2025-04-15', 0, 1, 'paid', 'cash', NULL, NULL),
(5, NULL, 9, 46, '2025-04-15', 0, 1600, 'paid', 'cash', NULL, NULL);

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
(1, 3, 5, 'Watte pump replacing  එන්ජිම service ', '2025-03-03', 10000),
(2, 3, 5, 'Cv joint  rac bush, whiles nat bolt, alignment  ', '2025-03-20', 30000),
(3, 3, 2, 'Cv joint 10000/ grees  700  mjr 2000', '2025-03-17', 12000),
(4, 2, 5, 'Oil & filter change 211822km', '2025-03-27', 7500),
(5, 3, 10, 'Break pad replace ', '2025-03-27', 6000),
(6, 2, 12, 'AC gas &AC Filter ', '2025-03-26', 4250),
(7, 3, 12, 'oltanator replacing 48000/=  garage 4000/= caring 10000/=', '2025-03-24', 64000),
(8, 2, 9, 'Oill & filter change 365100km', '2025-03-28', 7200),
(9, 1, 76, 'test', '2025-04-13', 8000),
(12, 5, 20, 'test', '2025-04-15', 50),
(13, 5, 20, 'test', '2025-04-15', 50),
(14, 2, NULL, '55', '2025-04-15', 55);

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
(20, 'Alto', 'Cag 6828', '', NULL, 6000, '', NULL, 'Karada wattacar', 'http://sinhacabs.kandyis.live/uploads/products/Alto_1741838632148.jpg', 'Unavailable', 'rent', 1),
(21, 'test', '', NULL, NULL, 1500, NULL, NULL, 'test', NULL, 'Unavailable', NULL, 1),
(67, 'testdd', 'PROD-testdd-001', NULL, NULL, 200, NULL, NULL, 'tesdd', NULL, 'In stock', NULL, 1),
(68, 'gg', 'PROD-gg-001', NULL, NULL, 900, NULL, NULL, 'gg', 'http://localhost:5000/uploads/products/gg_1744455186579.jpg', 'In stock', NULL, 1),
(69, 'ddd', 'PROD-ddd-001', NULL, NULL, 4444, NULL, NULL, 'fff', 'http://localhost:5000/uploads/products/ddd_1744455253654.jpg', 'In stock', NULL, 1),
(70, 'gfgf', 'PROD-gfgf-001', NULL, NULL, 5555, NULL, NULL, 'ytyy', 'http://localhost:5000/uploads/products/gfgf_1744455298081.jpg', 'In stock', NULL, 2),
(71, 'www', 'PROD-www-001', NULL, NULL, 1500, NULL, NULL, 'dd', 'http://localhost:5000/uploads/products/www_1744455660791.jpg', 'In stock', NULL, 2),
(72, 'vfdgdffgfg', 'PROD-vfdgdffgfg-001', NULL, NULL, 200, NULL, NULL, 'fgfg', NULL, 'In stock', NULL, 2),
(73, 'ffff', 'PROD-ffff-001', NULL, NULL, 1600, NULL, NULL, 'dddd', NULL, 'In stock', NULL, 2),
(74, 'fgfgf', 'PROD-fgfgf-001', NULL, NULL, 4444, NULL, NULL, 'fff', NULL, 'In stock', NULL, 2),
(75, 'dfdf', 'PROD-dfdf-001', NULL, NULL, 444, NULL, NULL, 'gfg', NULL, 'In stock', NULL, 2),
(76, 'fgrfg', 'PROD-fgrfg-001', NULL, NULL, 45454, NULL, NULL, 'hghgh', NULL, 'In stock', NULL, 1),
(77, 'test', 'PROD-test-002', NULL, NULL, 5000, NULL, NULL, 'test', NULL, 'In stock', NULL, 1),
(78, 'van 1', 'PROD-van1-001', NULL, NULL, 555, NULL, NULL, '555', NULL, 'In stock', NULL, 2),
(79, 'car 1', 'PROD-car1-001', NULL, NULL, 2322, NULL, NULL, '2222', NULL, 'In stock', NULL, 1),
(80, 'alto new ', 'PROD-altonew-001', NULL, NULL, 4000, NULL, NULL, '1000', NULL, 'In stock', NULL, 2);

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
(2, NULL, NULL, 20, '2025-04-14 01:54:25', NULL, NULL, 2, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-14 01:54:25', '2025-04-14 01:54:25', NULL, 6000, 4),
(3, NULL, NULL, 21, '2025-04-14 01:54:25', NULL, NULL, 2, NULL, 'sold', NULL, NULL, NULL, '', '2025-04-14 01:54:25', '2025-04-14 01:54:25', NULL, 1500, 1),
(6, 46, NULL, 20, '2025-04-14 15:10:00', NULL, NULL, 4, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-14 20:40:54', '2025-04-14 20:40:54', NULL, 6000, 1),
(7, 46, NULL, 20, '2025-04-14 15:28:00', NULL, NULL, 5, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-14 20:58:29', '2025-04-14 20:58:29', NULL, 6000, 1),
(8, 46, NULL, 20, '2025-04-15 00:58:00', NULL, NULL, 6, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 06:28:42', '2025-04-15 06:28:42', NULL, 6000, 1),
(9, 46, NULL, 21, '2025-04-15 01:25:00', NULL, NULL, 7, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 06:59:03', '2025-04-15 06:59:03', NULL, 1500, 1),
(10, 46, NULL, 67, '2025-04-15 01:25:00', NULL, NULL, 7, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 06:59:03', '2025-04-15 06:59:03', NULL, 200, 1),
(11, 46, NULL, 71, '2025-04-15 01:29:00', NULL, NULL, 8, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 07:00:06', '2025-04-15 07:00:06', NULL, 1500, 2),
(12, 46, NULL, 73, '2025-04-15 01:30:00', NULL, NULL, 9, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 07:00:26', '2025-04-15 07:00:26', NULL, 1600, 1),
(13, 46, NULL, 70, '2025-04-15 01:30:00', NULL, NULL, 10, 'partial', 'rent', NULL, NULL, NULL, '', '2025-04-15 07:00:52', '2025-04-15 07:00:52', NULL, 5555, 1),
(14, 46, NULL, 76, '2025-04-15 01:31:00', NULL, NULL, 11, 'paid', 'rent', NULL, NULL, NULL, '', '2025-04-15 07:01:19', '2025-04-15 07:01:19', NULL, 45454, 1);

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

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`storeId`, `storeName`, `storeAddress`, `storeStatus`) VALUES
(1, 'Sinha Rent a car and cab service ', 'Katugastota', 'Active');

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
(2, NULL, NULL, NULL, 25500, NULL, 500, 25000, 'cash', 24000, 1000, 20, '', '2025-04-14 01:54:25', '2025-04-14 01:54:25'),
(4, NULL, 46, NULL, 6000, 0, 0, 6000, 'cash', 1400, 4600, 20, '', '2025-04-14 15:10:00', '2025-04-14 21:35:08'),
(5, NULL, 46, NULL, 6000, 1000, 0, 7000, 'cash', 6000, 1000, 20, '', '2025-04-14 15:28:00', '2025-04-15 05:26:48'),
(6, NULL, 46, NULL, 6000, 400, 0, 6400, 'cash', 5000, 1400, 20, '', '2025-04-15 00:58:00', '2025-04-15 06:28:42'),
(7, NULL, 46, NULL, 1700, 300, 0, 2000, 'cash', 2000, 0, 21, '', '2025-04-15 01:25:00', '2025-04-15 06:59:20'),
(8, NULL, 46, NULL, 3000, 3000, 0, 6000, 'cash', 3000, 3000, 71, '', '2025-04-15 01:29:00', '2025-04-15 07:00:06'),
(9, NULL, 46, NULL, 1600, 0, 0, 1600, 'cash', 1600, 0, 73, '', '2025-04-15 01:30:00', '2025-04-15 07:01:43'),
(10, NULL, 46, NULL, 5555, 0, 0, 5555, 'cash', 0, 5555, 70, '', '2025-04-15 01:30:00', '2025-04-15 07:00:52'),
(11, NULL, 46, NULL, 45454, 0, 0, 45454, 'cash', 45454, 0, 76, '', '2025-04-15 01:31:00', '2025-04-15 07:01:19');

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
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `cusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

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
  MODIFY `duecustomerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expensesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

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
  MODIFY `salesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `storeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `transactionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`expensesCatId`) REFERENCES `expensescat` (`expensesCatId`),
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`cusId`) REFERENCES `customer` (`cusId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `invoiceproduct`
--
ALTER TABLE `invoiceproduct`
  ADD CONSTRAINT `invoiceproduct_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`invoiceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoiceproduct_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invoiceproduct_ibfk_3` FOREIGN KEY (`stockId`) REFERENCES `stock` (`stockId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_categoryId`) REFERENCES `category` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `returnitems`
--
ALTER TABLE `returnitems`
  ADD CONSTRAINT `returnitems_ibfk_1` FOREIGN KEY (`store_storeId`) REFERENCES `store` (`storeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `returnitems_ibfk_2` FOREIGN KEY (`user_userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `returnitems_ibfk_3` FOREIGN KEY (`invoice_invoiceId`) REFERENCES `invoice` (`invoiceId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `cusId` FOREIGN KEY (`cusId`) REFERENCES `customer` (`cusId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
