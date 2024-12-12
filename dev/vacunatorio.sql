-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2024 a las 03:24:45
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vacunatorio`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT1` (IN `fecha_inicio` DATE, IN `fecha_fin` DATE)   BEGIN
	SELECT c.laboratorio AS laboratorio, SUM(c.cant) AS cantidad
    FROM(
        SELECT labs.nombre AS laboratorio, l.cantidad cant
        FROM lotes AS l
        INNER JOIN vacunas AS v 
            ON l.vacunaId = v.id
        INNER JOIN laboratorios AS labs 
            ON labs.id = v.laboratorioId
        WHERE l.fechaCompra BETWEEN fecha_inicio AND fecha_fin

        UNION ALL

        SELECT labs.nombre AS laboratorio, sl.cantidad cant
        FROM sublotes AS sl
        INNER JOIN lotes AS l
            ON sl.loteId = l.id
        INNER JOIN vacunas AS v 
            ON l.vacunaId = v.id
        INNER JOIN laboratorios AS labs 
            ON labs.id = v.laboratorioId
        WHERE l.fechaCompra BETWEEN fecha_inicio AND fecha_fin

        UNION ALL

        SELECT labs.nombre AS laboratorio, dp.cantidad cant
        FROM distribuciones_provinciales AS dp
        INNER JOIN minilotes AS ml
            ON dp.miniloteId = ml.id
        INNER JOIN sublotes AS sl
            ON ml.subloteId = sl.id
        INNER JOIN lotes AS l
            ON sl.loteId = l.id
        INNER JOIN vacunas AS v 
            ON l.vacunaId = v.id
        INNER JOIN laboratorios AS labs 
            ON labs.id = v.laboratorioId
        WHERE l.fechaCompra BETWEEN fecha_inicio AND fecha_fin

        UNION ALL

        SELECT lab.nombre AS laboratorio, COUNT(vacs.id) AS cant
        FROM vacunaciones AS vacs
        INNER JOIN minilotes AS ml
            ON vacs.miniloteId = ml.id
        INNER JOIN sublotes AS sl
            ON ml.subloteId = sl.id
        INNER JOIN lotes AS l
            ON sl.loteId = l.id
        INNER JOIN vacunas AS v
            ON l.vacunaId = v.id
        INNER JOIN laboratorios AS lab
            ON v.laboratorioId = lab.id
        WHERE l.fechaCompra BETWEEN fecha_inicio AND fecha_fin
        GROUP BY laboratorio
    ) AS c
    GROUP BY laboratorio
    ORDER BY laboratorio ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT2` ()   BEGIN
	SELECT 
        COALESCE(n.tipo_vacuna, p.tipo_vacuna, c.tipo_vacuna, vd.tipo_vacuna, vv.tipo_vacuna, va.tipo_vacuna) AS tipo_vacuna,
        IFNULL(n.en_nacion, 0) AS en_nacion,
        IFNULL(p.en_provincia, 0) AS en_provincia,
        IFNULL(c.en_centros_vacunac, 0) AS en_centros_vacunac,
        IFNULL(vd.descartadas, 0) AS descartadas,
        IFNULL(vv.vencidas, 0) AS vencidas,
        IFNULL(va.aplicadas, 0) AS aplicadas
    FROM 
        -- Subconsulta para obtener el total en Nación
        (SELECT tp.tipo AS tipo_vacuna, SUM(l.cantidad) AS en_nacion
         FROM lotes AS l
         INNER JOIN vacunas AS v ON l.vacunaId = v.id AND l.descarteId IS NULL
         INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
         GROUP BY tipo_vacuna) AS n
    LEFT JOIN 
        -- Subconsulta para obtener el total en Provincia
        (SELECT tp.tipo AS tipo_vacuna, SUM(sl.cantidad) AS en_provincia
         FROM lotes AS l
         INNER JOIN sublotes AS sl ON sl.loteId = l.id AND sl.descarteId IS NULL
         INNER JOIN vacunas AS v ON l.vacunaId = v.id AND l.descarteId IS NULL
         INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
         GROUP BY tipo_vacuna) AS p 
    ON n.tipo_vacuna = p.tipo_vacuna
    LEFT JOIN 
        -- Subconsulta para obtener el total en Centros de Vacunación
        (SELECT tp.tipo AS tipo_vacuna, SUM(dp.cantidad) AS en_centros_vacunac
         FROM lotes AS l
         INNER JOIN sublotes AS sl ON sl.loteId = l.id AND sl.descarteId IS NULL
         INNER JOIN minilotes AS ml ON ml.subloteId = sl.id
         INNER JOIN distribuciones_provinciales AS dp ON dp.miniloteId = ml.id AND dp.descarteId IS NULL
         INNER JOIN vacunas AS v ON l.vacunaId = v.id AND l.descarteId IS NULL
         INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
         GROUP BY tipo_vacuna) AS c
    ON n.tipo_vacuna = c.tipo_vacuna OR p.tipo_vacuna = c.tipo_vacuna
    LEFT JOIN
    	-- Subconsulta para obtener el total de vacunas descartadas
        (SELECT tipo_vacuna, SUM(descartadas) AS descartadas
        FROM (SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(l.cantidad, 0)) AS descartadas
                FROM lotes AS l
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON l.descarteId = d.id AND d.motivo != "VENCIMIENTO"
                GROUP BY tipo_vacuna

        UNION

            SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(sl.cantidad, 0)) AS descartadas
                FROM sublotes AS sl
                INNER JOIN lotes AS l ON l.id = sl.loteId
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON sl.descarteId = d.id AND d.motivo != "VENCIMIENTO"
                GROUP BY tipo_vacuna

        UNION

            SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(dp.cantidad, 0)) AS descartadas
                FROM distribuciones_provinciales AS dp
                INNER JOIN minilotes AS ml ON ml.id = dp.miniloteId
                INNER JOIN sublotes AS sl ON sl.id = ml.subloteId
                INNER JOIN lotes AS l ON l.id = sl.loteId
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON dp.descarteId = d.id AND d.motivo != "VENCIMIENTO"
                GROUP BY tipo_vacuna) AS descartes_totales
        GROUP BY tipo_vacuna) AS vd
    ON vd.tipo_vacuna IN (n.tipo_vacuna, c.tipo_vacuna, p.tipo_vacuna)
    LEFT JOIN
    	-- Subconsulta para obtener el total de vacunas vencidas
        (SELECT tipo_vacuna, SUM(vencidas) AS vencidas
        FROM (SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(l.cantidad, 0)) AS vencidas
                FROM lotes AS l
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON l.descarteId = d.id AND d.motivo = "VENCIMIENTO"
                GROUP BY tipo_vacuna

        UNION

            SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(sl.cantidad, 0)) AS vencidas
                FROM sublotes AS sl
                INNER JOIN lotes AS l ON l.id = sl.loteId
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON sl.descarteId = d.id AND d.motivo = "VENCIMIENTO"
                GROUP BY tipo_vacuna

        UNION

            SELECT tp.tipo AS tipo_vacuna, SUM(IFNULL(dp.cantidad, 0)) AS vencidas
                FROM distribuciones_provinciales AS dp
                INNER JOIN minilotes AS ml ON ml.id = dp.miniloteId
                INNER JOIN sublotes AS sl ON sl.id = ml.subloteId
                INNER JOIN lotes AS l ON l.id = sl.loteId
                INNER JOIN vacunas AS v ON l.vacunaId = v.id
                INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
                INNER JOIN descartes AS d ON dp.descarteId = d.id AND d.motivo = "VENCIMIENTO"
                GROUP BY tipo_vacuna) AS vencidas_totales
        GROUP BY tipo_vacuna) AS vv
    ON vv.tipo_vacuna IN (n.tipo_vacuna, c.tipo_vacuna, p.tipo_vacuna, vd.tipo_vacuna)
    LEFT JOIN
    	-- Subconsulta para obtener el total de vacunas aplicadas
        (SELECT tp.tipo AS tipo_vacuna, COUNT(*) AS aplicadas
            FROM vacunaciones AS vac
            INNER JOIN minilotes AS ml ON vac.miniloteId = ml.id
            INNER JOIN sublotes AS sl ON ml.subloteId = sl.id
            INNER JOIN lotes AS l ON sl.loteId = l.id
            INNER JOIN vacunas AS v ON l.vacunaId = v.id
            INNER JOIN tipos_vacunas AS tp ON v.tipoVacunaId = tp.id
         GROUP BY tipo_vacuna) AS va
    ON va.tipo_vacuna IN (n.tipo_vacuna, c.tipo_vacuna, p.tipo_vacuna, vd.tipo_vacuna, vv.tipo_vacuna);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT3` ()   BEGIN
	SELECT p.nombre AS provincia
        , tp.tipo AS tipo_vacuna
    	, SUM(sl.cantidad) AS stock
    FROM sublotes AS sl
    INNER JOIN provincias AS p 
    	ON sl.provinciaId = p.id
    INNER JOIN lotes AS l
    	ON sl.loteId = l.id
    INNER JOIN vacunas AS v 
    	ON l.vacunaId = v.id
    INNER JOIN tipos_vacunas AS tp 
    	ON v.tipoVacunaId = tp.id
    WHERE sl.descarteId IS NULL
    GROUP BY provincia, tipo_vacuna;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT4` ()   BEGIN
	SELECT prov.nombre AS provincia, centro, tipo_vacuna, paciente
    FROM (
    	SELECT sl.provinciaId AS provincia, cv.nombre AS centro, tp.tipo AS tipo_vacuna, CONCAT(p.nombres, " - ", p.dni) AS paciente
        FROM vacunaciones AS vacs
        INNER JOIN pacientes AS p 
        	ON vacs.pacienteId = p.id
        INNER JOIN centros_vacunacion AS cv 
        	ON vacs.centroId = cv.id
        INNER JOIN minilotes AS ml 
        	ON vacs.miniloteId = ml.id
        INNER JOIN sublotes AS sl 
        	ON ml.subloteId = sl.id
        INNER JOIN lotes AS l 
        	ON sl.loteId = l.id
        INNER JOIN vacunas AS v 
        	ON l.vacunaId = v.id
        INNER JOIN tipos_vacunas AS tp 
        	ON v.tipoVacunaId = tp.id
        WHERE l.vencimiento < vacs.fecha
    ) AS cslt
    INNER JOIN provincias AS prov ON cslt.provincia = prov.id
    GROUP BY provincia, centro, tipo_vacuna;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT5_POR_CENTRO` ()   BEGIN
	SELECT l.nroLote AS lote_proveedor
        , cv.nombre AS centro
        , SUM(dp.cantidad) AS cantidad
    FROM distribuciones_provinciales AS dp
    INNER JOIN minilotes AS ml
        ON dp.miniloteId = ml.id
    INNER JOIN sublotes AS sl
        ON ml.subloteId = sl.id
    INNER JOIN lotes AS l
        ON sl.loteId = l.id
    INNER JOIN centros_vacunacion AS cv
        ON dp.centroId = cv.id
    WHERE l.vencimiento <  CURRENT_DATE AND dp.descarteId IS NULL
    GROUP BY lote_proveedor, centro
    ORDER BY 1, 2;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT5_POR_DEPOSITO` ()   BEGIN
    SELECT l.nroLote AS nro_lote
    	, dn.nombre AS deposito
    	, l.cantidad AS cantidad
    FROM lotes AS l
    INNER JOIN depositos_nacionales AS dn
        ON l.depositoId = dn.id
	WHERE l.vencimiento < CURRENT_DATE AND l.descarteId IS NULL;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT5_POR_PROVINCIA` ()   BEGIN
	SELECT l.nroLote AS lote_proveedor
        , p.nombre AS provincia
        , SUM(sl.cantidad) AS cantidad
    FROM sublotes AS sl
    INNER JOIN lotes AS l
        ON sl.loteId = l.id
    INNER JOIN provincias AS p
        ON sl.provinciaId = p.id
    WHERE l.vencimiento < CURRENT_DATE AND sl.descarteId IS NULL
    GROUP BY lote_proveedor, provincia
    ORDER BY 1, 2;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_CSLT6` ()   BEGIN
	SELECT tp.tipo AS tipo_vacuna, p.nombre AS provincia, locs.nombre AS localidad, COUNT(pacienteId) AS cantidad_pacietnes
    FROM vacunaciones AS vacs
    INNER JOIN pacientes AS pac ON vacs.pacienteId = pac.id
    INNER JOIN localidades AS locs ON pac.localidadId = locs.id
    INNER JOIN provincias AS p ON locs.provinciaId = p.id
    INNER JOIN minilotes AS ml ON vacs.miniloteId = ml.id
    INNER JOIN sublotes AS sl on ml.subloteId = sl.id
    INNER JOIN lotes AS l ON sl.loteId = l.id
    INNER JOIN vacunas AS v ON l.vacunaId = v.id
    INNER JOIN tipos_vacunas AS tp on v.tipoVacunaId = tp.id
    GROUP BY tipo_vacuna, provincia, localidad;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_vacunacion`
