-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 04:18 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `forum_kesiswaan`
--
CREATE DATABASE IF NOT EXISTS `forum_kesiswaan` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `forum_kesiswaan`;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `event` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `content` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `gallery` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `school`, `event`, `date`, `content`, `thumbnail`, `gallery`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Lomba Kebersihan Antar Sekolah', 'SMK Negeri 1 Cimahi', 'Lomba', '2024-08-15', '<h2>Kegiatan Lomba Kebersihan</h2><p>Kegiatan lomba kebersihan ini bertujuan untuk meningkatkan kesadaran para siswa akan pentingnya kebersihan lingkungan sekolah. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl risus, sodales eu sem vel, fermentum suscipit justo. Nam ut ex ut orci placerat ultrices non vel quam. Aenean ac nisi vitae felis eleifend lobortis. Donec convallis fermentum arcu, eu maximus ex facilisis quis. Vivamus vitae dui ut ex convallis aliquam ultricies sit amet dui. Vivamus sed laoreet diam, non auctor arcu. Sed sodales quam id semper tincidunt. Phasellus lobortis porta faucibus. Vestibulum eu mauris urna.</p><p>Lomba ini melibatkan seluruh jurusan di sekolah dengan kriteria penilaian meliputi:</p><ul><li><p>Kebersihan</p></li><li><p>Kerapihan</p></li><li><p>Kreativitas dalam mendekorasi ruang belajar</p></li><li><p>Kebersihan kamar mandi</p></li></ul><p>Pemenang akan diumumkan pada akhir lomba dan diberikan penghargaan berupa piala untuk juara 1, 2, dan 3.</p><img src=\"https://picsum.photos/id/1018/800/600\" alt=\"Dokumentasi Lomba\"><p>\',</p>', 'https://49kh46vd2i.ufs.sh/f/aFr7XWCLE5Q0oZHmtpGzOAc5fJ0xDwvSinbMTF9YyjE8Rmez', '[{\"original\":\"https://picsum.photos/id/1018/800/600\",\"thumbnail\":\"https://picsum.photos/id/1018/200/150\"},{\"original\":\"https://picsum.photos/id/1025/800/600\",\"thumbnail\":\"https://picsum.photos/id/1025/200/150\"}]', 'published', '2025-05-02 02:45:00', '2025-05-10 01:43:04'),
(3, 'Pengumuman', 'SMKN 1 CIMAHI', 'Pengumuman', '2025-04-17', '<p><strong>INI ADALAH PENGUMUMAN</strong></p><img src=\"http://localhost:3000/uploads/file-1746669521483-163103578.jpg\">', 'http://localhost:3000/uploads/thumbnail-1746173709796-217767398.jpeg', '[\"http://localhost:3000/uploads/gallery-1746173709802-408080140.jpg\",\"http://localhost:3000/uploads/gallery-1746173709812-644383428.jpg\"]', 'draft', '2025-05-02 08:15:09', '2025-05-10 01:42:25'),
(13, 'ANOTHER TESTING', 'SMKN 1 Cimahi', 'Pengumuman', '2025-05-05', '<p>Hopefully the date handling and blog submission is <strong>FIXED</strong> after or else I\'m losing my mind</p>', 'http://localhost:3000/uploads/thumbnail-1746439609469-470537265.jpg', '[\"http://localhost:3000/uploads/gallery-1746439609484-103914233.jpeg\"]', 'draft', '2025-05-05 10:06:49', '2025-05-05 10:27:23'),
(20, 'Yes', 'SMAN 1 Cimahi', 'Festival', '2025-05-26', '<p>nothing is here</p>', NULL, '[]', 'draft', '2025-05-07 01:33:15', '2025-05-07 01:37:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `no_hp` varchar(20) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `no_hp`, `full_name`, `school`, `created_at`, `updated_at`) VALUES
(1, 'admin@sekolah.com', '$2a$10$qwvh6sZP867ZP7jkHuIy4.bJcjwzNUxsOnRBUIE.M/LkwbOlcXa96', 'admin', '+628123456789', 'Admin Sekolah', 'SMK Negeri 1', '2025-03-10 03:15:23', '2025-04-04 12:35:57'),
(2, 'dimasfaiz@gmail.com', '$2b$10$ejkNNOdLBvcmSDxul7ZiD.MNO9z8rL3IiR2nyiwxQnhdHq9czIjZe', 'admin', '0812345678', 'Dimas', 'SMKN 1 Cimahi', '2025-04-28 06:09:44', '2025-04-29 01:07:51'),
(3, 'test@email.com', '$2b$10$exhpbkue93D9a9SPsFEOq./AvIUkp2gpruOVxB1m1xmDgz8AIruw.', 'user', '08123456789', 'test', 'SMKN 2 Cimahi ', '2025-04-29 01:09:13', '2025-04-29 06:26:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
