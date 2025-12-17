document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o input do toggle dentro do menu hamburger
    const themeToggle = document.querySelector('.hamburger-nav-menu .toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            body.classList.toggle('dark-mode');
        });
    }
});