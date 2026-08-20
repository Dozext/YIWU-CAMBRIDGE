document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
    const dropdown = document.querySelector('.nav-dropdown');

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

    const updateHeaderAndStepper = () => {
        if (header && window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.24)';
        } else if (header) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        }

        const stepItems = document.querySelectorAll('.step-item');
        const progressLine = document.getElementById('workflow-progress');
        if (stepItems.length > 1 && progressLine) {
            let activeCount = 0;
            stepItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    item.classList.add('active');
                    activeCount = index;
                }
            });
            progressLine.style.height = `${(activeCount / (stepItems.length - 1)) * 100}%`;
        }
    };

    window.addEventListener('scroll', updateHeaderAndStepper, { passive: true });
    updateHeaderAndStepper();

    const quoteForm = document.getElementById('quote-form');
    const emailButton = document.getElementById('email-submit');

    const buildQuoteLines = (data) => ({
        nombre: data.get('nombre') || '',
        pais: data.get('pais') || '',
        productos: data.get('productos') || '',
        cantidad: data.get('cantidad') || '',
        telefono: data.get('telefono') || ''
    });

    if (quoteForm) {
        quoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(quoteForm);
            const l = buildQuoteLines(data);
            const message = `Hola, quiero solicitar una cotización desde Yiwu.%0A%0A` +
                `Nombre: ${encodeURIComponent(l.nombre)}%0A` +
                `País: ${encodeURIComponent(l.pais)}%0A` +
                `Productos buscados: ${encodeURIComponent(l.productos)}%0A` +
                `Cantidad aproximada: ${encodeURIComponent(l.cantidad)}%0A` +
                `Teléfono / WhatsApp: ${encodeURIComponent(l.telefono)}`;
            window.open(`https://wa.me/8618606570511?text=${message}`, '_blank', 'noopener');
        });
    }

    if (emailButton && quoteForm) {
        emailButton.addEventListener('click', () => {
            if (!quoteForm.reportValidity()) return;
            const data = new FormData(quoteForm);
            const l = buildQuoteLines(data);
            const subject = `Solicitud de cotización - ${l.nombre}`;
            const body = `Nombre: ${l.nombre}\n` +
                `País: ${l.pais}\n` +
                `Productos buscados: ${l.productos}\n` +
                `Cantidad aproximada: ${l.cantidad}\n` +
                `Teléfono / WhatsApp: ${l.telefono}`;
            window.location.href = `mailto:info@yiwucambridge.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
});
