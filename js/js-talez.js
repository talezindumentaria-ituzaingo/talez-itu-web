
const headerMenu = document.querySelector('.hm-header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        headerMenu.classList.add('header-fixed');
    } else {
        headerMenu.classList.remove('header-fixed');
    }
});

const menu = document.querySelector('.icon-menu');
const menuClose = document.querySelector('.cerrar-menu');

menu.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.add('active');
});

menuClose.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.remove('active');
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

async function initDynamicStore() {
    try {
        const respuesta = await fetch('./data/productos.json');
        productosData = await respuesta.json();
        
        setupTabs();
        
        const activeMainTab = document.querySelector('.hm-tab-link.active');
        if (activeMainTab) {
            const targetId = activeMainTab.getAttribute('data-tab');
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                if (firstSubTab) {
                    firstSubTab.classList.add('active');
                    renderProducts(firstSubTab.getAttribute('data-cat'), firstSubTab.getAttribute('data-marca'));
                } else {
                    renderProducts('', '');
                }
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
            mainTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            subTabsContainers.forEach(container => container.classList.remove('active'));
            
            const targetId = e.target.getAttribute('data-tab');
            const targetContainer = document.getElementById(targetId);
            
            if (targetContainer) {
                targetContainer.classList.add('active');
                
                const subLinks = targetContainer.querySelectorAll('.hm-sub-tab-link');
                subLinks.forEach(sl => sl.classList.remove('active'));
                
                const firstSubTab = targetContainer.querySelector('.hm-sub-tab-link');
                if (firstSubTab) {
                    firstSubTab.classList.add('active');
                    renderProducts(firstSubTab.getAttribute('data-cat'), firstSubTab.getAttribute('data-marca'));
                } else {
                    renderProducts('', '');
                }
            } else {
                renderProducts('', '');
            }
        });
    });

    subTabsLinks.forEach(subTab => {
        subTab.addEventListener('click', (e) => {
            const parentUl = e.target.closest('.hm-sub-tabs');
            const siblings = parentUl.querySelectorAll('.hm-sub-tab-link');
            siblings.forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
            
            const cat = e.target.getAttribute('data-cat');
            const marca = e.target.getAttribute('data-marca');
            renderProducts(cat, marca);
        });
    });

    const categoryTriggers = document.querySelectorAll('.cat-trigger');
    categoryTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const targetId = trigger.getAttribute('data-target');
            const correspondingTab = document.querySelector(`.hm-tab-link[data-tab="${targetId}"]`);
            if (correspondingTab) {
                correspondingTab.click();
            }
        });
    });
}

function renderProducts(categoria, marca) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    const productosFiltrados = productosData.filter(p => {
        const catSheet = p["CATEGORIA"] ? p["CATEGORIA"].toString().trim().toUpperCase() : "";
        const marSheet = p["MARCA"] ? p["MARCA"].toString().trim().toUpperCase() : "";
        const catTarget = categoria ? categoria.toString().trim().toUpperCase() : "";
        const marTarget = marca ? marca.toString().trim().toUpperCase() : "";
        
        return catSheet === catTarget && marSheet === marTarget;
    });

    const clasesAnimacion = ['card-left', 'card-center', 'card-right'];

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-muted); grid-column: 1 / -1;">Próximamente agregaremos productos a esta categoría.</p>';
        return;
    }

    productosFiltrados.forEach((producto, index) => {
        const claseAnim = clasesAnimacion[index % 3];
        const delayAOS = 1000 + ((index % 3) * 500);
        
        const descripcion = producto["DESCRIPCIÓN"];
        const precio = producto["PRECIO UNITARIO"] || "Consultar";
        const catClean = producto["CATEGORIA"].toString().trim();
        const marClean = producto["MARCA"] ? producto["MARCA"].toString().trim() : "";
        const nombreImagen = producto["NOMBRE IMAGEN"].toString().trim();
        
        // Armado blindado de la ruta respetando las carpetas de categoría y marca
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
                        <span>$ ${precio}</span>
                    </div>
                    <a href="#" class="hm-btn btn-primary uppercase">AGREGAR AL CARRITO</a>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

document.addEventListener("DOMContentLoaded", initDynamicStore);