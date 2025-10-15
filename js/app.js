    // Base de datos de productos
    const productos = [
        { id: 1, nombre: "Collar Arco Iris", precio: 25000, stock: 20, imagen:"images/productos/2-COLLAR1.webp" },
        { id: 2, nombre: "Collar Marina", precio: 22000, stock: 15, imagen:"images/productos/2-COLLAR2.webp" }, 
        { id: 3, nombre: "Collar Multicapas Cristal", precio: 45000, stock: 8, imagen: "images/productos/2-COLLAR3.webp" },
        { id: 4, nombre: "Collar Oceanic", precio: 18000, stock: 25, imagen: "images/productos/2-COLLAR4.webp" },
        { id: 5, nombre: "Collar Minimalista", precio: 28000, stock: 25, imagen: "images/productos/2-COLLAR5.webp" },
        { id: 6, nombre: "Collar Piedras mia", precio: 18000, stock: 25, imagen: "images/productos/2-COLLAR6.webp" },
    ];
    
    // VARIABLES GLOBALESS
    let carrito = [];
    let stock = {}; // Seguimos el stock actualizado
    
    // ========================================
// INICIO: FUNCIÓN DE BÚSQUEDA (AGREGAR ESTA SECCIÓN COMPLETA)
// ========================================
// Función para buscar productos en tiempo real
function buscarProductos(termino) {
    const terminoBusqueda = termino.toLowerCase().trim();
    const container = document.getElementById('productos-container');
    
    // Si el término está vacío, mostrar todos los productos
    if (terminoBusqueda === '') {
        renderizarProductos();
        container.classList.remove('searching');
        document.getElementById('search-results-info').textContent = '';
        return;
    }
    
    // Filtrar productos que coincidan con el término de búsqueda
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda)
    );
    
    // Renderizar los productos filtrados
    renderizarProductos(productosFiltrados);
    
    // Agregar clase para efectos visuales durante la búsqueda
    container.classList.add('searching');
    
    // Actualizar información de resultados
    const resultadosInfo = document.getElementById('search-results-info');
    if (productosFiltrados.length > 0) {
        resultadosInfo.innerHTML = `Se encontraron <span class="highlight">${productosFiltrados.length}</span> resultado(s) para <span class="highlight">"${termino}"</span>`;
    } else {
        resultadosInfo.innerHTML = `No se encontraron resultados para <span class="highlight">"${termino}"</span>`;
    }
}
// ========================================
// FIN: FUNCIÓN DE BÚSQUEDA
// ========================================
    
    // INICIALIZAR LA APLICACION -DOMContentLoaded-
document.addEventListener('DOMContentLoaded', () => {
    inicializarStock();
    renderizarProductos();
    actualizarCarrito();
    
    // EVENT LISTENERS
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
    document.getElementById('comprar-btn').addEventListener('click', finalizarCompra);
    
    // Formulario de newsletter
    document.getElementById('newsletter-form').addEventListener('submit', manejarNewsletter);
    
    // ========================================
    // INICIO: EVENT LISTENERS PARA BÚSQUEDA (AGREGUE ESTA SECCIÓN COMPLETA)
    // ========================================
    // Event listener para el input de búsqueda
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value;
        buscarProductos(termino);
        
        // Mostrar/ocultar botón de limpiar
        const clearButton = document.getElementById('clear-search');
        clearButton.style.display = termino.trim() !== '' ? 'block' : 'none';
    });
    
    // Event listener para el botón de limpiar búsqueda
    document.getElementById('clear-search').addEventListener('click', () => {
        searchInput.value = '';
        buscarProductos('');
        document.getElementById('clear-search').style.display = 'none';
    });
    // ========================================
    // FIN: EVENT LISTENERS PARA BÚSQUEDA
    // ========================================
    
    // ========================================
    // INICIO: MANEJO RESPONSIVE DEL CARRITO (AGREGAR ESTA SECCIÓN AQUÍ)
    // ========================================
    // Manejar el colapso del carrito en móviles
    const cartContent = document.getElementById('cart-content');
    const cartHeader = document.getElementById('cart-header');
    const cartToggle = cartHeader.querySelector('.btn');
    
    // Actualizar ícono del botón al colapsar/expandir
    cartContent.addEventListener('shown.bs.collapse', () => {
        cartToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    });
    
    cartContent.addEventListener('hidden.bs.collapse', () => {
        cartToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    });
    
    // Forzar el colapso en móvil al cargar la página
    if (window.innerWidth < 992) {
        cartContent.classList.remove('show');
    }
    
    // Ajustar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            cartContent.classList.add('show');
        } else {
            cartContent.classList.remove('show');
            cartToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    });
    // ========================================
    // FIN: MANEJO RESPONSIVE DEL CARRITO
    // ========================================
    }); // <-- Este es el cierre del evento DOMContentLoaded
    
