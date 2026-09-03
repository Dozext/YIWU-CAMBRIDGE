document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
    const dropdown = document.querySelector('.nav-dropdown');

    // ─── Menú hamburguesa ───────────────────────────────────────────────────
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-xmark', isOpen);
            }
        });
    }

    if (dropdown) {
        dropdown.addEventListener('click', (event) => {
            if (window.innerWidth <= 992 && event.target.closest('.nav-link')) {
                event.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (dropdown) dropdown.classList.remove('open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // ─── Header + Stepper: sin Layout Thrashing ─────────────────────────────
    //
    // PROBLEMA ANTERIOR (Forced Reflow):
    //   El handler de scroll mezclaba lecturas geométricas (getBoundingClientRect,
    //   window.scrollY) con escrituras de DOM (classList.add, style.height) dentro
    //   de un mismo loop. Cada escritura invalidaba el layout, obligando al browser
    //   a recalcular geometría en la siguiente lectura del mismo frame → thrashing.
    //
    // SOLUCIÓN:
    //   1. La función de scroll solo REGISTRA si hay trabajo pendiente (ticking).
    //   2. requestAnimationFrame agrupa todo el trabajo de lectura/escritura en un
    //      único momento justo antes del repaint, cuando el layout ya está estable.
    //   3. Dentro del rAF: PRIMERO se hacen TODAS las lecturas, LUEGO TODAS las
    //      escrituras. Cero recálculos intermedios.

    const stepItems = document.querySelectorAll('.step-item');
    const progressLine = document.getElementById('workflow-progress');
    const hasSteps = stepItems.length > 1 && progressLine;

    let ticking = false; // bandera: evita encolar múltiples rAF por cada scroll

    const updateHeaderAndStepper = () => {
        // ── FASE 1: LECTURAS (el DOM no se toca aquí) ──────────────────────
        const scrollY = window.scrollY;
        const viewportH = window.innerHeight;

        // Leer todas las posiciones geométricas en un solo batch
        const rects = hasSteps
            ? Array.from(stepItems).map(item => item.getBoundingClientRect())
            : [];

        // ── FASE 2: ESCRITURAS (solo aquí se modifica el DOM) ──────────────
        // Header shadow
        if (header) {
            header.style.boxShadow = scrollY > 50
                ? '0 10px 30px rgba(0,0,0,0.24)'
                : '0 2px 20px rgba(0,0,0,0.15)';
        }

        // Stepper progress
        if (hasSteps) {
            const threshold = viewportH * 0.75;
            let activeCount = 0;
            stepItems.forEach((item, index) => {
                if (rects[index].top < threshold) {
                    item.classList.add('active');
                    activeCount = index;
                }
            });
            progressLine.style.height =
                `${(activeCount / (stepItems.length - 1)) * 100}%`;
        }

        ticking = false; // libera la bandera para el próximo scroll
    };

    window.addEventListener('scroll', () => {
        // Si ya hay un rAF encolado, no encolar otro (throttle nativo por frame)
        if (!ticking) {
            requestAnimationFrame(updateHeaderAndStepper);
            ticking = true;
        }
    }, { passive: true }); // passive: el browser no espera preventDefault → scroll más fluido

    // Ejecutar una vez al cargar para el estado inicial
    updateHeaderAndStepper();

    // ─── Formulario de cotización ────────────────────────────────────────────
    const quoteForm = document.getElementById('quote-form');
    const emailButton = document.getElementById('email-submit');

    const buildQuoteLines = (data) => ({
        nombre:    data.get('nombre')    || '',
        pais:      data.get('pais')      || '',
        productos: data.get('productos') || '',
        cantidad:  data.get('cantidad')  || '',
        telefono:  data.get('telefono')  || ''
    });

    if (quoteForm) {
        quoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(quoteForm);
            const l = buildQuoteLines(data);
            const message =
                `Hola, quiero solicitar una cotización desde Yiwu.%0A%0A` +
                `Nombre: ${encodeURIComponent(l.nombre)}%0A` +
                `País: ${encodeURIComponent(l.pais)}%0A` +
                `Productos buscados: ${encodeURIComponent(l.productos)}%0A` +
                `Cantidad aproximada: ${encodeURIComponent(l.cantidad)}%0A` +
                `Teléfono / WhatsApp: ${encodeURIComponent(l.telefono)}`;
            window.open(
                `https://wa.me/8618606570511?text=${message}`,
                '_blank',
                'noopener'
            );
        });
    }

    if (emailButton && quoteForm) {
        emailButton.addEventListener('click', () => {
            if (!quoteForm.reportValidity()) return;
            const data = new FormData(quoteForm);
            const l = buildQuoteLines(data);
            const subject = `Solicitud de cotización - ${l.nombre}`;
            const body =
                `Nombre: ${l.nombre}\n` +
                `País: ${l.pais}\n` +
                `Productos buscados: ${l.productos}\n` +
                `Cantidad aproximada: ${l.cantidad}\n` +
                `Teléfono / WhatsApp: ${l.telefono}`;
            window.location.href =
                `mailto:info@yiwucambridge.com` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(body)}`;
        });
    }
});
