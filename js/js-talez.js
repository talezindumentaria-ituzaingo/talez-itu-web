
const headerMenu = document.querySelector('.hm-header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        headerMenu.classList.add('header-fixed');
    } else {
        headerMenu.classList.remove('header-fixed');
    }
});

if (document.querySelector('.hm-tabs')) {
    const tabLinks = document.querySelectorAll('.hm-tab-link');
    const tabsContent = document.querySelectorAll('.tabs-content');

    tabLinks.forEach(tab => tab.classList.remove('active'));
    tabsContent.forEach(content => content.classList.remove('tab-active'));

    tabLinks[0].classList.add('active');
    if (tabsContent[0]) {
        tabsContent[0].classList.add('tab-active');
    }

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener('click', () => {
            tabLinks.forEach((tab) => tab.classList.remove('active'));
            tabLinks[i].classList.add('active');
            
            tabsContent.forEach((tabCont) => tabCont.classList.remove('tab-active'));
            if (tabsContent[i]) {
                tabsContent[i].classList.add('tab-active');
            }
        });
    }
}

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
        })
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