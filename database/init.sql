-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 03-06-2025 a las 17:28:29
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectofinalrocio2025`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250505172319', '2025-05-28 12:43:16', 523),
('DoctrineMigrations\\Version20250511161106', '2025-05-28 12:43:16', 255),
('DoctrineMigrations\\Version20250519105610', '2025-05-28 12:43:17', 90),
('DoctrineMigrations\\Version20250531153339', '2025-05-31 17:33:53', 289),
('DoctrineMigrations\\Version20250531183539', '2025-05-31 20:35:45', 128),
('DoctrineMigrations\\Version20250601092711', '2025-06-01 11:27:27', 637),
('DoctrineMigrations\\Version20250601142319', '2025-06-01 16:23:22', 213),
('DoctrineMigrations\\Version20250601150547', '2025-06-01 17:05:51', 242),
('DoctrineMigrations\\Version20250601182837', '2025-06-01 20:29:23', 323),
('DoctrineMigrations\\Version20250602162226', '2025-06-02 18:22:34', 189),
('DoctrineMigrations\\Version20250602165546', '2025-06-02 18:55:54', 94),
('DoctrineMigrations\\Version20250602225837', '2025-06-03 00:58:46', 201),
('DoctrineMigrations\\Version20250602232156', '2025-06-03 01:22:02', 131),
('DoctrineMigrations\\Version20250603093108', '2025-06-03 11:31:19', 254);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subcategory` tinyint(1) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `organizer_id` int NOT NULL,
  `stripe_product_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_price_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_3BAE0AA7876C4DDA` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event`
--

INSERT INTO `event` (`id`, `title`, `description`, `date`, `location`, `capacity`, `category`, `image`, `state`, `subcategory`, `price`, `organizer_id`, `stripe_product_id`, `stripe_price_id`, `lat`, `lng`) VALUES
(29, 'Louis Vuitton: Pasarela de Alta Costura 2025', 'Sumérgete en el mundo del lujo y la moda con el desfile exclusivo de Louis Vuitton. Una experiencia única donde la elegancia parisina cobra vida con las últimas creaciones de la maison.', '2025-03-18 11:00:00', ' C. José Meliá, 2, 29602 Marbella, Málaga', 100, 'Moda', 'https://turbologo.com/articles/wp-content/uploads/2020/01/louis-vuitton-ornament.png', 'Finalizado', 0, 50.00, 3, NULL, 'price_1RVrOzQ8pG8k7QKCvX0ZRlUX', 36.5085687, -4.9021271),
(30, 'Final UEFA Champions League 2025: PSG vs Inter', 'Dos gigantes del fútbol europeo se enfrentan en una batalla histórica por la gloria. El Paris Saint-Germain y el Inter de Milán lo darán todo en una final épica que promete emociones, pasión y fútbol del más alto nivel.', '2025-05-31 21:00:00', ' Franz-Beckenbauer-Platz 5, 80939 München, Alemania', 75000, 'Deporte', 'https://imagenes.20minutos.es/files/image_990_556/uploads/imagenes/2018/05/02/667339.jpg', 'Finalizado', 0, 200.00, 1, NULL, 'price_1RVsElQ8pG8k7QKCNv0POCaB', 48.2196297, 11.6249),
(31, 'Cine de Verano: Lilo & Stitch - Live Action 2025', 'La entrañable historia de amistad entre una niña hawaiana y un experimento extraterrestre regresa a la gran pantalla. Lilo & Stitch vuelven en una emocionante versión live action que combina nostalgia, risas y mucho \"ohana\".', '2025-07-16 19:00:00', 'C. Palencia, 22, Zaidín, 18007 Granada', 85, 'Cine y Teatro', 'https://heraldodepuebla.com/wp-content/uploads/2025/05/Lilo.jpg', 'Abierto', 0, 6.50, 1, NULL, 'price_1RVsR1Q8pG8k7QKC6BfFqoH3', 37.1595197, -3.5942135),
(32, 'Degustación Grupo Dani García', 'El mejor evento de degustacion ', '2025-07-16 15:00:00', ' Bulevar Principe Alfonso von Hohenlohe, s/n, 29602 Marbella, Málaga', 50, 'Gastronomía', 'https://www.gourmets.net/image/catalog/2020/Blog/Noticias/noviembre/dani-garcia.jpg', 'Abierto', 0, 150.00, 3, NULL, 'price_1RVvPPQ8pG8k7QKCPa9uKcpK', NULL, NULL),
(33, 'Concierto Karol G', 'Prepárate para una noche inolvidable con la Bichota. Karol G llega con toda su energía, éxitos globales y una puesta en escena espectacular. Vive el poder del reguetón y el pop latino en un show que celebra fuerza, amor y empoderamiento.', '2025-08-25 21:00:00', 'Av. Dr. Oloriz, 25, Beiro, 18012 Granada', 50, 'conference', 'https://wallpapers.com/images/hd/karol-g-solo-tusa-cover-14xth5dpmfnic3cv.jpg', 'Abierto', 0, 75.50, 3, NULL, 'price_1RVx2qQ8pG8k7QKCTvPuPKqf', 37.1890572, -3.6076533),
(34, 'II CARRERA SOLIDARIA MAYORAL', 'Corre por una buena causa en la segunda edición de la Carrera Solidaria Mayoral. Una jornada deportiva y familiar donde cada paso cuenta para apoyar proyectos sociales. Únete, colabora y forma parte del cambio con energía y corazón.', '2025-04-06 10:00:00', 'C. Héroe de Sostoa, 22, Distrito Centro, 29002, Málaga', 1200, 'Deporte', 'https://s2.abcstatics.com/abc/www/multimedia/espana/2025/04/24/maraton-madrid-kFSG-U708656124077k-1200x840@diario_abc.jpg', 'Finalizado', 1, 0.00, 2, NULL, NULL, NULL, NULL),
(35, 'Fashion Week Milan 2026', 'La capital del estilo abre sus puertas a las tendencias del futuro. Diseñadores de renombre, nuevas promesas y las pasarelas más icónicas se reúnen en una semana donde la moda dicta el ritmo del mundo. Milán te espera con arte, innovación y elegancia.', '2026-06-20 19:00:00', 'Piazza Gae Aulenti, 20124 Milano MI, Italia', 850, 'Moda', 'https://hips.hearstapps.com/hmg-prod/images/milan-fashion-week-67bc6351d51bc.jpg', 'Abierto', 1, 0.00, 2, NULL, NULL, 45.4834778, 9.1902248);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_favorite`
--

