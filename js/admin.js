document.addEventListener("DOMContentLoaded", function () {
    protegerPerfilAdmin();
    cargarDatosAdmin();
});

// PROTEGER ADMIN
function protegerPerfilAdmin() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (
        !usuario ||
        !usuario.sesionActiva ||
        usuario.tipo !== "admin"
    ) {
        window.location.href = "index.html";
    }
}

// DATOS DEL ADMIN
function cargarDatosAdmin() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    const correo =
        document.getElementById("correoAdmin");

    if (correo) {
        correo.textContent = usuario.correo;
    }
}

// DEV1 ADMIN
// adminClientes 

// Base de datos local simulada de clientes
const clientesBD = {
    'C-001': { nombre: 'Camila Reyes', email: 'camila.reyes@email.com', telefono: '+56 9 8765 4321', ciudad: 'Santiago', pedidos: '8 pedidos', total: '$185.900', estado: 'VIP', registro: '12/03/2025', badgeClass: 'bg-warning text-dark' },
    'C-002': { nombre: 'Matías Soto', email: 'matias.soto@email.com', telefono: '+56 9 1234 5678', ciudad: 'Concepción', pedidos: '3 pedidos', total: '$54.200', estado: 'Activo', registro: '05/06/2025', badgeClass: 'bg-success text-white' },
    'C-003': { nombre: 'Francisca Muñoz', email: 'francisca.m@email.com', telefono: '+56 9 5555 4444', ciudad: 'Valparaíso', pedidos: '1 pedido', total: '$54.300', estado: 'Activo', registro: '20/01/2026', badgeClass: 'bg-success text-white' },
    'C-004': { nombre: 'Ignacio Vera', email: 'ignacio.vera@email.com', telefono: '+56 9 9988 7766', ciudad: 'La Serena', pedidos: '0 pedidos', total: '$0', estado: 'Inactivo', registro: '10/11/2024', badgeClass: 'bg-secondary text-white' }
};

// Función para llenar e inyectar los datos en el Modal Ver Perfil
function verPerfil(id) {
    const c = clientesBD[id];
    if (!c) return;

    document.getElementById('verNombre').textContent = c.nombre;
    document.getElementById('verEmail').textContent = c.email;
    document.getElementById('verTelefono').textContent = c.telefono;
    document.getElementById('verCiudad').textContent = c.ciudad;
    document.getElementById('verRegistro').textContent = c.registro;
    document.getElementById('verPedidos').textContent = c.pedidos;
    document.getElementById('verTotal').textContent = c.total;

    const badge = document.getElementById('verBadgeEstado');
    badge.textContent = c.estado;
    badge.className = `badge ${c.badgeClass}`;
}

// Función para pre-cargar los datos en el Modal Editar Datos
function prepararEdicion(id) {
    const c = clientesBD[id];
    if (!c) return;

    document.getElementById('editClienteId').value = id;
    document.getElementById('editNombre').value = c.nombre;
    document.getElementById('editEmail').value = c.email;
    document.getElementById('editTelefono').value = c.telefono;
    document.getElementById('editCiudad').value = c.ciudad;
    document.getElementById('editEstado').value = c.estado;
}

// Función para guardar los cambios editados y actualizar la tabla
function guardarEdicionCliente(event) {
    event.preventDefault();
    const id = document.getElementById('editClienteId').value;
    const c = clientesBD[id];
    if (!c) return;

    // Actualizar datos del objeto
    c.nombre = document.getElementById('editNombre').value;
    c.email = document.getElementById('editEmail').value;
    c.telefono = document.getElementById('editTelefono').value;
    c.ciudad = document.getElementById('editCiudad').value;
    c.estado = document.getElementById('editEstado').value;

    if (c.estado === 'VIP') c.badgeClass = 'bg-warning text-dark';
    else if (c.estado === 'Activo') c.badgeClass = 'bg-success text-white';
    else c.badgeClass = 'bg-secondary text-white';

    // Actualizar la fila visible en la tabla en tiempo real
    const fila = document.getElementById(`fila-${id}`);
    if (fila) {
        fila.cells[0].querySelector('strong').textContent = c.nombre;
        fila.cells[1].textContent = c.email;
        fila.cells[2].textContent = c.telefono;
        fila.cells[3].textContent = c.ciudad;
        fila.cells[6].innerHTML = `<span class="badge ${c.badgeClass}">${c.estado === 'VIP' ? '<i class="bi bi-star-fill me-1"></i>' : ''}${c.estado}</span>`;
    }

    // Cerrar modal
    const modalElement = document.getElementById('modalEditarCliente');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}