--

CREATE TABLE `centros_vacunacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `localidadId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `centros_vacunacion`
--

INSERT INTO `centros_vacunacion` (`id`, `nombre`, `localidadId`) VALUES
(1, 'Centro Vacunacion A', 1),
(2, 'Centro Vacunacion B', 2),
(3, 'Centro Vacunacion C', 3),
(4, 'Centro Vacunacion D', 4),
(5, 'Centro Vacunacion E', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `depositos_nacionales`
--

CREATE TABLE `depositos_nacionales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `depositos_nacionales`
--

INSERT INTO `depositos_nacionales` (`id`, `nombre`) VALUES
(1, 'Deposito Nacional A'),
(2, 'Deposito Nacional B'),
(3, 'Deposito Nacional C');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `descartes`
--

CREATE TABLE `descartes` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` enum('VENCIMIENTO','ROTURA','PERDIDA DE FRIO') NOT NULL,
  `formaDescarte` enum('INCINERACION','OTRO') NOT NULL,
  `personalId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `descartes`
--

INSERT INTO `descartes` (`id`, `fecha`, `motivo`, `formaDescarte`, `personalId`) VALUES
(1, '2024-11-19', 'VENCIMIENTO', 'INCINERACION', 20),
(2, '2024-11-19', 'ROTURA', 'INCINERACION', 19),
(3, '2024-11-19', 'VENCIMIENTO', 'INCINERACION', 20),
(4, '2024-11-19', 'PERDIDA DE FRIO', 'INCINERACION', 18),
(5, '2024-11-19', 'VENCIMIENTO', 'INCINERACION', 22),
(6, '2024-11-19', 'ROTURA', 'INCINERACION', 28),
(7, '2024-11-19', 'PERDIDA DE FRIO', 'INCINERACION', 30),
(8, '2024-11-19', 'ROTURA', 'INCINERACION', 23),
(9, '2023-11-14', 'VENCIMIENTO', 'INCINERACION', 21),
(10, '2023-11-15', 'VENCIMIENTO', 'INCINERACION', 24),
(11, '2024-11-23', 'VENCIMIENTO', 'INCINERACION', 28),
(12, '2024-12-11', 'VENCIMIENTO', 'OTRO', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distribuciones_provinciales`
--

CREATE TABLE `distribuciones_provinciales` (
  `id` int(11) NOT NULL,
  `fechaSalida` date NOT NULL,
  `fechaLlegada` date NOT NULL,
  `redistribuidoPor` int(11) DEFAULT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `miniloteId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `centroId` int(11) DEFAULT NULL,
  `descarteId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `distribuciones_provinciales`
--

INSERT INTO `distribuciones_provinciales` (`id`, `fechaSalida`, `fechaLlegada`, `redistribuidoPor`, `cantidad`, `miniloteId`, `centroId`, `descarteId`) VALUES
(1, '2024-11-16', '2024-11-16', NULL, 999, '77afcc8f-e6ae-40cb-a5fb-e85665594673', 1, NULL),
(2, '2024-11-16', '2024-11-16', NULL, 998, 'b8163a0d-16fe-472c-a638-e1c6328388ff', 1, NULL),
(3, '2024-11-16', '2024-11-16', NULL, 974, '89cd38bf-978b-47b1-be11-74b5dbfd909c', 2, NULL),
(4, '2024-11-16', '2024-11-16', NULL, 999, '8181a8d1-546b-4369-a9f2-1d5e6f66426e', 2, NULL),
(5, '2024-11-16', '2024-11-16', NULL, 1000, 'd25a6820-2e13-4eec-8c46-79fc21b083ff', 2, 5),
(6, '2024-11-16', '2024-11-16', NULL, 999, '69ebc440-d337-4e9a-8e2d-c4eae27b28c4', 3, NULL),
(7, '2024-11-16', '2024-11-16', NULL, 1000, '23632129-504f-4bef-bb2e-d30da00f5c52', 3, 12),
(8, '2024-11-16', '2024-11-16', NULL, 999, 'b27d541b-b444-42a3-bd22-8fccac42da43', 3, NULL),
(9, '2024-11-16', '2024-11-16', NULL, 998, '2d7810f8-ac87-402a-b9e9-1fa0e58ebc4a', 4, NULL),
(10, '2024-11-16', '2024-11-16', NULL, 998, '015b4224-0bc1-4283-ab04-84cfb1586433', 4, NULL),
(11, '2024-11-16', '2024-11-16', NULL, 999, '6726a4f1-0acb-42a2-940f-480691baf7dd', 4, NULL),
(12, '2024-11-16', '2024-11-16', NULL, 999, '0f820403-a09e-4d26-b46a-fab27296f99a', 4, NULL),
(17, '2024-11-19', '2024-11-19', NULL, 1000, 'd25a6820-2e13-4eec-8c46-79fc21b083ff', 3, 6),
(18, '2024-11-19', '2024-11-19', NULL, 999, '015b4224-0bc1-4283-ab04-84cfb1586433', 2, NULL),
(19, '2022-10-18', '2022-10-18', NULL, 3000, 'f09f552f-a9d4-11ef-b3e4-2cf05d0b6d76', 1, NULL),
(20, '2022-10-18', '2022-10-18', NULL, 3000, 'f09f5dc6-a9d4-11ef-b3e4-2cf05d0b6d76', 1, 10),
(21, '2022-10-18', '2022-10-18', NULL, 3000, 'f09f631c-a9d4-11ef-b3e4-2cf05d0b6d76', 2, NULL),
(22, '2022-10-18', '2022-10-18', NULL, 1000, '6aed01d1-a9da-11ef-b3e4-2cf05d0b6d76', 1, NULL),
(23, '2024-12-11', '2024-12-11', NULL, 750, 'e5e58912-97fb-44e3-a90a-a1742620a156', 3, NULL),
(24, '2024-12-11', '2024-12-11', 2, 25, '89cd38bf-978b-47b1-be11-74b5dbfd909c', 5, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `laboratorios`
--

CREATE TABLE `laboratorios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `paisId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `laboratorios`
--

INSERT INTO `laboratorios` (`id`, `nombre`, `paisId`) VALUES
(1, 'El Bayern', 2),
(2, 'Laboratorio Yankee', 1),
(3, 'Laboratorio Nipon', 3),
(4, 'Laboratorio Ruso', 4),
(5, 'Laboratorio Ingles', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `provinciaId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`id`, `nombre`, `provinciaId`) VALUES
(1, 'Junin', 1),
(2, 'General Pinto', 1),
(3, 'Cordoba', 10),
(4, 'Villa Mercedes', 11),
(5, 'Santa Rosa', 12),
(6, 'Palermo', 24),
(7, 'Mendoza', 13),
(8, 'Villa Carlos Paz', 10),
(9, 'Las Heras', 13),
(10, 'Retiro', 24),
(11, 'San Luis', 11),
(12, 'Vedia', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nroLote` varchar(255) NOT NULL,
  `vencimiento` date NOT NULL,
  `fechaFabricacion` date NOT NULL,
  `fechaCompra` date NOT NULL,
  `fechaAdquisicion` date NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `vacunaId` int(11) DEFAULT NULL,
  `depositoId` int(11) DEFAULT NULL,
  `descarteId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id`, `nroLote`, `vencimiento`, `fechaFabricacion`, `fechaCompra`, `fechaAdquisicion`, `cantidad`, `vacunaId`, `depositoId`, `descarteId`) VALUES
('0be10794-7a84-4654-a63b-764edbfccc39', 'L2024-11-15/14:05:10', '2025-08-19', '2024-11-14', '2024-11-15', '2024-11-15', 1000000, 6, 1, 8),
('21694e38-61b7-46d1-8b74-c815f878a75c', 'L2024-11-15/14:12:22', '2024-12-16', '2024-11-15', '2024-11-15', '2024-11-15', 980000, 4, 2, NULL),
('26af2680-1423-4afa-a039-3ba964e23c1d', 'L2024-11-15/14:05:22', '2024-12-04', '2024-11-14', '2024-11-15', '2024-11-15', 940000, 8, 1, NULL),
('31cc22e8-a9ea-11ef-b3e4-2cf05d0b6d76', 'L2024-11-23/19:26:00', '2024-10-09', '2024-09-11', '2024-10-02', '2024-10-02', 110000, 4, 2, 11),
('41b1802f-2f91-4beb-bc0b-170cf5dd13a3', 'L2024-11-15/14:05:27', '2025-05-03', '2024-11-15', '2024-11-15', '2024-11-15', 1000000, 9, 1, NULL),
('42b12810-7950-4c3d-af35-f376b623dca0', 'L2024-11-15/14:12:59', '2025-08-21', '2024-11-15', '2024-11-15', '2024-11-15', 940000, 5, 3, 1),
('437c5277-416d-4086-9c42-b21dce6b2383', 'L2024-11-15/14:06:15', '2025-04-03', '2024-11-15', '2024-11-15', '2024-11-15', 920000, 4, 1, NULL),
('43c711d9-6674-40a6-96dd-cb712ec85d06', 'L2024-12-12/02:04:33', '2025-08-04', '2024-12-11', '2024-12-11', '2024-12-11', 487500, 10, 2, NULL),
('7940a495-a9b9-4159-8a1c-fb90d7c8d11e', 'L2024-11-15/14:12:27', '2025-03-25', '2024-11-15', '2024-11-15', '2024-11-15', 960000, 8, 2, NULL),
('8c6b3b16-81ee-4ab0-90bf-840251dc7135', 'L2024-11-15/14:05:06', '2025-04-04', '2024-11-14', '2024-11-15', '2024-11-15', 960000, 5, 1, NULL),
('91ce01b7-b748-41ee-a47f-fd05258b37af', 'L2024-11-15/14:05:03', '2024-11-14', '2024-11-14', '2024-11-15', '2024-11-15', 940000, 1, 1, NULL),
('9b523991-90bf-4576-a3d7-395d3cc0c0b6', 'L2024-11-15/14:13:07', '2025-06-16', '2024-11-14', '2024-11-15', '2024-11-15', 960000, 6, 3, NULL),
('b0a2a05d-122b-4bcf-80bc-24cfd48c7f37', 'L2024-11-15/14:09:18', '2025-04-13', '2024-11-15', '2024-11-15', '2024-11-15', 1000000, 1, 1, 2),
('bc70505d-143a-4806-a2b9-d70ef597db97', 'L2024-11-15/14:12:33', '2025-09-03', '2024-11-14', '2024-11-15', '2024-11-15', 940000, 7, 2, NULL),
('be578051-a9d3-11ef-b3e4-2cf05d0b6d76', 'L2024-11-23/16:45:00', '2023-11-13', '2022-09-20', '2022-10-12', '2022-10-13', 100000, 3, 3, NULL),
('c1997b49-09ca-438b-8e60-e5357185c8bc', 'L2024-11-15/14:12:49', '2024-12-23', '2024-11-14', '2024-11-15', '2024-11-15', 980000, 8, 3, NULL),
('c212c948-0266-4d44-972c-9f6359c323aa', 'L2024-11-15/14:09:02', '2025-11-12', '2024-11-15', '2024-11-15', '2024-11-15', 1000000, 1, 1, NULL),
('f11bbdfb-5afb-4ea7-aecf-acb4eb7a1144', 'L2024-11-15/14:12:43', '2025-01-08', '2024-11-14', '2024-11-15', '2024-11-15', 980000, 9, 3, NULL),
('f245ce10-a6a8-11ef-94e0-2cf05d0b6d76', 'L2024-11-19/16:00:00', '2025-11-19', '2024-10-15', '2024-11-19', '2024-11-19', 500000, 7, 1, NULL),
('f245d691-a6a8-11ef-94e0-2cf05d0b6d76', 'L2024-11-19/16:01:00', '2025-11-13', '2024-10-21', '2024-11-18', '2024-11-19', 500000, 8, 2, 7),
('f4195dfd-6697-4680-a0fb-c655b78a1d4b', 'L2024-11-15/14:05:14', '2025-01-12', '2024-11-14', '2024-11-15', '2024-11-15', 960000, 3, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `minilotes`
--

CREATE TABLE `minilotes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subloteId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `minilotes`
--

INSERT INTO `minilotes` (`id`, `subloteId`) VALUES
('8181a8d1-546b-4369-a9f2-1d5e6f66426e', '40f13f32-f29c-430e-bc68-9bdce3ac0da9'),
('6aed01d1-a9da-11ef-b3e4-2cf05d0b6d76', '48ed7a6b-a9d4-11ef-b3e4-2cf05d0b6d76'),
('f09f552f-a9d4-11ef-b3e4-2cf05d0b6d76', '48ed7a6b-a9d4-11ef-b3e4-2cf05d0b6d76'),
('f09f5dc6-a9d4-11ef-b3e4-2cf05d0b6d76', '48ed7a6b-a9d4-11ef-b3e4-2cf05d0b6d76'),
('f09f631c-a9d4-11ef-b3e4-2cf05d0b6d76', '48ed7a6b-a9d4-11ef-b3e4-2cf05d0b6d76'),
('d25a6820-2e13-4eec-8c46-79fc21b083ff', '579f2a6d-2540-4cb8-bc82-4d0e7643882e'),
('015b4224-0bc1-4283-ab04-84cfb1586433', '59b3de74-9d19-415a-8e1f-c51bd175b89f'),
('4998820f-a6a9-11ef-94e0-2cf05d0b6d76', '59b3de74-9d19-415a-8e1f-c51bd175b89f'),
('2d7810f8-ac87-402a-b9e9-1fa0e58ebc4a', '724e8ff8-4850-4864-8098-e2a1c7438d7e'),
('23632129-504f-4bef-bb2e-d30da00f5c52', '8d2b3b3c-a26c-49cd-83c1-c90d93acd046'),
('49987518-a6a9-11ef-94e0-2cf05d0b6d76', '8df64a6c-1875-4918-ac2c-fcbe8f58946d'),
('6726a4f1-0acb-42a2-940f-480691baf7dd', '9bc2c378-f995-40cd-9cfd-d5643d2a8431'),
('e5e58912-97fb-44e3-a90a-a1742620a156', '9bc2c378-f995-40cd-9cfd-d5643d2a8431'),
('77afcc8f-e6ae-40cb-a5fb-e85665594673', 'ba1dfe6b-8115-488d-b1c7-932c5b4598ff'),
('b27d541b-b444-42a3-bd22-8fccac42da43', 'be545267-8595-4898-83ca-424821484bc0'),
('89cd38bf-978b-47b1-be11-74b5dbfd909c', 'c1c123d5-4ff3-4f72-93fb-b655117b75c6'),
('69ebc440-d337-4e9a-8e2d-c4eae27b28c4', 'e627c0ed-9a15-459c-9c99-b00af707f4d3'),
('0f820403-a09e-4d26-b46a-fab27296f99a', 'eaca7062-eb59-4c5c-ad89-0e794df1402b'),
('b8163a0d-16fe-472c-a638-e1c6328388ff', 'f1423fc1-8a83-49dc-9015-9263de756dc3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `fechaNac` date NOT NULL,
  `genero` enum('Femenino','Masculino') NOT NULL,
  `localidadId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `dni`, `nombres`, `apellidos`, `email`, `telefono`, `fechaNac`, `genero`, `localidadId`) VALUES
(1, '38932073', 'Manuel', 'Gutierrez', 'mlgz1995@hotmail.com', '2364567187', '1995-11-08', 'Masculino', 11),
(2, '12345678', 'Marcos', 'Gutierrez', 'marquinhos@gmail.com', '1234567897', '1997-08-01', 'Masculino', 12),
(3, '44236352', 'Caroline', 'Casper', 'Caroline_Casper@gmail.com', '9389280144', '1984-11-09', 'Femenino', 1),
(4, '78201743', 'Alfredo', 'Beer', 'Alfredo_Beer@gmail.com', '7662452186', '1967-06-16', 'Masculino', 2),
(5, '16238326', 'Ron', 'Effertz', 'Ron_Effertz@gmail.com', '4120296966', '2003-01-24', 'Masculino', 3),
(6, '14401963', 'Wesley', 'Bergstrom', 'Wesley_Bergstrom@gmail.com', '7445095133', '1945-08-30', 'Masculino', 4),
(7, '63188480', 'Harry', 'Hoppe', 'Harry_Hoppe@gmail.com', '8547128027', '1998-01-20', 'Masculino', 5),
(8, '92441160', 'Vera', 'Swift', 'Vera_Swift@gmail.com', '2748106198', '1956-11-29', 'Femenino', 6),
(9, '38415482', 'Kelly', 'Wolff', 'Kelly_Wolff@gmail.com', '1513514495', '1968-12-28', 'Masculino', 1),
(10, '96751479', 'Van', 'Fritsch', 'Van_Fritsch@gmail.com', '5689163338', '1960-01-11', 'Masculino', 2),
(11, '25779427', 'Raquel', 'Oberbrunner', 'Raquel_Oberbrunner@gmail.com', '7043737628', '1994-12-09', 'Femenino', 3),
(12, '42159473', 'Ernest', 'Goyette-O\'Reilly', 'Ernest_Goyette-O\'Reilly@gmail.com', '9101606524', '1959-01-10', 'Masculino', 4),
(13, '29519729', 'Silvia', 'Schroeder', 'Silvia_Schroeder@gmail.com', '7861863563', '1962-09-10', 'Femenino', 5),
(14, '15864069', 'Bruce', 'Crona', 'Bruce_Crona@gmail.com', '3317676985', '1955-08-17', 'Masculino', 6),
(15, '75095485', 'Perry', 'Barrows', 'Perry_Barrows@gmail.com', '2836308586', '2002-02-05', 'Masculino', 1),
(16, '87276590', 'Rafael', 'Tillman', 'Rafael_Tillman@gmail.com', '8920080696', '1956-12-24', 'Masculino', 3),
(17, '95303233', 'Pablo', 'Dibbert', 'Pablo_Dibbert@gmail.com', '5493173315', '1988-09-22', 'Masculino', 5),
(18, '94401613', 'Daisy', 'O\'Conner-Botsford', 'Daisy_O\'Conner-Botsford@gmail.com', '8833645998', '1993-03-25', 'Femenino', 7),
(19, '53192847', 'Katherine', 'Gleichner', 'Katherine_Gleichner@gmail.com', '4452029700', '1985-12-22', 'Femenino', 9),
(20, '29754814', 'Wanda', 'Macejkovic', 'Wanda_Macejkovic@gmail.com', '9061310939', '1985-07-28', 'Femenino', 2),
(21, '71565574', 'Owen', 'Goyette', 'Owen_Goyette@gmail.com', '2225935326', '1969-04-26', 'Masculino', 4),
(22, '31416974', 'Zachary', 'Hoppe', 'Zachary_Hoppe@gmail.com', '6712696248', '1966-07-14', 'Masculino', 5),
(23, '32145698', 'Jesus', 'Alonso', 'jesu@gmail.com', '2355123654', '1975-09-13', 'Masculino', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paises`
--

CREATE TABLE `paises` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `paises`
--

INSERT INTO `paises` (`id`, `nombre`) VALUES
(2, 'Alemania'),
(5, 'Inglaterra'),
(3, 'Japon'),
(4, 'Rusia'),
(1, 'USA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `id` int(11) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `cargo` enum('ADMINISTRATIVO','LOGISTICA','ENFERMERO') NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id`, `nombres`, `apellidos`, `cargo`, `codigo`, `activo`) VALUES
(16, 'Cleveland', 'Stoltenberg', 'ADMINISTRATIVO', 'C-0001', 1),
(17, 'Idell', 'Barton', 'ADMINISTRATIVO', 'C-0002', 1),
(18, 'Jesse', 'Moore', 'ADMINISTRATIVO', 'C-0003', 1),
(19, 'Mazie', 'Orn', 'ADMINISTRATIVO', 'C-0004', 1),
(20, 'Emely', 'Volkman', 'ADMINISTRATIVO', 'C-0005', 1),
(21, 'Marian', 'Quitzon', 'LOGISTICA', 'C-0006', 1),
(22, 'Shanel', 'Treutel', 'LOGISTICA', 'C-0007', 1),
(23, 'Cody', 'Gottlieb', 'LOGISTICA', 'C-0008', 1),
(24, 'Sam', 'Grant', 'LOGISTICA', 'C-0009', 1),
(25, 'Heaven', 'Hand', 'LOGISTICA', 'C-0010', 1),
(26, 'Judson', 'Larkin', 'ENFERMERO', 'C-0011', 1),
(27, 'Jimmie', 'Wintheiser', 'ENFERMERO', 'C-0012', 1),
(28, 'Jack', 'Weissnat', 'ENFERMERO', 'C-0013', 1),
(29, 'Wyatt', 'Cronin', 'ENFERMERO', 'C-0014', 1),
(30, 'Isaiah', 'Jast', 'ENFERMERO', 'C-0015', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id`, `nombre`) VALUES
(1, 'Buenos Aires'),
(24, 'C.A.B.A'),
(16, 'Catamarca'),
(7, 'Chaco'),
(21, 'Chubut'),
(10, 'Córdoba'),
(4, 'Corrientes'),
(3, 'Entre Ríos'),
(6, 'Formosa'),
(18, 'Jujuy'),
(12, 'La Pampa'),
(15, 'La Rioja'),
(13, 'Mendoza'),
(5, 'Misiones'),
(19, 'Neuquén'),
(20, 'Río Negro'),
(17, 'Salta'),
(14, 'San Juan'),
(11, 'San Luís'),
(22, 'Santa Cruz'),
(2, 'Santa Fé'),
(8, 'Santiago del Estero'),
(23, 'Tierra del Fuego'),
(9, 'Tucumán');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_minilotes`
--

CREATE TABLE `solicitudes_minilotes` (
  `id` int(11) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `fechaSolicitud` date NOT NULL,
  `tipoVacunaId` int(11) DEFAULT NULL,
  `centroId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_sublotes`
--

CREATE TABLE `solicitudes_sublotes` (
  `id` int(11) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `fechaSolicitud` date NOT NULL,
  `estado` enum('COMPRADA','PENDIENTE','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
  `tipoVacunaId` int(11) DEFAULT NULL,
  `provinciaId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sublotes`
--

CREATE TABLE `sublotes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fechaSalida` date NOT NULL,
  `fechaLlegada` date NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `loteId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `provinciaId` int(11) DEFAULT NULL,
  `descarteId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sublotes`
--

INSERT INTO `sublotes` (`id`, `fechaSalida`, `fechaLlegada`, `cantidad`, `loteId`, `provinciaId`, `descarteId`) VALUES
('154d7aff-b224-41e5-b33d-509c9802c8f9', '2024-11-15', '2024-11-15', 20000, 'f4195dfd-6697-4680-a0fb-c655b78a1d4b', 13, NULL),
('2d0924eb-1357-4ee4-8901-86e6e31e81c8', '2024-11-15', '2024-11-15', 20000, '42b12810-7950-4c3d-af35-f376b623dca0', 24, NULL),
('2e499b38-76ed-4eab-ad7f-1cf9ee554714', '2024-11-15', '2024-11-15', 20000, '437c5277-416d-4086-9c42-b21dce6b2383', 1, NULL),
('312f1493-a9e9-11ef-b3e4-2cf05d0b6d76', '2024-11-15', '2024-11-15', 21000, '31cc22e8-a9ea-11ef-b3e4-2cf05d0b6d76', 10, NULL),
('36510fcc-d56e-41e8-92a9-a709c1dc1b92', '2024-12-11', '2024-12-11', 12500, '43c711d9-6674-40a6-96dd-cb712ec85d06', 11, NULL),
('36c8cbd6-51cc-4725-8d43-5c7b4433c4e8', '2024-11-15', '2024-11-15', 20000, 'bc70505d-143a-4806-a2b9-d70ef597db97', 10, NULL),
('39e88bfb-a6a9-11ef-94e0-2cf05d0b6d76', '2024-11-18', '2024-11-19', 10000, '41b1802f-2f91-4beb-bc0b-170cf5dd13a3', 24, NULL),
('39e89466-a6a9-11ef-94e0-2cf05d0b6d76', '2024-11-12', '2024-11-14', 5000, 'f245ce10-a6a8-11ef-94e0-2cf05d0b6d76', 13, 3),
('40f13f32-f29c-430e-bc68-9bdce3ac0da9', '2024-11-15', '2024-11-15', 19000, '8c6b3b16-81ee-4ab0-90bf-840251dc7135', 1, NULL),
('422507e2-0d3b-49c6-ba33-41f106b86503', '2024-11-15', '2024-11-15', 20000, '42b12810-7950-4c3d-af35-f376b623dca0', 13, NULL),
('48ed6b14-a9d4-11ef-b3e4-2cf05d0b6d76', '2022-10-15', '2022-10-15', 15000, 'be578051-a9d3-11ef-b3e4-2cf05d0b6d76', 1, NULL),
('48ed740b-a9d4-11ef-b3e4-2cf05d0b6d76', '2022-10-15', '2022-10-15', 15000, 'be578051-a9d3-11ef-b3e4-2cf05d0b6d76', 1, 9),
('48ed7a6b-a9d4-11ef-b3e4-2cf05d0b6d76', '2022-10-15', '2022-10-15', 15000, 'be578051-a9d3-11ef-b3e4-2cf05d0b6d76', 1, NULL),
('579f2a6d-2540-4cb8-bc82-4d0e7643882e', '2024-11-15', '2024-11-15', 19000, '9b523991-90bf-4576-a3d7-395d3cc0c0b6', 1, NULL),
('59b3de74-9d19-415a-8e1f-c51bd175b89f', '2024-11-15', '2024-11-15', 19000, '7940a495-a9b9-4159-8a1c-fb90d7c8d11e', 11, NULL),
('5d8a568e-f506-4363-88bf-67133ffd1944', '2024-11-15', '2024-11-15', 20000, 'f4195dfd-6697-4680-a0fb-c655b78a1d4b', 24, NULL),
('6e2c6037-afc3-49d6-81c1-d4c1ce09c806', '2024-11-15', '2024-11-15', 20000, '8c6b3b16-81ee-4ab0-90bf-840251dc7135', 12, NULL),
('724e8ff8-4850-4864-8098-e2a1c7438d7e', '2024-11-15', '2024-11-15', 19000, '437c5277-416d-4086-9c42-b21dce6b2383', 11, NULL),
('83ec612e-abad-4159-84a8-36d62ba35c59', '2024-11-15', '2024-11-15', 20000, '91ce01b7-b748-41ee-a47f-fd05258b37af', 24, NULL),
('8d2b3b3c-a26c-49cd-83c1-c90d93acd046', '2024-11-15', '2024-11-15', 19000, '91ce01b7-b748-41ee-a47f-fd05258b37af', 10, NULL),
('8df64a6c-1875-4918-ac2c-fcbe8f58946d', '2024-11-15', '2024-11-15', 20000, '91ce01b7-b748-41ee-a47f-fd05258b37af', 12, NULL),
('9bc2c378-f995-40cd-9cfd-d5643d2a8431', '2024-11-15', '2024-11-15', 18250, '9b523991-90bf-4576-a3d7-395d3cc0c0b6', 11, NULL),
('b69e6b3e-cdef-4ae8-b527-6a2c20aa8c91', '2024-11-15', '2024-11-15', 20000, '437c5277-416d-4086-9c42-b21dce6b2383', 24, 4),
('ba1dfe6b-8115-488d-b1c7-932c5b4598ff', '2024-11-15', '2024-11-15', 19000, '21694e38-61b7-46d1-8b74-c815f878a75c', 1, NULL),
('bca66e09-925c-4295-867b-88103ce2db66', '2024-11-15', '2024-11-15', 20000, '42b12810-7950-4c3d-af35-f376b623dca0', 10, NULL),
('be545267-8595-4898-83ca-424821484bc0', '2024-11-15', '2024-11-15', 19000, 'f11bbdfb-5afb-4ea7-aecf-acb4eb7a1144', 10, NULL),
('c1c123d5-4ff3-4f72-93fb-b655117b75c6', '2024-11-15', '2024-11-15', 19000, 'bc70505d-143a-4806-a2b9-d70ef597db97', 1, NULL),
('c24878b1-9949-4e66-bc5c-ba4e0c7e5cff', '2024-11-15', '2024-11-15', 20000, '26af2680-1423-4afa-a039-3ba964e23c1d', 13, NULL),
('c4edd3cb-e6d1-4fb3-9942-c9f545572128', '2024-11-15', '2024-11-15', 20000, '7940a495-a9b9-4159-8a1c-fb90d7c8d11e', 12, NULL),
('c61c6268-1750-43a5-bb0d-387762c93b6c', '2024-11-15', '2024-11-15', 20000, '437c5277-416d-4086-9c42-b21dce6b2383', 12, NULL),
('c8defeda-5379-4b65-8f7d-bb7948487f59', '2024-11-15', '2024-11-15', 20000, '26af2680-1423-4afa-a039-3ba964e23c1d', 24, NULL),
('e627c0ed-9a15-459c-9c99-b00af707f4d3', '2024-11-15', '2024-11-15', 19000, '26af2680-1423-4afa-a039-3ba964e23c1d', 10, NULL),
('eaca7062-eb59-4c5c-ad89-0e794df1402b', '2024-11-15', '2024-11-15', 19000, 'bc70505d-143a-4806-a2b9-d70ef597db97', 11, NULL),
('f1423fc1-8a83-49dc-9015-9263de756dc3', '2024-11-15', '2024-11-15', 19000, 'c1997b49-09ca-438b-8e60-e5357185c8bc', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_vacunas`
--

CREATE TABLE `tipos_vacunas` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipos_vacunas`
--

INSERT INTO `tipos_vacunas` (`id`, `tipo`) VALUES
(4, 'Antisarampionosa'),
(2, 'Atitetanica'),
(1, 'BCG'),
(5, 'MMR'),
(3, 'SABIN'),
(6, 'Triple Viral');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `rol` enum('ADMIN_NAC','LOGIST_NAC','ENFERMERO','ADMIN_PROV','LOGIST_PROV','ADMIN_CEN','LOGIST_CEN','MASTER') NOT NULL,
  `personalId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `rol`, `personalId`) VALUES
(1, 'usuario1', '$2b$10$/.mDdZ1TWfoqDDA22.hSVeckkTXJtW0.pSGVAffc7h5QfFdnXp8kK', 'ADMIN_NAC', 16),
(2, 'usuario2', '$2b$10$HpqzFa3jk/KEhoruoCtBw.jMNZLBJ6MLO7g6NJaCJbe9N4ttqFmK.', 'ADMIN_PROV', 17),
(3, 'usuario3', '$2b$10$W2xpC/N0pbOLlkaodTZxLeuSbdXfe7msQ9Z42qSnTpUj0/p4AulOm', 'ADMIN_CEN', 18),
(4, 'usuario4', '$2b$10$cIjGwaSaHqsgps7oOCsiaerD3.sl.H6AlZq/IjK1Q.iwf/C54TkBa', 'ENFERMERO', 26),
(5, 'usuario5', '$2b$10$K20Ng7DD7/hdDKLt61YJwek9osfOq4edJOIWgeXqvAbmZv5oxUUhu', 'ENFERMERO', 27),
(6, 'usuario6', '$2b$10$CK/ehUQJKcG0mxDjaFQStuUfkMxQ51xhY5/7FaVD2ugONxeE0ONEu', 'ENFERMERO', 28),
(7, 'usuario7', '$2b$10$BremyHbF3gojPkzEE3cIeuY/3Ufs81wqXoBSA9c9eogBmUernzdLW', 'ENFERMERO', 29),
(8, 'usuario8', '$2b$10$DbZDj7YeRVi0UV/pd932he9S1y8kPO.PM3s0Jp6qaWLNBqsGuZlrO', 'ENFERMERO', 30),
(9, 'usuario9', '$2b$10$TRVP.PCc/QDERV8QyytLoeVUFQjpDwNw623dmpBUbDrKvBG70I4NG', 'LOGIST_NAC', 21),
(10, 'usuario10', '$2b$10$52HgnuN.eaBjdA4cnonWGuWN7086mrk7lb5T88s7o/pBuisJE7nEi', 'LOGIST_PROV', 22),
(11, 'usuario11', '$2b$10$6LksCxFk.pbXG8gHhKvB3eoLzDHGKA6uPoqy4Rc5uQ9STU/H7zRsC', 'LOGIST_CEN', 23),
(12, 'usuario', '$2b$10$YcYLz5pISJdohBuk6Ml/Z.Xn2FLosc5p5u1mbPrah5YNyk4bINvmq', 'MASTER', 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunaciones`
--

CREATE TABLE `vacunaciones` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `enfermeroId` int(11) DEFAULT NULL,
  `pacienteId` int(11) DEFAULT NULL,
  `miniloteId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `centroId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `vacunaciones`
--

INSERT INTO `vacunaciones` (`id`, `fecha`, `enfermeroId`, `pacienteId`, `miniloteId`, `centroId`) VALUES
(1, '2024-11-17', 26, 1, '2d7810f8-ac87-402a-b9e9-1fa0e58ebc4a', 4),
(2, '2024-11-24', 26, 3, '77afcc8f-e6ae-40cb-a5fb-e85665594673', 1),
(3, '2024-11-24', 26, 9, 'b8163a0d-16fe-472c-a638-e1c6328388ff', 1),
(4, '2024-11-24', 27, 4, '89cd38bf-978b-47b1-be11-74b5dbfd909c', 2),
(5, '2024-11-24', 27, 5, '8181a8d1-546b-4369-a9f2-1d5e6f66426e', 2),
(6, '2024-11-24', 27, 6, '015b4224-0bc1-4283-ab04-84cfb1586433', 2),
(7, '2024-11-24', 27, 7, '69ebc440-d337-4e9a-8e2d-c4eae27b28c4', 3),
(8, '2024-11-24', 28, 8, 'b27d541b-b444-42a3-bd22-8fccac42da43', 3),
(9, '2024-11-24', 29, 10, '2d7810f8-ac87-402a-b9e9-1fa0e58ebc4a', 4),
(10, '2024-11-24', 29, 11, '015b4224-0bc1-4283-ab04-84cfb1586433', 4),
(11, '2024-11-24', 29, 12, '015b4224-0bc1-4283-ab04-84cfb1586433', 4),
(12, '2024-11-24', 29, 13, '6726a4f1-0acb-42a2-940f-480691baf7dd', 4),
(13, '2024-11-24', 29, 14, '0f820403-a09e-4d26-b46a-fab27296f99a', 4),
(14, '2024-12-11', 26, 23, 'b8163a0d-16fe-472c-a638-e1c6328388ff', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacunas`
--

CREATE TABLE `vacunas` (
  `id` int(11) NOT NULL,
  `nombreComercial` varchar(50) NOT NULL,
  `laboratorioId` int(11) DEFAULT NULL,
  `tipoVacunaId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `vacunas`
--

INSERT INTO `vacunas` (`id`, `nombreComercial`, `laboratorioId`, `tipoVacunaId`) VALUES
(1, 'BCGarda', 1, 1),
(2, 'AntiTet', 2, 2),
(3, 'SABINarda', 3, 3),
(4, 'Sin Sarampion', 4, 4),
(5, 'MMR pro', 5, 5),
(6, 'Triplarda', 5, 6),
(7, 'BCgita', 2, 1),
(8, 'Sin Tetanos', 3, 2),
(9, 'Chau Sarampion', 3, 4),
(10, 'The Treble', 2, 6);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `centros_vacunacion`
--
ALTER TABLE `centros_vacunacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD KEY `localidadId` (`localidadId`);

--
-- Indices de la tabla `depositos_nacionales`
--
ALTER TABLE `depositos_nacionales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indices de la tabla `descartes`
--
ALTER TABLE `descartes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `personalId` (`personalId`);

--
-- Indices de la tabla `distribuciones_provinciales`
--
ALTER TABLE `distribuciones_provinciales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `distribuciones_provinciales_centroId_miniloteId_unique` (`miniloteId`,`centroId`),
  ADD KEY `redistribuidoPor` (`redistribuidoPor`),
  ADD KEY `centroId` (`centroId`),
  ADD KEY `descarteId` (`descarteId`);

--
-- Indices de la tabla `laboratorios`
--
ALTER TABLE `laboratorios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD KEY `paisId` (`paisId`);

--
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provinciaId` (`provinciaId`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nroLote` (`nroLote`),
  ADD UNIQUE KEY `nroLote_2` (`nroLote`),
  ADD KEY `vacunaId` (`vacunaId`),
  ADD KEY `depositoId` (`depositoId`),
  ADD KEY `descarteId` (`descarteId`);

--
-- Indices de la tabla `minilotes`
--
ALTER TABLE `minilotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subloteId` (`subloteId`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `localidadId` (`localidadId`);

--
-- Indices de la tabla `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD UNIQUE KEY `codigo_2` (`codigo`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indices de la tabla `solicitudes_minilotes`
--
ALTER TABLE `solicitudes_minilotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipoVacunaId` (`tipoVacunaId`),
  ADD KEY `centroId` (`centroId`);

--
-- Indices de la tabla `solicitudes_sublotes`
--
ALTER TABLE `solicitudes_sublotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipoVacunaId` (`tipoVacunaId`),
  ADD KEY `provinciaId` (`provinciaId`);

--
-- Indices de la tabla `sublotes`
--
ALTER TABLE `sublotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loteId` (`loteId`),
  ADD KEY `provinciaId` (`provinciaId`),
  ADD KEY `descarteId` (`descarteId`);

--
-- Indices de la tabla `tipos_vacunas`
--
ALTER TABLE `tipos_vacunas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tipo` (`tipo`),
  ADD UNIQUE KEY `tipo_2` (`tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `personalId` (`personalId`);

--
-- Indices de la tabla `vacunaciones`
--
ALTER TABLE `vacunaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enfermeroId` (`enfermeroId`),
  ADD KEY `pacienteId` (`pacienteId`),
  ADD KEY `miniloteId` (`miniloteId`),
  ADD KEY `centroId` (`centroId`);

--
-- Indices de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreComercial` (`nombreComercial`),
  ADD UNIQUE KEY `nombreComercial_2` (`nombreComercial`),
  ADD KEY `laboratorioId` (`laboratorioId`),
  ADD KEY `tipoVacunaId` (`tipoVacunaId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `centros_vacunacion`
--
ALTER TABLE `centros_vacunacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `depositos_nacionales`
--
ALTER TABLE `depositos_nacionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `descartes`
--
ALTER TABLE `descartes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `distribuciones_provinciales`
--
ALTER TABLE `distribuciones_provinciales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `laboratorios`
--
ALTER TABLE `laboratorios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `paises`
--
ALTER TABLE `paises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `solicitudes_minilotes`
--
ALTER TABLE `solicitudes_minilotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes_sublotes`
--
ALTER TABLE `solicitudes_sublotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_vacunas`
--
ALTER TABLE `tipos_vacunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `vacunaciones`
--
ALTER TABLE `vacunaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `vacunas`
--
ALTER TABLE `vacunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `centros_vacunacion`
--
ALTER TABLE `centros_vacunacion`
  ADD CONSTRAINT `centros_vacunacion_ibfk_1` FOREIGN KEY (`localidadId`) REFERENCES `localidades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `descartes`
--
ALTER TABLE `descartes`
  ADD CONSTRAINT `descartes_ibfk_1` FOREIGN KEY (`personalId`) REFERENCES `personal` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `distribuciones_provinciales`
--
ALTER TABLE `distribuciones_provinciales`
  ADD CONSTRAINT `distribuciones_provinciales_ibfk_5` FOREIGN KEY (`redistribuidoPor`) REFERENCES `centros_vacunacion` (`id`),
  ADD CONSTRAINT `distribuciones_provinciales_ibfk_6` FOREIGN KEY (`miniloteId`) REFERENCES `minilotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `distribuciones_provinciales_ibfk_7` FOREIGN KEY (`centroId`) REFERENCES `centros_vacunacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `distribuciones_provinciales_ibfk_8` FOREIGN KEY (`descarteId`) REFERENCES `descartes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `laboratorios`
--
ALTER TABLE `laboratorios`
  ADD CONSTRAINT `laboratorios_ibfk_1` FOREIGN KEY (`paisId`) REFERENCES `paises` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD CONSTRAINT `localidades_ibfk_1` FOREIGN KEY (`provinciaId`) REFERENCES `provincias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_ibfk_4` FOREIGN KEY (`vacunaId`) REFERENCES `vacunas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lotes_ibfk_5` FOREIGN KEY (`depositoId`) REFERENCES `depositos_nacionales` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `lotes_ibfk_6` FOREIGN KEY (`descarteId`) REFERENCES `descartes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `minilotes`
--
ALTER TABLE `minilotes`
  ADD CONSTRAINT `minilotes_ibfk_1` FOREIGN KEY (`subloteId`) REFERENCES `sublotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`localidadId`) REFERENCES `localidades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitudes_minilotes`
--
ALTER TABLE `solicitudes_minilotes`
  ADD CONSTRAINT `solicitudes_minilotes_ibfk_3` FOREIGN KEY (`tipoVacunaId`) REFERENCES `tipos_vacunas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_minilotes_ibfk_4` FOREIGN KEY (`centroId`) REFERENCES `centros_vacunacion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitudes_sublotes`
--
ALTER TABLE `solicitudes_sublotes`
  ADD CONSTRAINT `solicitudes_sublotes_ibfk_3` FOREIGN KEY (`tipoVacunaId`) REFERENCES `tipos_vacunas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_sublotes_ibfk_4` FOREIGN KEY (`provinciaId`) REFERENCES `provincias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `sublotes`
--
ALTER TABLE `sublotes`
  ADD CONSTRAINT `sublotes_ibfk_4` FOREIGN KEY (`loteId`) REFERENCES `lotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sublotes_ibfk_5` FOREIGN KEY (`provinciaId`) REFERENCES `provincias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sublotes_ibfk_6` FOREIGN KEY (`descarteId`) REFERENCES `descartes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`personalId`) REFERENCES `personal` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `vacunaciones`
--
ALTER TABLE `vacunaciones`
  ADD CONSTRAINT `vacunaciones_ibfk_5` FOREIGN KEY (`enfermeroId`) REFERENCES `personal` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vacunaciones_ibfk_6` FOREIGN KEY (`pacienteId`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vacunaciones_ibfk_7` FOREIGN KEY (`miniloteId`) REFERENCES `minilotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vacunaciones_ibfk_8` FOREIGN KEY (`centroId`) REFERENCES `centros_vacunacion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `vacunas`
--
ALTER TABLE `vacunas`
  ADD CONSTRAINT `vacunas_ibfk_3` FOREIGN KEY (`laboratorioId`) REFERENCES `laboratorios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `vacunas_ibfk_4` FOREIGN KEY (`tipoVacunaId`) REFERENCES `tipos_vacunas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