// Inicializar el stock
function inicializarStock() {
    productos.forEach(producto => {
        stock[producto.id] = producto.stock;
    });
}

// RENDERIZAR PRODUCTOS EN LA PAGINA 
// ========================================
// INICIO: MODIFICAR LA FUNCIÓN renderizarProductos (REEMPLAZAR LA FUNCIÓN EXISTENTE CON ESTA)
// ========================================
// Renderizar productos en la página
function renderizarProductos(productosAMostrar = productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    
    // Si no hay productos para mostrar, mostrar un mensaje
    if (productosAMostrar.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra búsqueda</p>
            </div>
        `;
        return;
    }
    
    productosAMostrar.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col-md-6 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: <strong>$${producto.precio}</strong></p>
                    <p class="stock-info">Disponibles: <span id="stock-${producto.id}">${stock[producto.id]}</span></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group" style="width: 130px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="modificarCantidad(${producto.id}, -1)">-</button>
                            <input type="number" class="form-control text-center" id="cantidad-${producto.id}" value="1" min="1" max="${stock[producto.id]}">
                            <button class="btn btn-outline-secondary" type="button" onclick="modificarCantidad(${producto.id}, 1)">+</button>
                        </div>
                        <button class="btn custom-btn" onclick="agregarAlCarrito(${producto.id})">
                            <i class="fas fa-cart-plus me-1"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
        // ========================================
        // INICIO: AGREGAR CLASE PARA EFECTOS VISUALES (AGREGUE ESTAS LÍNEAS)
        // ========================================
        // Si hay un término de búsqueda, agregar la clase 'match' a las tarjetas que coinciden
        const terminoBusqueda = document.getElementById('search-input').value.trim();
        if (terminoBusqueda !== '') {
            card.querySelector('.card').classList.add('match');
        }
        // ========================================
        // FIN: AGREGAR CLASE PARA EFECTOS VISUALES
        // ========================================
    });
}
// ========================================
// FIN: MODIFICACIÓN DE LA FUNCIÓN RENDERIZAR PRODUCTOS
// ========================================

// ========================================
// INICIO: FUNCIONALIDAD PARA EL CARRITO DESPLEGABLE (AGREGAR ESTA SECCIÓN AQUÍ)
// ========================================
// Función para actualizar el carrito desplegable en el navbar
function actualizarCarritoDropdown() {
    const cartDropdownItems = document.getElementById('cart-dropdown-items');
    const cartDropdownTotal = document.getElementById('cart-dropdown-total');
    
    if (carrito.length === 0) {
        cartDropdownItems.innerHTML = `
            <div class="empty-cart">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartDropdownTotal.textContent = '$0';
        return;
    }
    
    let total = 0;
    cartDropdownItems.innerHTML = '';
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6>${item.nombre}</h6>
                    <div class="item-details">
                        $${item.precio} x ${item.cantidad}
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="item-price">$${itemTotal}</span>
                    <i class="fas fa-times remove-item" onclick="eliminarDelCarrito(${item.id})"></i>
                </div>
            </div>
        `;
        cartDropdownItems.appendChild(itemElement);
    });
    
    cartDropdownTotal.textContent = `$${total}`;
}

// ========================================
// FIN: FUNCIONALIDAD PARA EL CARRITO DESPLEGABLE
// ========================================

// Modificar la cantidad de un producto
function modificarCantidad(productoId, cambio) {
    const input = document.getElementById(`cantidad-${productoId}`);
    let nuevaCantidad = parseInt(input.value) + cambio;
    
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > stock[productoId]) nuevaCantidad = stock[productoId];
    
    input.value = nuevaCantidad;
}

// AGREGAR PRODUCTO AL CARRITO 
function agregarAlCarrito(productoId) {
    const input = document.getElementById(`cantidad-${productoId}`);
    const cantidad = parseInt(input.value);
    
    if (cantidad < 1) {
        alert('La cantidad debe ser al menos 1');
        return;
    }
    
    if (cantidad > stock[productoId]) {
        alert('No hay suficiente stock disponible');
        return;
    }
    
    const producto = productos.find(p => p.id === productoId);
    const itemEnCarrito = carrito.find(item => item.id === productoId);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad
        });
    }
    
    // ACTUALIZAR STOCK 
    stock[productoId] -= cantidad;
    document.getElementById(`stock-${productoId}`).textContent = stock[productoId];
    
    // Resetear la cantidad a 1
    input.value = 1;
    
    // Actualizar la interfaz
    actualizarCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${cantidad} ${producto.nombre} agregado(s) al carrito`);
}

