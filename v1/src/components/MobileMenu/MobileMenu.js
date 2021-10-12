const innerBurger = document.querySelector('.header__inner__burger');

innerBurger.addEventListener('click', () => {
    innerBurger.classList.toggle('active');
    document.querySelector('.burger-top').classList.toggle('active');
    document.querySelector('.burger-top__line').classList.toggle('active');
    document.querySelector('.burger-bottom').classList.toggle('active');
    document.querySelector('.burger-bottom__line').classList.toggle('active');
    document.querySelector('.burger__menu').classList.toggle('active');
    document.querySelector('body').classList.toggle('lock');
});