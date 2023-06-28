-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 09, 2023 at 09:13 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `work_ams`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `role`) VALUES
(1, 'admin@tscs.com', 'password', 1);

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `day` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`id`, `day`, `date`, `name`, `createdAt`, `updatedAt`) VALUES
(3, 'Sunday', '2023-01-15', 'Tusu Pooja', '2023-05-30 05:17:43', '2023-05-30 05:17:43'),
(4, 'Monday', '2023-01-23', 'Netaji Subash Chandra Bose Jayanti', '2023-05-30 05:18:23', '2023-05-30 05:18:23'),
(5, 'Thursday', '2023-01-26', 'Republic Day', '2023-05-30 05:19:44', '2023-05-30 05:19:44'),
(6, 'Tuesday', '2023-01-31', 'Me-dam-me-phi', '2023-05-30 05:21:21', '2023-05-30 05:21:21'),
(7, 'Wednesday', '2023-03-08', 'Holi', '2023-05-30 05:21:56', '2023-05-30 05:21:56'),
(8, 'Friday', '2023-04-07', 'Good Friday', '2023-05-30 05:22:49', '2023-05-30 05:22:49'),
(9, 'Friday', '2023-04-15', 'Bohag Bihu', '2023-05-30 05:23:19', '2023-05-30 05:23:19'),
(10, 'Saturday', '2023-04-22', 'Eid-ul-Fitr', '2023-05-30 05:23:50', '2023-05-30 05:23:50'),
(11, 'Friday', '2023-05-05', 'Buddha Purnima', '2023-05-30 05:24:54', '2023-05-30 05:24:54'),
(12, 'Tuesday', '2023-08-15', 'Independance Day', '2023-05-30 05:26:11', '2023-05-30 05:26:11'),
(13, 'Monday', '2023-10-02', 'Gandhi Jayanti', '2023-05-30 05:26:44', '2023-05-30 05:26:44'),
(14, 'Saturday', '2023-10-21', 'Maha Saptami', '2023-05-30 05:27:33', '2023-05-30 05:27:33'),
(15, 'Sunday', '2023-10-22', 'Maha Ashtami', '2023-05-30 05:28:00', '2023-05-30 05:28:00'),
(16, 'Monday', '2023-10-23', 'Maha Navami', '2023-05-30 05:28:18', '2023-05-30 05:28:18'),
(17, 'Tuesday', '2023-10-24', 'Dussehra', '2023-05-30 05:30:18', '2023-05-30 05:30:18'),
(18, 'Sunday', '2023-11-12', 'Deepavali', '2023-05-30 05:31:24', '2023-05-30 05:31:24'),
(19, 'Monday', '2023-11-27', 'Guru Nanak Jayanti', '2023-05-30 05:32:00', '2023-05-30 05:32:00'),
(20, 'Monday', '2023-12-25', 'Christmas', '2023-05-30 05:32:29', '2023-05-30 05:32:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `emp_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_no` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT '''Active''',
  `role` int(11) NOT NULL DEFAULT 0,
  `user_image` varchar(255) DEFAULT NULL,
  `guardian_name` varchar(255) DEFAULT NULL,
  `dob` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `emp_id`, `first_name`, `last_name`, `email`, `contact_no`, `designation`, `address`, `password`, `status`, `role`, `user_image`, `guardian_name`, `dob`, `gender`, `religion`, `created_at`, `updated_at`, `deleted_at`) VALUES
(116, 'TCSC202300117', 'Jyotishmoy', 'Deka', 'zotizzmoydeka@gmail.com', '1232343454', 'Faculty', 'ewer', '$2a$10$tbb.U99gI50PyWs5RIKr5eDpA1mHty0pc8VKFqAsvUnyaurDxuBx.', 'Active', 0, 'https://attendance.takshashilascs.in/uploads/1684569774627-user_image.jpeg', 'ewsrew', 'waesdw', 'Male', NULL, NULL, NULL, NULL),
(117, 'TCSC202300118', 'Dipu', 'Kumar', 'dipum906@gmail.com', '1232343454', 'Faculty', 'ewer', '$2a$10$tbb.U99gI50PyWs5RIKr5eDpA1mHty0pc8VKFqAsvUnyaurDxuBx.', 'Active', 0, 'https://attendance.takshashilascs.in/uploads/1684569774627-user_image.jpeg', 'ewsrew', 'waesdw', 'Male', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_activities`
--

CREATE TABLE `users_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `activity` varchar(500) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_activities`
--

INSERT INTO `users_activities` (`id`, `user_id`, `date`, `activity`, `created_at`, `updated_at`) VALUES
(1, 116, '2023-05-20', 'erewrt', '2023-05-20 08:03:50.187554', '2023-05-20 08:03:50.187554'),
(2, 116, '2023-05-20', 'asedrfaserf', '2023-05-20 08:03:50.192537', '2023-05-20 08:03:50.192537');

-- --------------------------------------------------------

--
-- Table structure for table `user_attendences`
--

CREATE TABLE `user_attendences` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL DEFAULT 0,
  `location` varchar(255) NOT NULL,
  `in_date` date NOT NULL,
  `in_time` varchar(255) NOT NULL,
  `in_distance` varchar(255) NOT NULL,
  `out_date` varchar(30) NOT NULL DEFAULT '00-00-0000',
  `out_time` varchar(255) NOT NULL DEFAULT '',
  `out_distance` varchar(20) DEFAULT NULL,
  `status` varchar(11) NOT NULL,
  `attendance_status` varchar(255) NOT NULL DEFAULT 'absent',
  `type` int(11) NOT NULL DEFAULT 0,
  `msg` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_attendences`
--

INSERT INTO `user_attendences` (`id`, `user_id`, `student_id`, `location`, `in_date`, `in_time`, `in_distance`, `out_date`, `out_time`, `out_distance`, `status`, `attendance_status`, `type`, `msg`, `created_at`, `updated_at`) VALUES
(1, 116, 0, 'Guwahati', '2023-05-20', '1:31:42 PM', '2346', '2023-05-20', '1:33:48 PM', '2348', 'on-time', 'present', 0, 'yythgjk', '2023-05-20 08:01:42', '2023-05-20 08:03:50');

-- --------------------------------------------------------

--
-- Table structure for table `user_leaves`
--

CREATE TABLE `user_leaves` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `is_half_day` varchar(11) NOT NULL,
  `applied_on` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `document` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_leaves`
--

INSERT INTO `user_leaves` (`id`, `user_id`, `leave_type`, `is_half_day`, `applied_on`, `start_date`, `end_date`, `reason`, `status`, `document`) VALUES
(45, 116, 'casual', 'no', '2023-06-01', '2023-06-02', '2023-06-06', 'sick', 'cancelled', NULL),
(47, 117, 'casual', 'yes', '2023-06-05', '2023-06-07', '0000-00-00', 'sick', 'approved', NULL),
(49, 116, 'casual', 'yes', '2023-06-05', '2023-06-07', '0000-00-00', 'sick', 'approved', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_activities`
--
ALTER TABLE `users_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_attendences`
--
ALTER TABLE `user_attendences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_leaves`
--
ALTER TABLE `user_leaves`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `users_activities`
--
ALTER TABLE `users_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_attendences`
--
ALTER TABLE `user_attendences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_leaves`
--
ALTER TABLE `user_leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
