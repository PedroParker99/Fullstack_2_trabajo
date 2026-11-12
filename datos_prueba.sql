-- =====================================================================
-- Villa del Globo - Datos de prueba para los 4 microservicios
-- Orden de uso:
--   1. Crear en phpMyAdmin las bases: db_producto, db_usuario, db_pedido, db_direccion
--   2. Arrancar los 4 microservicios (Hibernate crea las tablas)
--   3. Ejecutar este script en phpMyAdmin (pestaña SQL, sin elegir base)
-- =====================================================================

-- ---------- ms_usuario ----------
USE db_usuario;

INSERT INTO usuarios (id, nombre, apellido, correo, telefono, rol) VALUES
(1, 'Pedro', 'López', 'pedro.cliente@villadelglobo.cl', '912345678', 'CLIENTE'),
(2, 'Camila', 'Rojas', 'camila.rojas@villadelglobo.cl', '987654321', 'CLIENTE'),
(3, 'Admin', 'Villa del Globo', 'admin@villadelglobo.cl', '955555555', 'ADMIN');

-- ---------- ms_direccion ----------
USE db_direccion;

INSERT INTO direcciones (id, usuario_id, calle, numero, departamento, comuna, ciudad, region, referencia, predeterminada) VALUES
(1, 1, 'Avenida Libertad', '1234', NULL, 'Concepción', 'Concepción', 'Biobío', 'Casa blanca con reja verde', 1),
(2, 1, 'Calle Los Aromos', '56', 'Depto 302', 'San Pedro de la Paz', 'Concepción', 'Biobío', NULL, 0),
(3, 2, 'Pasaje Las Rosas', '789', NULL, 'Talcahuano', 'Concepción', 'Biobío', 'Frente a la plaza', 1);

-- ---------- ms_producto ----------
USE db_producto;

-- En XAMPP (MariaDB 10.4) Hibernate a veces no logra crear esta columna.
-- IF NOT EXISTS evita el error si ya existe.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS tematica VARCHAR(255) DEFAULT NULL;

