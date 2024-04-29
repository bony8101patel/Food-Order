-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 29, 2024 at 06:17 AM
-- Server version: 5.7.36
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
CREATE TABLE IF NOT EXISTS `blogs` (
  `blog_id` int(10) NOT NULL AUTO_INCREMENT,
  `blog_title` varchar(50) NOT NULL,
  `blog_desc` varchar(300) NOT NULL,
  `blog_images` varchar(200) NOT NULL,
  `published_date` date DEFAULT NULL,
  `blog_category` int(5) NOT NULL,
  `blog_status` int(3) NOT NULL DEFAULT '1',
  `user_id` int(5) NOT NULL,
  `user_role` int(1) NOT NULL DEFAULT '2',
  `is_active` int(2) NOT NULL DEFAULT '2',
  PRIMARY KEY (`blog_id`),
  UNIQUE KEY `blog_title` (`blog_title`),
  KEY `blog_category` (`blog_category`),
  KEY `user_id` (`user_id`),
  KEY `user_role` (`user_role`),
  KEY `blog_status` (`blog_status`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`blog_id`, `blog_title`, `blog_desc`, `blog_images`, `published_date`, `blog_category`, `blog_status`, `user_id`, `user_role`, `is_active`) VALUES
(2, 'Mindful Eating: Healthy Habits', 'Explore the principles of mindful eating and how they can transform your relationship with food, helping you make informed choices and savor each meal for better health and well-being.', '[\"1713542317106-Health.png\",\"1713542317109-Health1.png\",\"1713845772889-Health.png\"]', NULL, 2, 3, 2, 2, 1),
(3, 'Astronomy Basics: Stars and Constellations', 'Embark on a journey through the cosmos as you learn about the stars, constellations, and celestial phenomena, gaining a deeper understanding of the vast universe that surrounds us. abc.', '[\"1713707872834-Science1.png\",\"1713707872834-Science2.png\",\"1713845590519-science3.png\"]', '2024-04-11', 3, 2, 3, 2, 2),
(5, 'Overcoming Writer\'s Block: Quick Tips', 'Unleash your creativity with proven strategies to overcome writer\'s block, including exercises, prompts, and mindset shifts that will reignite your inspiration and keep your writing flowing.  ABC ABC abc', '[\"1713620662818-Writing.png\",\"1713620662820-Writing2.png\"]', '2024-04-20', 5, 3, 2, 2, 1),
(6, 'Navigating the Job Market: Insider Advice', 'Navigate the complexities of the job market with insider tips and expert advice on crafting a compelling resume, acing job interviews, and standing out to prospective employers in a competitive landscape.', '[\"1713679288749-Career.png\",\"1713679288753-Career1.png\"]', '2024-04-26', 6, 2, 2, 2, 2),
(8, 'Embracing Minimalism: Finding Happiness', 'Embark on a journey toward a simpler, more fulfilling life as you explore the principles of minimalism, declutter your surroundings, and prioritize what truly matters, leading to greater happiness and contentment.', '[\"1713681098853-Life.png\",\"1713681098855-Life1.png\",\"1713681098857-Life2.png\"]', '2024-04-24', 8, 2, 2, 2, 2),
(9, 'hjsdgn', 'sdfbhsdfbdb', '[\"1713940509969-productivity.png\"]', NULL, 4, 1, 2, 2, 2),
(10, 'From Couch to 5K: Beginner\'s Running Guide', 'Lace up your sneakers and embark on a journey to fitness with this beginner\'s guide to running, featuring easy-to-follow training plans, tips for staying motivated, and advice for preventing injury as you progress from a sedentary lifestyle to completing your first 5K race.', '[\"1714359265938-Fitness.png\",\"1714359265939-Fitness1.png\",\"1714359265940-Fitness2.png\"]', NULL, 11, 1, 2, 2, 1),
(11, 'Digital Detox: Unplug and Recharge', 'Discover the importance of reducing screen time and embracing digital detoxification to enhance mental well-being and productivity. Learn practical tips for unplugging and finding balance in a hyperconnected world.', '[\"1714359445774-Detox.png\",\"1714359445775-Detox1.png\"]', NULL, 8, 1, 2, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `blog_status`
--

DROP TABLE IF EXISTS `blog_status`;
CREATE TABLE IF NOT EXISTS `blog_status` (
  `blog_status_id` int(3) NOT NULL AUTO_INCREMENT,
  `blog_status` varchar(15) NOT NULL,
  PRIMARY KEY (`blog_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blog_status`
--

INSERT INTO `blog_status` (`blog_status_id`, `blog_status`) VALUES
(1, 'pending'),
(2, 'published'),
(3, 'rejected');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(5) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Productivity'),
(2, 'Health'),
(3, 'Science'),
(4, 'Food'),
(5, 'Writing'),
(6, 'Career'),
(7, 'Self-Improvement'),
(8, 'Life-Style'),
(9, 'Space'),
(10, 'Fun'),
(11, 'Fitness');

-- --------------------------------------------------------

--
-- Table structure for table `is_active`
--

DROP TABLE IF EXISTS `is_active`;
CREATE TABLE IF NOT EXISTS `is_active` (
  `is_active_id` int(2) NOT NULL AUTO_INCREMENT,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`is_active_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `is_active`
--

INSERT INTO `is_active` (`is_active_id`, `status`) VALUES
(1, 'inactive'),
(2, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(5) NOT NULL AUTO_INCREMENT,
  `user_firstname` varchar(20) NOT NULL,
  `user_lastname` varchar(20) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `password` varchar(300) NOT NULL,
  `user_contact_no` varchar(13) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `user_dob` date NOT NULL,
  `user_role` int(1) NOT NULL DEFAULT '2',
  `is_active` int(2) DEFAULT '2',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `user_role` (`user_role`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_firstname`, `user_lastname`, `user_email`, `password`, `user_contact_no`, `user_name`, `user_dob`, `user_role`, `is_active`) VALUES
(1, 'vedangi', 'patel', 'vedangipatel.netclues@gmail.com', '$2b$10$JvrHZUr7erseId3x5Er2HOCKsAbnvzy7M.hOzRrvS4HecTkpZmCKi', '897541250', 'vedangi_patel', '2001-10-09', 1, 2),
(2, 'dinky', 'jani', 'jdinky.netclues@gmail.com', '$2b$10$2DxeVN6Yfme43mZt.4ccG..Icax2k08vqhFVXAFeZo0F/4y1BVuTC', '8975451023', 'dinky_jani', '2024-04-19', 2, 2),
(3, 'isha', 'patel', 'ishap8849@gmail.com', '$2b$10$eM9cUy0eqd74M5SbQLCFg.1U6wVeIqiQrFaGSU6kZwmKWOBc7oueW', '8974565640', 'aneri_patel', '2002-12-01', 2, 2),
(5, 'jenny', 'shah', 'jenny123@gmail.com', '$2b$10$ZKwf/.Vij2i/2vC0/QVbEe7XfShyT9bRrelYJL5qOpNNTnpJOm8R6', '8945756210', 'jenny_shah', '1999-05-26', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
CREATE TABLE IF NOT EXISTS `user_type` (
  `user_type_id` int(2) NOT NULL,
  `user_type` varchar(5) NOT NULL,
  PRIMARY KEY (`user_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`user_type_id`, `user_type`) VALUES
(1, 'admin'),
(2, 'user');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `blogs_ibfk_3` FOREIGN KEY (`user_role`) REFERENCES `user_type` (`user_type_id`),
  ADD CONSTRAINT `blogs_ibfk_4` FOREIGN KEY (`blog_status`) REFERENCES `blog_status` (`blog_status_id`),
  ADD CONSTRAINT `blogs_ibfk_5` FOREIGN KEY (`blog_category`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `blogs_ibfk_6` FOREIGN KEY (`is_active`) REFERENCES `is_active` (`is_active_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_role`) REFERENCES `user_type` (`user_type_id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`is_active`) REFERENCES `is_active` (`is_active_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