// Actualizar la visualización del carrito
function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const vaciarBtn = document.getElementById('vaciar-carrito');
    const comprarBtn = document.getElementById('comprar-btn');
    const cartBadge = document.getElementById('cart-badge');
    
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-2x mb-3"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartTotal.textContent = '$0';
        vaciarBtn.disabled = true;
        comprarBtn.disabled = true;
        cartBadge.textContent = '0';
        return;
    }
    
    // Habilitar botones
    vaciarBtn.disabled = false;
    comprarBtn.disabled = false;
    
    // Calcular total y renderizar items
    let total = 0;
    cartItems.innerHTML = '';
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="d-flex justify-content-between">
                <h6>${item.nombre}</h6>
                <button class="btn btn-sm btn-link text-danger p-0" onclick="eliminarDelCarrito(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                    <span>$${item.precio} x </span>
                    <input type="number" value="${item.cantidad}" min="1" max="${stock[item.id] + item.cantidad}" 
                        onchange="actualizarCantidadCarrito(${item.id}, this.value)" 
                        style="width: 50px; text-align: center;">
                </div>
                <span>$${itemTotal}</span>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `$${total}`;
    cartBadge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

// ELIMINAR PRODUCTO DEL CARRITO 
function eliminarDelCarrito(productoId) {
    const itemIndex = carrito.findIndex(item => item.id === productoId);
    
    if (itemIndex !== -1) {
        // Devolver el stock
        const item = carrito[itemIndex];
        stock[productoId] += item.cantidad;
        document.getElementById(`stock-${productoId}`).textContent = stock[productoId];
        
        // Eliminar del carrito
        carrito.splice(itemIndex, 1);
        
        // Actualizar la interfaz
        actualizarCarrito();
        mostrarNotificacion('Producto eliminado del carrito');
    }
}

// ACTUALIZAR CANTIDAD EN EL CARRITO 
function actualizarCantidadCarrito(productoId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    const item = carrito.find(item => item.id === productoId);
    
    if (!item || nuevaCantidad < 1) return;
    
    // Calcular la diferencia
    const diferencia = nuevaCantidad - item.cantidad;
    
    // Verificar si hay suficiente stock
    if (diferencia > 0 && diferencia > stock[productoId]) {
        alert('No hay suficiente stock disponible');
        actualizarCarrito(); // Para resetear el valor
        return;
    }
    
    // Actualizar stock
    stock[productoId] -= diferencia;
    document.getElementById(`stock-${productoId}`).textContent = stock[productoId];
    
    // Actualizar carrito
    item.cantidad = nuevaCantidad;
    
    // Actualizar la interfaz
    actualizarCarrito();
}

// Vaciar el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        // Devolver todos los productos al stock
        carrito.forEach(item => {
            stock[item.id] += item.cantidad;
            document.getElementById(`stock-${item.id}`).textContent = stock[item.id];
        });
        
        // Vaciar el carrito
        carrito = [];
        
        // Actualizar la interfaz
        actualizarCarrito();
        mostrarNotificacion('Carrito vaciado');
    }
}

// Finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) return;
    
    alert('¡Compra realizada con éxito! Gracias por tu compra.');
    
    // No es necesario devolver el stock porque ya se descontó
    carrito = [];
    actualizarCarrito();
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'position-fixed bottom-0 end-0 m-3 alert alert-success alert-dismissible fade show';
    notificacion.style.zIndex = '1050';
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
        }
    }, 3000);
}

// Manejar el formulario de newsletter
function manejarNewsletter(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    const messageDiv = document.getElementById('newsletter-message');
    
    // Validación simple de email
    if (!email || email.indexOf('@') === -1) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Por favor, ingresa un email válido.</div>';
        return;
    }
    
    // Simular envío del formulario
    messageDiv.innerHTML = '<div class="alert alert-info">Procesando...</div>';
    
    setTimeout(() => {
        messageDiv.innerHTML = '<div class="alert alert-success">¡Gracias por suscribirte! Te hemos enviado un email de confirmación.</div>';
        emailInput.value = '';
        
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }, 1500);
}