INSERT INTO productos (id, nombre, descripcion, precio, stock, imagen_url, categoria, tematica) VALUES
(1, 'Set decoración cumpleaños Toy Story', 'Banderín, globos y decoración temática para celebrar con Woody y Buzz.', 19990, 10, '/img/SETTOYSTORY2.webp', 'Set Decoración', 'Toy Story'),
(2, 'Set decoración cumpleaños Merlina', 'Decoración en blanco y negro inspirada en Merlina para una fiesta misteriosa.', 19990, 0, '/img/SETMERLINA.webp', 'Set Decoración', 'Merlina'),
(3, 'Set decoración cumpleaños Masha y el Oso', 'Set completo con banderín, globos y adornos de Masha y el Oso.', 19990, 10, '/img/SETMASHA.webp', 'Set Decoración', 'Masha y el Oso'),
(4, 'Bolsas de dulces Minnie Mouse x6', 'Pack de 6 bolsas para dulces y sorpresas con diseño de Minnie Mouse.', 5390, 10, '/img/Bolsas_Minnie.webp', 'Accesorios', 'Minnie Mouse'),
(5, 'Mantel Spiderman', 'Mantel plástico impermeable con ilustraciones del Hombre Araña.', 3990, 10, '/img/spiderman_mantel.webp', 'Manteles', 'Spiderman'),
(6, 'Mantel Frozen', 'Mantel plástico impermeable con Elsa, Anna y Olaf.', 3990, 10, '/img/frozen_mantel.webp', 'Manteles', 'Frozen'),
(7, 'Set Mario Bros', 'Decoración completa del Reino Champiñón para la fiesta de cumpleaños.', 19990, 10, '/img/SETMARIO.webp', 'Set Decoración', 'Mario Bros'),
(8, 'Corona Minecraft', 'Corona de cartón para el festejado, con diseño pixelado de Minecraft.', 3990, 10, '/img/minecraft_corona.webp', 'Accesorios', 'Minecraft'),
(9, 'Set Cumpleaños Completo Bluey', 'Banderín, platos, vasos, manteles y globos temáticos para la fiesta completa.', 18990, 10, '/img/Bluey.jpg', 'Set Decoración', 'Bluey'),
(10, 'Set Cumpleaños Completo Minecraft', 'Incluye banderín, vajilla completa y globos temáticos de Creeper y Steve.', 19990, 10, '/img/Minecraft.jpg', 'Set Decoración', 'Minecraft'),
(11, 'Set Globos Metalizados Bluey x5', 'Globos metalizados de alta duración con las figuras de Bluey y Bingo.', 4990, 10, '/img/Bluey.jpg', 'Globos', 'Bluey'),
(12, 'Set Globos Metalizados Minecraft x5', 'Globos metalizados resistentes de Creeper, TNT y Espada de Diamante.', 4990, 10, '/img/Minecraft.jpg', 'Globos', 'Minecraft'),
(13, 'Mantel Plástico Bluey (108x180 cm)', 'Mantel de plástico impermeable con diseño ilustrado de la familia Heelers.', 3490, 10, '/img/Bluey.jpg', 'Manteles', 'Bluey'),
(14, 'Vasos Polipapel Minecraft x10', 'Pack de 10 vasos ecológicos de polipapel aptos para bebidas frías y calientes.', 2990, 10, '/img/Minecraft.jpg', 'Vasos y Vajilla', 'Minecraft'),
(15, 'Piñata Bloque TNT Minecraft', 'Piñata con tiras de cinta para abrir de forma limpia, segura y fácil.', 6990, 10, '/img/Minecraft.jpg', 'Piñatas', 'Minecraft'),
(16, 'Kit Arco Orgánico de Globos Pastel x80', 'Incluye 80 globos pastel surtidos, cinta para arco orgánico y puntos de pegamento.', 12990, 10, '/img/Bluey.jpg', 'Set Decoración', 'Decoración'),
(17, 'Vasos Polipapel Bluey x10', 'Pack de 10 vasos biodegradables de polipapel aptos para bebidas frías y calientes.', 2990, 10, '/img/Bluey.jpg', 'Vasos y Vajilla', 'Bluey'),
(18, 'Piñata Reutilizable Bluey', 'Piñata con tiras de cinta para abrir de forma segura y reutilizable.', 6990, 10, '/img/Bluey.jpg', 'Piñatas', 'Bluey'),
(19, 'Corona Cumpleañero Bluey', 'Corona ajustable de cartón resistente para destacar al cumpleañero o cumpleañera.', 2490, 10, '/img/Bluey.jpg', 'Accesorios', 'Bluey'),
(20, 'Mantel Plástico Minecraft (108x180 cm)', 'Mantel plástico impermeable con diseño impreso de bloques de pasto y mobs.', 3490, 10, '/img/Minecraft.jpg', 'Manteles', 'Minecraft'),
(21, 'Cajas Sorpresa Dulceras x6', 'Cajitas de cartón para entregar dulces o sorpresas con la carita de Creeper.', 3990, 10, '/img/Minecraft.jpg', 'Accesorios', 'Minecraft');

INSERT INTO inventarios (id, producto_id, cantidad_disponible, stock_minimo) VALUES
(1, 1, 10, 3), (2, 2, 0, 3), (3, 3, 10, 3), (4, 4, 10, 3), (5, 5, 10, 3),
(6, 6, 10, 3), (7, 7, 10, 3), (8, 8, 10, 3), (9, 9, 10, 3), (10, 10, 10, 3),
(11, 11, 10, 3), (12, 12, 10, 3), (13, 13, 10, 3), (14, 14, 10, 3), (15, 15, 10, 3),
(16, 16, 10, 3), (17, 17, 10, 3), (18, 18, 10, 3), (19, 19, 10, 3), (20, 20, 10, 3),
(21, 21, 10, 3);

-- ms_pedido (db_pedido) queda vacía: los pedidos se crean desde la tienda.
