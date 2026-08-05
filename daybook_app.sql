-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jul 20, 2026 at 10:50 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `daybook_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `ec_categories`
--

CREATE TABLE `ec_categories` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ec_categories`
--

INSERT INTO `ec_categories` (`id`, `name`) VALUES
(1, 'Nature'),
(2, 'Little Bites'),
(5, 'Lovely Human'),
(6, 'Achievement'),
(7, 'Gratitude'),
(8, 'Everyday');

-- --------------------------------------------------------

--
-- Table structure for table `ec_entries`
--

CREATE TABLE `ec_entries` (
  `id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `reflection` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ec_entries`
--

INSERT INTO `ec_entries` (`id`, `title`, `reflection`, `image`, `category_id`, `created_at`) VALUES
(1, 'Morning Walk (Updated)', 'The weather was even better than yesterday.', 'morning-walk.jpg', 1, '2026-07-19 09:30:00'),
(2, 'New Matcha Spot', 'Tried a new café after class, super yum!', 'matcha.jpg', 2, '2026-07-18 15:00:00'),
(3, 'Family Dinner', 'We cooked together tonight and laughed a lot.', 'dinner.jpg', 5, '2026-07-17 19:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ec_categories`
--
ALTER TABLE `ec_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ec_entries`
--
ALTER TABLE `ec_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ec_categories`
--
ALTER TABLE `ec_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ec_entries`
--
ALTER TABLE `ec_entries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ec_entries`
--
ALTER TABLE `ec_entries`
  ADD CONSTRAINT `ec_entries_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `ec_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