DROP TABLE IF EXISTS `event_favorite`;
CREATE TABLE IF NOT EXISTS `event_favorite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2E296709A76ED395` (`user_id`),
  KEY `IDX_2E29670971F7E88B` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_favorite`
--

INSERT INTO `event_favorite` (`id`, `user_id`, `event_id`) VALUES
(9, 1, 29),
(11, 3, 29),
(12, 3, 31);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_participant`
--

DROP TABLE IF EXISTS `event_participant`;
CREATE TABLE IF NOT EXISTS `event_participant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `joined_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_7C16B891A76ED395` (`user_id`),
  KEY `IDX_7C16B89171F7E88B` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event_participant`
--

INSERT INTO `event_participant` (`id`, `user_id`, `event_id`, `joined_at`) VALUES
(23, 3, 35, '2025-06-03 18:01:17'),
(24, 3, 31, '2025-06-03 19:01:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

DROP TABLE IF EXISTS `messenger_messages`;
CREATE TABLE IF NOT EXISTS `messenger_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  KEY `IDX_75EA56E016BA31DB` (`delivered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_date` date NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `roles`, `password`, `email`, `name`, `surname`, `birth_date`, `avatar`) VALUES
(1, 'RocioGavira', '[\"ROLE_USER\"]', '$2y$13$gxKg95Km107y1SVEVEsQ7OboqyJ1oI2x.zDpOMqwtvg3lRylaYily', 'rociogavira@gmail.com', 'Rocio', 'Gavira', '2002-08-30', 'https://bloygo.yoigo.com/embed/13afe11a2de813aad3fdc97e8f83214539a1532418373/Portada_RompeRalph.jpg'),
(2, 'Rocio', '[\"ROLE_USER\"]', '$2y$13$/wLKG1d2XY99TTkbHcUWsOZADpUT8oltv5.Sx82Sg34/tVj2NhgnS', 'rocio@ejemplo.com', 'Rocio', 'Gavira2', '2025-05-31', 'https://bloygo.yoigo.com/embed/13afe11a2de813aad3fdc97e8f83214539a1532418373/Portada_RompeRalph.jpg'),
(3, 'Admin', '[\"ROLE_ADMIN\"]', '$2y$13$o6r4Q6zDCsxbAdsrOVMfFukcVG0i5eJX2rRweoFrtqpGk/WgbTNFW', 'admin@gmail.com', 'Admin22', 'Admin', '2002-01-01', 'https://bloygo.yoigo.com/embed/13afe11a2de813aad3fdc97e8f83214539a1532418373/Portada_RompeRalph.jpg');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FK_3BAE0AA7876C4DDA` FOREIGN KEY (`organizer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_favorite`
--
ALTER TABLE `event_favorite`
  ADD CONSTRAINT `FK_2E29670971F7E88B` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_2E296709A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_participant`
--
ALTER TABLE `event_participant`
  ADD CONSTRAINT `FK_7C16B89171F7E88B` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_7C16B891A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

-- Añadir permisos para root
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '' WITH GRANT OPTION;
FLUSH PRIVILEGES;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