// Función para filtrar clientes por nombre, correo, teléfono o ciudad en tiempo real
function filtrarClientes() {
    const textoBusqueda = document.getElementById('inputBuscarCliente').value.toLowerCase();
    // Selecciona todas las filas de las tablas dentro de las pestañas
    const filas = document.querySelectorAll('#contenidoTabsClientes tbody tr');

    filas.forEach(fila => {
        const contenidoFila = fila.textContent.toLowerCase();
        if (contenidoFila.includes(textoBusqueda)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

//adminDescuentos
// BD Simulada de Cupones
const cuponesBD = {
    'CUP-001': { codigo: 'BIENVENIDA10', tipo: 'Porcentaje', valor: '10% OFF', usos: '45 / 100 usos', vigencia: '01-09-2026 al 31-12-2026', estado: 'Activo' },
    'CUP-002': { codigo: 'FIESTAFIESTA', tipo: 'Monto Fijo', valor: '$5.000 OFF', usos: '12 / 50 usos', vigencia: '15-09-2026 al 30-09-2026', estado: 'Activo' },
    'CUP-003': { codigo: 'CUMPLEOCTUBRE', tipo: 'Porcentaje', valor: '20% OFF', usos: '0 / 200 usos', vigencia: '01-10-2026 al 31-10-2026', estado: 'Programado' },
    'CUP-004': { codigo: 'ENVIOFREE', tipo: 'Envío Gratis', valor: '100% Envío', usos: '30 / 30 usos', vigencia: '01-08-2026 al 31-08-2026', estado: 'Agotado' }
};

// Función para Cargar Datos en el Modal Editar
function prepararEdicionCupon(id) {
    const c = cuponesBD[id];
    if (!c) return;

    document.getElementById('editCuponId').value = id;
    document.getElementById('editCodigoCupon').value = c.codigo;
    document.getElementById('editTipoDescuento').value = c.tipo;
    document.getElementById('editValorDescuento').value = c.valor;
    document.getElementById('editUsos').value = c.usos;
    document.getElementById('editVigencia').value = c.vigencia;
    document.getElementById('editEstadoCupon').value = c.estado;
}

// Función para Guardar Cambios y Actualizar la Tabla
function guardarEdicionCupon(event) {
    event.preventDefault();
    const id = document.getElementById('editCuponId').value;
    const c = cuponesBD[id];
    if (!c) return;

    c.codigo = document.getElementById('editCodigoCupon').value.toUpperCase();
    c.tipo = document.getElementById('editTipoDescuento').value;
    c.valor = document.getElementById('editValorDescuento').value;
    c.usos = document.getElementById('editUsos').value;
    c.vigencia = document.getElementById('editVigencia').value;
    c.estado = document.getElementById('editEstadoCupon').value;

    const fila = document.getElementById(`fila-${id}`);
    if (fila) {
        fila.cells[0].querySelector('span').textContent = c.codigo;
        fila.cells[1].textContent = c.tipo;
        fila.cells[2].querySelector('strong').textContent = c.valor;
        fila.cells[3].textContent = c.usos;
        fila.cells[4].textContent = c.vigencia;

        let badgeClass = 'bg-success';
        if (c.estado === 'Programado') badgeClass = 'bg-info text-dark';
        if (c.estado === 'Agotado') badgeClass = 'bg-secondary';

        fila.cells[5].innerHTML = `<span class="badge ${badgeClass}">${c.estado}</span>`;
    }

    const modalElement = document.getElementById('modalEditarDescuento');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

// Función para Filtrar por Búsqueda y Tipo
function filtrarCupones() {
    const textoBusqueda = document.getElementById('inputBuscarCupon').value.toLowerCase();
    const tipoSeleccionado = document.getElementById('selectTipoCupon').value.toLowerCase();
    const filas = document.querySelectorAll('#contenidoTabsDescuentos tbody tr');

    filas.forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        const coincideTexto = contenido.includes(textoBusqueda);
        const coincideTipo = tipoSeleccionado === '' || contenido.includes(tipoSeleccionado);

        if (coincideTexto && coincideTipo) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

//adminInformes

//adminPedidos
// Objeto con la información simulada de tus pedidos
const pedidosBD = {
    'VG-1042': {
        cliente: 'Camila Reyes',
        email: 'camila.reyes@email.com',
        direccion: 'Av. Providencia 1234, Depto 502, Santiago',
        fecha: '18-09-2026',
        estado: 'Pendiente',
        badgeClass: 'bg-warning text-dark',
        total: '$38.990',
        productos: [
            { nombre: '🎈 Pack Globos Pastel Cumpleaños', cant: 2, subtotal: '$25.980' },
            { nombre: '✨ Guirnalda Metálica Dorada 3m', cant: 1, subtotal: '$13.010' }
        ]
    },
    'VG-1041': {
        cliente: 'Matías Soto',
        email: 'matias.soto@email.com',
        direccion: 'Calle Los Alerces 456, Concepción',
        fecha: '17-09-2026',
        estado: 'Enviado',
        badgeClass: 'bg-info text-dark',
        total: '$21.500',
        productos: [
            { nombre: '🎉 Inflador Eléctrico de Globos', cant: 1, subtotal: '$21.500' }
        ]
    },
    'VG-1040': {
        cliente: 'Francisca Muñoz',
        email: 'f.munoz@email.com',
        direccion: 'Aníbal Pinto 789, Valparaíso',
        fecha: '15-09-2026',
        estado: 'Completado',
        badgeClass: 'bg-success text-white',
        total: '$54.300',
        productos: [
            { nombre: '👑 Kit Decoración Fiesta Deluxe', cant: 1, subtotal: '$40.000' },
            { nombre: '🎈 Pack 50 Globos Rojos 12"', cant: 1, subtotal: '$14.300' }
        ]
    },
    'VG-1039': {
        cliente: 'Ignacio Vera',
        email: 'ignacio.vera@email.com',
        direccion: 'Av. Alemania 123, Temuco',
        fecha: '14-09-2026',
        estado: 'Cancelado',
        badgeClass: 'bg-danger text-white',
        total: '$12.990',
        productos: [
            { nombre: '🎈 Set Globos Metalizados Número 5', cant: 1, subtotal: '$12.990' }
        ]
    }
};

// Función que reescribe el contenido del modal dinámicamente
function cargarDetalle(idPedido) {
    const pedido = pedidosBD[idPedido];
    if (!pedido) return;

    // Inyectar datos en el Modal
    document.getElementById('modalNumPedido').textContent = `#${idPedido}`;
    document.getElementById('modalFecha').textContent = pedido.fecha;
    document.getElementById('modalCliente').textContent = pedido.cliente;
    document.getElementById('modalEmail').textContent = pedido.email;
    document.getElementById('modalDireccion').textContent = pedido.direccion;
    document.getElementById('modalTotal').textContent = pedido.total;

    // Cambiar estado y color de badge
    const badge = document.getElementById('modalEstado');
    badge.textContent = pedido.estado;
    badge.className = `badge fs-6 px-3 py-2 ${pedido.badgeClass}`;

    // Construir la tabla de productos dinámicamente
    const tablaBody = document.getElementById('modalTablaProductos');
    tablaBody.innerHTML = ''; // Limpiar filas anteriores

    pedido.productos.forEach(prod => {
        tablaBody.innerHTML += `
        <tr>
            <td>${prod.nombre}</td>
            <td class="text-center">${prod.cant}</td>
            <td class="text-end fw-semibold">${prod.subtotal}</td>
        </tr>
    `;
    });
}


// Función para filtrar filas de pedidos por N° de pedido, cliente o fecha
function filtrarPedidos() {
    const textoBusqueda = document.getElementById('inputBuscarPedido').value.toLowerCase();
    // Selecciona todas las filas de las tablas en todas las pestañas
    const filas = document.querySelectorAll('#contenidoTabsPedidos tbody tr');

    filas.forEach(fila => {
        const contenidoFila = fila.textContent.toLowerCase();
        if (contenidoFila.includes(textoBusqueda)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}
// Contador correlativo para autogenerar el N° de pedido
let contadorPedido = 1043;

function guardarNuevoPedido(event) {
    event.preventDefault();

    const idPedido = `VG-${contadorPedido++}`;
    const cliente = document.getElementById('nuevoCliente').value;
    const email = document.getElementById('nuevoEmail').value;
    const direccion = document.getElementById('nuevaDireccion').value;
    const totalMonto = parseInt(document.getElementById('nuevoTotal').value).toLocaleString('es-CL');
    const total = `$${totalMonto}`;
    const estado = document.getElementById('nuevoEstado').value;
    const productoNombre = document.getElementById('nuevoProducto').value;

    // Obtener la fecha actual en formato DD-MM-YYYY
    const hoy = new Date();
    const fecha = `${String(hoy.getDate()).padStart(2, '0')}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${hoy.getFullYear()}`;

    // Determinar la clase Bootstrap para el Badge según el estado seleccionado
    let badgeClass = 'bg-secondary';
    if (estado === 'Pendiente') badgeClass = 'bg-warning text-dark';
    if (estado === 'Enviado') badgeClass = 'bg-info text-dark';
    if (estado === 'Completado') badgeClass = 'bg-success text-white';
    if (estado === 'Cancelado') badgeClass = 'bg-danger text-white';

    // 1. Guardar los datos en el objeto global de pedidosBD para permitir ver el detalle
    pedidosBD[idPedido] = {
        cliente: cliente,
        email: email,
        direccion: direccion,
        fecha: fecha,
        estado: estado,
        badgeClass: badgeClass,
        total: total,
        productos: [
            { nombre: productoNombre, cant: 1, subtotal: total }
        ]
    };

    // 2. Crear dinámicamente la fila HTML e insertarla al principio de la tabla "Todos"
    const tablaTodos = document.querySelector('#tab-todos tbody');
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
<td>#${idPedido}</td>
<td>${cliente}</td>
<td>${fecha}</td>
<td>${total}</td>
<td><span class="badge ${badgeClass}">${estado}</span></td>
<td class="text-end">
    <div class="dropdown">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Acciones</button>
        <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalDetallePedido" onclick="cargarDetalle('${idPedido}')">
                    <i class="bi bi-eye me-2"></i>Ver detalle
                </a>
            </li>
        </ul>
    </div>
</td>
`;
    tablaTodos.insertBefore(nuevaFila, tablaTodos.firstChild);

    // 3. Resetear el formulario y cerrar el modal automáticamente
    document.getElementById('formNuevoPedido').reset();
    const modalElement = document.getElementById('modalNuevoPedido');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

//adminProductos
// Base de datos simulada de los 8 productos del catálogo
const productosBD = {
    'KIT-001': {
        nombre: 'Set decoración cumpleaños Toy Story',
        categoria: 'Kits de Fiesta',
        precio: '$19.990',
        stock: '25 un.',
        estado: 'Disponible',
        badgeClass: 'bg-success text-white',
        imagen: 'img/SETTOYSTORY2.webp',
        descripcion: 'Incluye banderín de feliz cumpleaños, globos temáticos de Woody y Buzz, mantel temático y kit de platos y vasos para 12 personas.'
    },
    'KIT-002': {
        nombre: 'Set decoración cumpleaños Merlina',
        categoria: 'Kits de Fiesta',
        precio: '$19.990',
        stock: '0 un.',
        estado: 'Agotado',
        badgeClass: 'bg-danger text-white',
        imagen: 'img/SETMERLINA.webp',
        descripcion: 'Kit completo en tonos oscuros y morados. Incluye globos foil, cortina metálica morada, Topper para pastel y vajilla desechable.'
    },
    'KIT-003': {
        nombre: 'Set decoración cumpleaños Masha y el Oso',
        categoria: 'Kits de Fiesta',
        precio: '$19.990',
        stock: '5 un.',
        estado: 'Poco Stock',
        badgeClass: 'bg-warning text-dark',
        imagen: 'img/SETMASHA.webp',
        descripcion: 'Set temático para fiestas infantiles. Incluye globos pastel, guirnalda, figura gigante de Masha y mantelería decorativa.'
    },
    'KIT-004': {
        nombre: 'Set decoración cumpleaños Mario Bross',
        categoria: 'Kits de Fiesta',
        precio: '$19.990',
        stock: '18 un.',
        estado: 'Disponible',
        badgeClass: 'bg-success text-white',
        imagen: 'img/SETMARIO.webp',
        descripcion: 'Set de súper héroes y videojuegos. Incluye globos con forma de hongo y estrella, banner feliz cumpleaños y servilletas temáticas.'
    },
    'ACC-001': {
        nombre: 'Bolsas de dulces Minnie Mouse x6',
        categoria: 'Accesorios e Infladores',
        precio: '$5.390',
        stock: '40 un.',
        estado: 'Disponible',
        badgeClass: 'bg-success text-white',
        imagen: 'img/Bolsas_Minnie.webp',
        descripcion: 'Pack de 6 bolsas para dulces estampadas con el diseño oficial de Minnie Mouse, ideales para sorpresas al final del evento.'
    },
    'ACC-002': {
        nombre: 'Mantel Spiderman',
        categoria: 'Accesorios e Infladores',
        precio: '$3.990',
        stock: '15 un.',
        estado: 'Disponible',
        badgeClass: 'bg-success text-white',
        imagen: 'img/spiderman_mantel.webp',
        descripcion: 'Mantel de plástico impermeable con impresión de alta calidad del Hombre Araña. Medidas: 108 x 180 cm.'
    },
    'ACC-003': {
        nombre: 'Mantel Frozen',
        categoria: 'Accesorios e Infladores',
        precio: '$3.990',
        stock: '4 un.',
        estado: 'Poco Stock',
        badgeClass: 'bg-warning text-dark',
        imagen: 'img/frozen_mantel.webp',
        descripcion: 'Mantel plástico temático de Elsa y Anna. Lavable y reutilizable, ideal para mesas principales de dulces.'
    },
    'ACC-004': {
        nombre: 'Corona Minecraft',
        categoria: 'Accesorios e Infladores',
        precio: '$3.990',
        stock: '30 un.',
        estado: 'Disponible',
        badgeClass: 'bg-success text-white',
        imagen: 'img/minecraft_corona.webp',
        descripcion: 'Corona de cartón rígido plastificado con diseño pixelado estilo Minecraft para el festejado o invitados.'
    }
};

// Función que inyecta la información en el modal ==== PARA EDITAR LA INFORMACIÓN ====
function cargarDetalleProducto(sku) {
    const prod = productosBD[sku];
    if (!prod) return;

    document.getElementById('modalSku').textContent = sku;
    document.getElementById('modalNombre').textContent = prod.nombre;
    document.getElementById('modalCategoria').textContent = prod.categoria;
    document.getElementById('modalPrecio').textContent = prod.precio;
    document.getElementById('modalStock').textContent = prod.stock;
    document.getElementById('modalDescripcion').textContent = prod.descripcion;
    document.getElementById('modalImagen').src = prod.imagen;

    const badge = document.getElementById('modalEstado');
    badge.textContent = prod.estado;
    badge.className = `badge fs-6 me-2 ${prod.badgeClass}`;
}
// Función para abrir el modal de edición y llenar los campos con la información actual
function cargarEditarProducto(sku) {
    const prod = productosBD[sku];
    if (!prod) return;

    // Limpiar formato de precio y stock para dejar solo números en el input
    const precioNumero = parseInt(prod.precio.replace(/[^0-9]/g, '')) || 0;
    const stockNumero = parseInt(prod.stock.replace(/[^0-9]/g, '')) || 0;

    // Cargar los valores en los campos del formulario
    document.getElementById('editSkuTitle').textContent = sku;
    document.getElementById('editSkuOriginal').value = sku;
    document.getElementById('editSku').value = sku;
    document.getElementById('editNombre').value = prod.nombre;
    document.getElementById('editCategoria').value = prod.categoria;
    document.getElementById('editPrecio').value = precioNumero;
    document.getElementById('editStock').value = stockNumero;
    document.getElementById('editDescripcion').value = prod.descripcion;
}

// Función para procesar y guardar los cambios realizados
function guardarCambiosProducto(event) {
    event.preventDefault(); // Previene la recarga de página

    const sku = document.getElementById('editSkuOriginal').value;
    const prod = productosBD[sku];

    if (prod) {
        const nuevoStock = parseInt(document.getElementById('editStock').value);
        const nuevoPrecio = parseInt(document.getElementById('editPrecio').value);

        // Actualizar el objeto con los nuevos datos
        prod.nombre = document.getElementById('editNombre').value;
        prod.categoria = document.getElementById('editCategoria').value;
        prod.precio = `$${nuevoPrecio.toLocaleString('es-CL')}`;
        prod.stock = `${nuevoStock} un.`;
        prod.descripcion = document.getElementById('editDescripcion').value;

        // Recalcular el estado según el stock ingresado
        if (nuevoStock === 0) {
            prod.estado = 'Agotado';
            prod.badgeClass = 'bg-danger text-white';
        } else if (nuevoStock <= 5) {
            prod.estado = 'Poco Stock';
            prod.badgeClass = 'bg-warning text-dark';
        } else {
            prod.estado = 'Disponible';
            prod.badgeClass = 'bg-success text-white';
        }

        // Cerrar el modal
        const modalElement = document.getElementById('modalEditarProducto');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        alert(`¡Producto ${sku} actualizado con éxito!`);
    }
}

// ===================== FILTRADO DE PRODUCTOS ====================
function filtrarProductos() {
    // 1. Obtener los valores de los filtros
    const texto = document.getElementById('inputBuscar').value.toLowerCase().trim();
    const categoria = document.getElementById('selectCategoria').value;

    // 2. Obtener todas las filas de la tabla
    const filas = document.querySelectorAll('#tablaProductos tbody tr');

    // 3. Evaluar fila por fila
    filas.forEach(fila => {
        // Obtenemos el texto de las celdas: Producto (columna 1), SKU (columna 2), Categoría (columna 3)
        const colNombre = fila.cells[1] ? fila.cells[1].textContent.toLowerCase() : '';
        const colSku = fila.cells[2] ? fila.cells[2].textContent.toLowerCase() : '';
        const colCategoria = fila.cells[3] ? fila.cells[3].textContent.trim() : '';

        // Condición 1: El texto coincide con Nombre O con SKU
        const coincideTexto = colNombre.includes(texto) || colSku.includes(texto);

        // Condición 2: La categoría coincide O está seleccionada "Todas las categorías" (valor vacío)
        const coincideCategoria = (categoria === '') || (colCategoria === categoria);

        // Si ambas condiciones se cumplen, muestra la fila; si no, la oculta
        if (coincideTexto && coincideCategoria) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}


