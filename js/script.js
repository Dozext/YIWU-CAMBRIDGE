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
    if (quoteForm) {
        quoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(quoteForm);
            const message = `Hola, quiero solicitar una cotización desde Yiwu.%0A%0A` +
                `Nombre: ${encodeURIComponent(data.get('nombre') || '')}%0A` +
                `País: ${encodeURIComponent(data.get('pais') || '')}%0A` +
                `Productos buscados: ${encodeURIComponent(data.get('productos') || '')}%0A` +
                `Cantidad aproximada: ${encodeURIComponent(data.get('cantidad') || '')}%0A` +
                `Teléfono / WhatsApp: ${encodeURIComponent(data.get('telefono') || '')}`;
            window.open(`https://wa.me/8618606570511?text=${message}`, '_blank', 'noopener');
        });
    }
});
