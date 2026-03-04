/**
 * Lógica de interactividad para SERVIVERDE S.A.C
 */

// Variables de Estado del Slider
let currentSlideIndex = 0;
let slideTimer = null;
const slideIntervalTime = 8000; 

// Función de revelación al scroll
const reveal = () => {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            if (!element.classList.contains("active")) {
                element.classList.add("active");
            }
        }
    });
};

// Acciones del Slider
const changeSlideAction = (index) => {
    const slides = document.querySelectorAll('.hero-slide');
    const tabButtons = [
        document.getElementById('btn0'),
        document.getElementById('btn1'),
        document.getElementById('btn2'),
        document.getElementById('btn3'),
        document.getElementById('btn4')
    ];

    if (!slides[index] || !tabButtons[index]) return;

    // Desactivar anterior
    slides[currentSlideIndex].classList.remove('active');
    tabButtons[currentSlideIndex].classList.remove('active-tab');

    // Activar nuevo
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    tabButtons[currentSlideIndex].classList.add('active-tab');
    
    // Auto-scroll horizontal de pestañas en móvil SIN afectar el scroll vertical de la página
    const tabContainer = tabButtons[currentSlideIndex].parentElement;
    const targetTab = tabButtons[currentSlideIndex];
    
    // Calculamos la posición exacta para centrar el botón horizontalmente
    const scrollPos = targetTab.offsetLeft - (tabContainer.clientWidth / 2) + (targetTab.clientWidth / 2);
    
    tabContainer.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
    });
};


const startTimer = () => {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        const total = document.querySelectorAll('.hero-slide').length;
        if(total > 0) changeSlideAction((currentSlideIndex + 1) % total);
    }, slideIntervalTime);
};

window.handleManualSlide = (index) => {
    if (index === currentSlideIndex) return;
    changeSlideAction(index);
    startTimer(); 
};

// INICIALIZACIÓN Y EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    reveal();
    startTimer();

    // Lógica del Menú Móvil
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    let menuOpen = false;

    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                mobileMenu.classList.remove('translate-x-full');
                iconOpen.classList.add('opacity-0');
                iconClose.classList.remove('opacity-0');
            } else {
                mobileMenu.classList.add('translate-x-full');
                iconOpen.classList.remove('opacity-0');
                iconClose.classList.add('opacity-0');
            }
        });

        // Cerrar menú al hacer click en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.classList.add('translate-x-full');
                iconOpen.classList.remove('opacity-0');
                iconClose.classList.add('opacity-0');
            });
        });
    }

    // Efecto visual en Navbar al bajar
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 80) {
            nav.classList.add('py-2', 'shadow-2xl');
            nav.classList.remove('py-4');
        } else {
            nav.classList.add('py-4');
            nav.classList.remove('py-2', 'shadow-2xl');
        }
        reveal();
    }, { passive: true });
});

window.addEventListener("load", reveal);