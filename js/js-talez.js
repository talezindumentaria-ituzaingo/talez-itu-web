
const headerMenu = document.querySelector('.hm-header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        headerMenu.classList.add('header-fixed');
    } else {
        headerMenu.classList.remove('header-fixed');
    }
});

AOS.init({
    duration: 1200,
});

const observerOptions = {
    root: null,
    threshold: 0.5
};

const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active-neon');
        }
    });
}, observerOptions);

const glowTexts = document.querySelectorAll('.glow-trigger');
glowTexts.forEach(text => {
    footerObserver.observe(text);
});

let productosData = [];
let carrito = JSON.parse(sessionStorage.getItem('talez_carrito')) || [];

async function initDynamicStore() {
    try {
        const respuesta = await fetch('./data/productos.json');
        productosData = await respuesta.json();
        
        setupTabs();
        
        const activeMainTab = document.querySelector('.hm-tab-link.active') || document.querySelector('.hm-tab-link');
        if (activeMainTab) {
            const targetId = activeMainTab.getAttribute('data-tab');
            const targetContainer = document.getElementById(targetId);
            
            document.querySelectorAll('.hm-tab-link').forEach(t => t.classList.remove('active'));
            activeMainTab.classList.add('active');
            
            document.querySelectorAll('.hm-sub-tabs').forEach(c => c.classList.remove('active'));
            
            if (targetContainer) {
                targetContainer.classList.add('active');
                const subLinks = targetContainer.querySelectorAll('.hm-sub-tab-link');
                subLinks.forEach(sl => sl.classList.remove('active'));
                
                const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                if (firstSubTab) {
                    firstSubTab.classList.add('active');
                    renderProducts(firstSubTab.getAttribute('data-cat') || "", firstSubTab.getAttribute('data-subcat') || "", firstSubTab.getAttribute('data-marca') || "");
                } else {
                    renderProducts('', '', '');
                }
            } else {
                renderProducts('', '', '');
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function setupTabs() {
    const mainTabs = document.querySelectorAll('.hm-tab-link');
    const subTabsContainers = document.querySelectorAll('.hm-sub-tabs');
    const subTabsLinks = document.querySelectorAll('.hm-sub-tab-link');
    
    mainTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            subTabsContainers.forEach(container => container.classList.remove('active'));
            
            const targetId = tab.getAttribute('data-tab');
            const targetContainer = document.getElementById(targetId);
            
            if (targetContainer) {
                targetContainer.classList.add('active');
                
                const subLinks = targetContainer.querySelectorAll('.hm-sub-tab-link');
                subLinks.forEach(sl => sl.classList.remove('active'));
                
                const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                if (firstSubTab) {
                    firstSubTab.classList.add('active');
                    renderProducts(firstSubTab.getAttribute('data-cat') || "", firstSubTab.getAttribute('data-subcat') || "", firstSubTab.getAttribute('data-marca') || "");
                } else {
                    renderProducts('', '', '');
                }
            } else {
                renderProducts('', '', '');
            }
        });
    });

    subTabsLinks.forEach(subTab => {
        subTab.addEventListener('click', (e) => {
            e.preventDefault();
            const parentUl = subTab.closest('.hm-sub-tabs');
            if (parentUl) {
                const siblings = parentUl.querySelectorAll('.hm-sub-tab-link');
                siblings.forEach(s => s.classList.remove('active'));
            }
            subTab.classList.add('active');
            
            const cat = subTab.getAttribute('data-cat') || "";
            const subcat = subTab.getAttribute('data-subcat') || "";
            const marca = subTab.getAttribute('data-marca') || "";
            renderProducts(cat, subcat, marca);
        });
    });

    const categoryTriggers = document.querySelectorAll('.cat-trigger');
    categoryTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const correspondingTab = document.querySelector(`.hm-tab-link[data-tab="${targetId}"]`);
            if (correspondingTab) {
                mainTabs.forEach(t => t.classList.remove('active'));
                correspondingTab.classList.add('active');
                
                subTabsContainers.forEach(container => container.classList.remove('active'));
                const targetContainer = document.getElementById(targetId);
                
                if (targetContainer) {
                    targetContainer.classList.add('active');
                    
                    const subLinks = targetContainer.querySelectorAll('.hm-sub-tab-link');
                    subLinks.forEach(sl => sl.classList.remove('active'));
                    
                    const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                    if (firstSubTab) {
                        firstSubTab.classList.add('active');
                        renderProducts(firstSubTab.getAttribute('data-cat') || "", firstSubTab.getAttribute('data-subcat') || "", firstSubTab.getAttribute('data-marca') || "");
                    } else {
                        renderProducts('', '', '');
                    }
                }
                
                const seccionIndumentaria = document.getElementById('indumentaria') || document.querySelector('.hm-indumentaria');
                if (seccionIndumentaria) {
                    seccionIndumentaria.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const categoryTriggersGeneral = document.querySelectorAll('.cat-trigger-general');
    categoryTriggersGeneral.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const correspondingTab = document.querySelector(`.hm-tab-link[data-tab="${targetId}"]`);
            const categoriaGeneral = trigger.getAttribute('data-cat') || "";
            
            if (correspondingTab) {
                mainTabs.forEach(t => t.classList.remove('active'));
                correspondingTab.classList.add('active');
                
                subTabsContainers.forEach(container => container.classList.remove('active'));
                const targetContainer = document.getElementById(targetId);
                
                if (targetContainer) {
                    targetContainer.classList.add('active');
                    const subLinks = targetContainer.querySelectorAll('.hm-sub-tab-link');
                    subLinks.forEach(sl => sl.classList.remove('active'));
                    
                    const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                    if (firstSubTab) {
                        firstSubTab.classList.add('active');
                    }
                }
            }
            
            if (categoriaGeneral !== "") {
                renderProducts(categoriaGeneral, '', '');
            }

            const seccionIndumentaria = document.getElementById('indumentaria') || document.querySelector('.hm-indumentaria');
            if (seccionIndumentaria) {
                seccionIndumentaria.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function renderProducts(categoria, subcategoria, marca) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    const productosFiltrados = productosData.filter(p => {
        const catSheet = p["CATEGORIA"] ? p["CATEGORIA"].toString().trim().toUpperCase() : "";
        const subcatSheet = p["SUB CATEGORIA"] ? p["SUB CATEGORIA"].toString().trim().toUpperCase() : "";
        const marSheet = p["MARCA"] ? p["MARCA"].toString().trim().toUpperCase() : "";
        
        const catTarget = categoria ? categoria.toString().trim().toUpperCase() : "";
        const subcatTarget = subcategoria ? subcategoria.toString().trim().toUpperCase() : "";
        const marTarget = marca ? marca.toString().trim().toUpperCase() : "";
        
        let match = (catSheet === catTarget);
        
        if (subcatTarget !== "") {
            match = match && (subcatSheet === subcatTarget);
        }
        
        if (marTarget !== "") {
            match = match && (marSheet === marTarget);
        }
        
        return match;
    });

    const clasesAnimacion = ['card-left', 'card-center', 'card-right'];

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-muted); grid-column: 1 / -1;">Próximamente agregaremos productos a esta categoría.</p>';
        return;
    }

    productosFiltrados.forEach((producto, index) => {
        const claseAnim = clasesAnimacion[index % 3];
        const delayAOS = 1000 + ((index % 3) * 500);
        
        const codigoUnico = producto["ID PROD"] || producto["CÓDIGO"] || producto["ID"] || producto["SKU"] || "";
        const descripcion = producto["DESCRIPCIÓN"];
        const precio = producto["PRECIO UNITARIO"] || "Consultar";
        const catClean = producto["CATEGORIA"].toString().trim();
        const marClean = producto["MARCA"] ? producto["MARCA"].toString().trim() : "";
        const nombreImagen = producto["NOMBRE IMAGEN"].toString().trim();
        
        const tallesRaw = producto["TALLES"] ? producto["TALLES"].toString().trim() : "";
        let selectorTallesHTML = '';

        if (tallesRaw !== "" && tallesRaw.toUpperCase() !== "ÚNICO" && tallesRaw.toUpperCase() !== "UNICO") {
            const arrayTalles = tallesRaw.split(',').map(t => t.trim());
            selectorTallesHTML = `
                <div class="selector-talle-container" style="margin-bottom: 10px; text-align: left;">
                    <label style="font-size: 0.8rem; font-weight: bold; display: block; margin-bottom: 4px; color: var(--text-muted);">Talle:</label>
                    <select class="select-talle" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid var(--border-color, #ccc); background: var(--bg-card); color: var(--text-dark);">
                        ${arrayTalles.map(talle => `<option value="${talle}">${talle}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        
        let rutaImagen = '';
        if (marClean !== "") {
            rutaImagen = `images/${catClean}/${marClean}/${nombreImagen}`;
        } else {
            rutaImagen = `images/${catClean}/${nombreImagen}`;
        }

        const cardHTML = `
            <div class="product-item ${claseAnim}" data-aos="fade-up" data-aos-duration="${delayAOS}">
                <div class="p-portada">
                    <a href="#">
                        <img src="${rutaImagen}" alt="${descripcion}" onerror="console.warn('Ruta fallida:', '${rutaImagen}'); this.src='images/placeholder.jpg';">
                    </a>
                </div>
                <div class="p-info">
                    <a href="#"><h3>${descripcion}</h3></a>
                    <div class="precio">
                        <span>${precio}</span>
                    </div>
                    ${selectorTallesHTML}
                    <button class="hm-btn btn-primary uppercase btn-agregar-carrito" 
                        data-codigo="${codigoUnico}"
                        data-nombre="${descripcion}"
                        data-precio="${precio}"
                        data-imagen="${rutaImagen}">
                        AGREGAR AL CARRITO
                    </button>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDynamicStore();
    actualizarContadorCarrito();
    
    const sidebar = document.getElementById('carrito-sidebar');
    const overlay = document.getElementById('carrito-overlay');
    const btnCerrar = document.getElementById('cerrar-carrito');
    const iconosCarrito = document.querySelectorAll('.hm-icon-cart'); 

    // Control del Menú Móvil (Hamburguesa)
    const menuMovil = document.querySelector('.header-menu-movil');
    const iconMenu = document.querySelector('.icon-menu');
    const menuClose = document.querySelector('.cerrar-menu');

    if (iconMenu && menuMovil) {
        iconMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            menuMovil.classList.add('active');
        });
    }

    if (menuClose && menuMovil) {
        menuClose.addEventListener('click', (e) => {
            e.stopPropagation();
            menuMovil.classList.remove('active');
        });
    }

    // Cerrar menú móvil al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (menuMovil && menuMovil.classList.contains('active')) {
            if (!menuMovil.contains(e.target) && !iconMenu.contains(e.target)) {
                menuMovil.classList.remove('active');
            }
        }
    });

    function abrirCarrito() {
        sidebar.classList.add('activo');
        overlay.classList.add('activo');
        renderizarContenidoCarrito();
    }

    function cerrarCarrito() {
        sidebar.classList.remove('activo');
        overlay.classList.remove('activo');
        
        const viewItems = document.getElementById('carrito-view-items');
        const viewCheckout = document.getElementById('carrito-view-checkout');
        const carritoTitulo = document.getElementById('carrito-titulo');
        if (viewItems && viewCheckout) {
            viewCheckout.style.display = 'none';
            viewItems.style.display = 'flex';
            viewItems.style.flexDirection = 'column';
            viewItems.style.flex = '1';
            if (carritoTitulo) carritoTitulo.textContent = 'Tu Carrito de Compras';
        }
    }

    iconosCarrito.forEach(icono => {
        icono.addEventListener('click', (e) => {
            e.preventDefault();
            abrirCarrito();
        });
    });

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarCarrito);
    if (overlay) overlay.addEventListener('click', cerrarCarrito);

    const contenedor = document.getElementById('contenedor-productos');
    if (contenedor) {
        contenedor.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar-carrito')) {
                e.preventDefault();
                
                const btn = e.target;
                const codigoBase = btn.getAttribute('data-codigo');
                
                const cardInfo = btn.closest('.p-info');
                const selectTalle = cardInfo ? cardInfo.querySelector('.select-talle') : null;
                const talleSeleccionado = selectTalle ? selectTalle.value : 'Único';
                
                const codigoUnicoConTalle = `${codigoBase}-${talleSeleccionado}`;
                const nombreConTalle = talleSeleccionado !== 'Único' ? `${btn.getAttribute('data-nombre')} (Talle: ${talleSeleccionado})` : btn.getAttribute('data-nombre');
                
                const productoObj = {
                    codigo: codigoUnicoConTalle,
                    nombre: nombreConTalle,
                    precio: btn.getAttribute('data-precio'),
                    imagen: btn.getAttribute('data-imagen'),
                    talle: talleSeleccionado,
                    cantidad: 1
                };
                
                agregarAlCarrito(productoObj);
            }
        });
    }

    const btnIrCheckout = document.getElementById('btn-ir-checkout');
    const btnVolverCarrito = document.getElementById('btn-volver-carrito');
    const viewItems = document.getElementById('carrito-view-items');
    const viewCheckout = document.getElementById('carrito-view-checkout');
    const carritoTitulo = document.getElementById('carrito-titulo');

    if (btnIrCheckout) {
        btnIrCheckout.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            viewItems.style.display = 'none';
            viewCheckout.style.display = 'flex';
            viewCheckout.style.flexDirection = 'column';
            viewCheckout.style.flex = '1';
            if (carritoTitulo) carritoTitulo.textContent = 'Finalizar Pedido';
        });
    }

    if (btnVolverCarrito) {
        btnVolverCarrito.addEventListener('click', () => {
            viewCheckout.style.display = 'none';
            viewItems.style.display = 'flex';
            viewItems.style.flexDirection = 'column';
            viewItems.style.flex = '1';
            if (carritoTitulo) carritoTitulo.textContent = 'Tu Carrito de Compras';
        });
    }
});

function agregarAlCarrito(producto) {
    const index = carrito.findIndex(item => item.codigo === producto.codigo);
    
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push(producto);
    }
    
    sessionStorage.setItem('talez_carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    const sidebar = document.getElementById('carrito-sidebar');
    const overlay = document.getElementById('carrito-overlay');
    if (sidebar && overlay) {
        sidebar.classList.add('activo');
        overlay.classList.add('activo');
        if (typeof renderizarContenidoCarrito === 'function') {
            renderizarContenidoCarrito();
        }
    }
}

function actualizarContadorCarrito() {
    const contadorSpan = document.querySelector('.hm-icon-cart span');
    if (!contadorSpan) return;
    
    const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
    contadorSpan.textContent = totalItems;
}

window.renderizarContenidoCarrito = function() {
    const contenedorItems = document.getElementById('carrito-items-container');
    const montoTotalEl = document.getElementById('carrito-total-monto');
    
    if (!contenedorItems) return;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        if (montoTotalEl) montoTotalEl.textContent = '$0.00';
        return;
    }

    contenedorItems.innerHTML = '';
    let totalGeneral = 0;

    carrito.forEach(item => {
        let precioLimpio = 0;
        if (typeof item.precio === 'string' && item.precio !== 'Consultar') {
            precioLimpio = parseFloat(item.precio.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        } else if (typeof item.precio === 'number') {
            precioLimpio = item.precio;
        }

        const subtotal = precioLimpio * item.cantidad;
        if (precioLimpio > 0) totalGeneral += subtotal;

        const itemHTML = `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <div class="carrito-item-precio">${item.precio} c/u</div>
                    <div class="carrito-controles-cantidad">
                        <button onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
                        <button class="btn-eliminar-item" onclick="eliminarDelCarrito('${item.codigo}')" style="margin-left: auto;">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedorItems.innerHTML += itemHTML;
    });

    if (montoTotalEl) {
        montoTotalEl.textContent = totalGeneral > 0 ? `$${totalGeneral.toLocaleString('es-AR')}` : 'Consultar';
    }
};

window.cambiarCantidad = function(codigo, delta) {
    const index = carrito.findIndex(item => item.codigo === codigo);
    if (index !== -1) {
        carrito[index].cantidad += delta;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        sessionStorage.setItem('talez_carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        renderizarContenidoCarrito();
    }
};

window.eliminarDelCarrito = function(codigo) {
    carrito = carrito.filter(item => item.codigo !== codigo);
    sessionStorage.setItem('talez_carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarContenidoCarrito();
};

/*----SECCION DE MODAL DE PAGOS--*/
document.getElementById('btn-enviar-whatsapp')?.addEventListener('click', async () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    const nombreInput = document.getElementById('cliente-nombre');
    const nombre = nombreInput ? nombreInput.value.trim() : "";
    
    if (!nombre) {
        alert('Por favor, ingresa tu nombre y apellido.');
        if (nombreInput) nombreInput.focus();
        return;
    }

    const selectPago = document.getElementById('cliente-pago');
    const tipoPagoSeleccionado = selectPago ? selectPago.value : "Efectivo";
    let pago = "";
    let esBilleteraVirtual = false;

    if (tipoPagoSeleccionado.toLowerCase().includes('billetera') || tipoPagoSeleccionado.toLowerCase().includes('transferencia')) {
        pago = "Billetera Virtual / Transferencia (Alias: agusdiaz7.mp)";
        esBilleteraVirtual = true;
    } else {
        pago = "Efectivo";
    }

    // Calcular el total general y preparar los datos para Google Sheets
    let totalGeneral = 0;
    const idPedido = 'PED-' + Date.now().toString().slice(-6); // ID único del pedido basado en timestamp

    const itemsParaGuardar = carrito.map(item => {
        let precioLimpio = 0;
        if (typeof item.precio === 'string' && item.precio !== 'Consultar') {
            precioLimpio = parseFloat(item.precio.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        } else if (typeof item.precio === 'number') {
            precioLimpio = item.precio;
        }

        const subtotal = precioLimpio * item.cantidad;
        if (precioLimpio > 0) totalGeneral += subtotal;

        // Columnas requeridas: ID PEDIDO | ID PROD | DESCRIPCION | CATEGORIA | TALLE | MARCA | PRECIO UNITARIO | CANTIDAD PEDIDA | TOTAL COMPRA | CLIENTE
        return {
            idPedido: idPedido,
            idProd: item.codigo || "",
            descripcion: item.nombre || "",
            categoria: item.categoria || "", 
            talle: item.talle || "Único",
            marca: item.marca || "",
            precioUnitario: precioLimpio,
            cantidadPedida: item.cantidad,
            totalCompra: subtotal,
            cliente: nombre
        };
    });

    const urlAppsScript = 'https://script.google.com/macros/s/AKfycbw6tzg1ti5j6xb0USdKQlSLy56wer2kW4aSHiLA5SoSJJPH_2qikhizS494r04aX01p/exec'; // <--- Reemplaza con tu URL de Google Apps Script
    
    if (urlAppsScript && urlAppsScript !== 'https://script.google.com/macros/s/AKfycbw6tzg1ti5j6xb0USdKQlSLy56wer2kW4aSHiLA5SoSJJPH_2qikhizS494r04aX01p/exec') {
        try {
            // Mostramos indicador visual opcional de carga si gustas
            await fetch(urlAppsScript, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hoja: 'pedidosWeb', datos: itemsParaGuardar })
            });
        } catch (error) {
            console.error('Error al registrar en Google Sheets:', error);
        }
    }

    // Construir mensaje de WhatsApp
    const envio = "A coordinar (Sus productos estarán listos a partir de los 10 días posteriores a recibido el pago)";
    let mensaje = `*¡Hola! Nuevo Pedido Web* (${idPedido})%0A`;
    mensaje += `*Cliente:* ${nombre}%0A`;
    mensaje += `*Entrega:* ${envio}%0A`;
    mensaje += `Pago: *${pago}*%0A`;
    mensaje += `Detalle de productos:%0A`;

    carrito.forEach(item => {
        mensaje += `• *${item.nombre}*%0A`;
        if (item.talle && item.talle !== 'Único') {
            mensaje += `- Talle: *${item.talle}*%0A`;
        }
        mensaje += `- Cantidad: *${item.cantidad}*%0A`;
    });

    if (totalGeneral > 0) {
        mensaje += `*Total Estimado: $${totalGeneral.toLocaleString('es-AR')}*%0A`;
    }
    mensaje += `¡Aguardo confirmación para coordinar la entrega!`;

    const numeroWhatsApp = "5491150063535"; 
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    if (esBilleteraVirtual) {
        mostrarModalPagoVirtual(totalGeneral, urlWhatsApp);
    } else {
        window.open(urlWhatsApp, '_blank');
    }
});

function mostrarModalPagoVirtual(total, urlWhatsApp) {
    const modal = document.getElementById('modal-pago-virtual');
    const spanTotal = document.getElementById('modal-total-texto');
    const radioMp = document.querySelector('input[name="metodo-pago-opcion"][value="mercadopago"]');
    const radioTransf = document.querySelector('input[name="metodo-pago-opcion"][value="transferencia"]');
    const seccionTransf = document.getElementById('seccion-transferencia');
    const btnEjecutarPago = document.getElementById('btn-ejecutar-pago');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCopiarAlias = document.getElementById('btn-copiar-alias');

    if (spanTotal) spanTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    if (modal) modal.style.display = 'flex';

    // Estado inicial: Seleccionado Mercado Pago por defecto
    if (radioMp) radioMp.checked = true;
    if (seccionTransf) seccionTransf.style.display = 'none';
    if (btnEjecutarPago) btnEjecutarPago.textContent = 'Pagar con Mercado Pago';

    // Cambiar dinámicamente según la opción elegida
    const actualizarVistaModal = () => {
        if (radioTransf && radioTransf.checked) {
            seccionTransf.style.display = 'block';
            btnEjecutarPago.textContent = 'Continuar a WhatsApp';
        } else {
            seccionTransf.style.display = 'none';
            btnEjecutarPago.textContent = 'Pagar con Mercado Pago';
        }
    };

    radioMp?.addEventListener('change', actualizarVistaModal);
    radioTransf?.addEventListener('change', actualizarVistaModal);

    // Botón Copiar Alias
    if (btnCopiarAlias) {
        const nuevoBtnCopiar = btnCopiarAlias.cloneNode(true);
        btnCopiarAlias.parentNode.replaceChild(nuevoBtnCopiar, btnCopiarAlias);
        
        document.getElementById('btn-copiar-alias').addEventListener('click', () => {
            const aliasTexto = document.getElementById('texto-alias').textContent;
            navigator.clipboard.writeText(aliasTexto).then(() => {
                const btn = document.getElementById('btn-copiar-alias');
                btn.textContent = '¡Copiado!';
                setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
            });
        });
    }

    // Botón Principal de Acción del Modal
    const nuevoBtnEjecutar = btnEjecutarPago.cloneNode(true);
    btnEjecutarPago.parentNode.replaceChild(nuevoBtnEjecutar, btnEjecutarPago);

    document.getElementById('btn-ejecutar-pago').addEventListener('click', () => {
        modal.style.display = 'none';
        
        if (radioTransf && radioTransf.checked) {
            window.open(urlWhatsApp, '_blank');
        } else {

            window.open("https://link.mercadopago.com.ar/talez", "_blank");
            setTimeout(() => { window.open(urlWhatsApp, '_blank'); }, 1000);
        }
    });

    if (btnCerrarModal) {
        const nuevoBtnCerrar = btnCerrarModal.cloneNode(true);
        btnCerrarModal.parentNode.replaceChild(nuevoBtnCerrar, btnCerrarModal);
        
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}