const header = document.querySelector('header');
const burgerMenu = document.querySelector('.burger__menu');

window.addEventListener('scroll', (e) => {
    if (window.pageYOffset > 150) {
        if (header.classList.contains('header-remove')) {
            header.classList.remove('header-remove');
        }

        if (burgerMenu.classList.contains('burger__menu-desktop')) {
            burgerMenu.classList.remove('burger__menu-desktop');
        }

    } else {
        if (!header.classList.contains('header-remove')) {
            header.classList.add('header-remove');
        }

        if (!burgerMenu.classList.contains('burger__menu-desktop')) {
            burgerMenu.classList.add('burger__menu-desktop');
        }
    }
});

