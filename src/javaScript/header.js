// scripts for the header section

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('[data-menu]');
    const openBtn = document.querySelector('[data-header-menu-open]');
    const closeBtn = document.querySelector('[data-header-menu-close]');
    const menuLinks = document.querySelectorAll('[data-menu-close]');

    // Open menu
    openBtn.addEventListener('click', () => {
        menu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close menu
    closeBtn.addEventListener('click', () => {
        closeMenu();
    });

    // Close on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on click outside
    menu.addEventListener('click', (e) => {
        if (e.target === menu) {
            closeMenu();
        }
    });


    function closeMenu() {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }

});

