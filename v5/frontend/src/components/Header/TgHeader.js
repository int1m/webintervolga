import {navigateTo} from "../../utils/router";

class TgHeader extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  addEvents() {
    const header = this.shadow.querySelector('header');
    const burgerMenu = this.shadow.querySelector('.burger__menu');

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

    const innerBurger = this.shadow.querySelector('.header__inner__burger');

    innerBurger.addEventListener('click', () => {
      innerBurger.classList.toggle('active');
      this.shadow.querySelector('.burger-top').classList.toggle('active');
      this.shadow.querySelector('.burger-top__line').classList.toggle('active');
      this.shadow.querySelector('.burger-bottom').classList.toggle('active');
      this.shadow.querySelector('.burger-bottom__line').classList.toggle('active');
      this.shadow.querySelector('.burger__menu').classList.toggle('active');
      this.shadow.querySelector('body').classList.toggle('lock');
    });


    const exitButton = this.shadow.querySelector('.account-menu__button-exit');

    if (exitButton) {
      exitButton.addEventListener('click', async () => {
        localStorage.removeItem('token');
        await navigateTo('/');
      });
    }
    const accountDesktopMenuIcon = this.shadow.querySelector('.desktop-account-icon');
    const accountDesktopMenuIconContainer = this.shadow.querySelector('.desktop-account-icon-container');
    const accountMenu = this.shadow.querySelector('.account-menu');
    const accountMenuContainer = this.shadow.querySelector('.account-menu-container');

    const accountMenuEmpty = this.shadow.querySelector('.account-menu-empty');


    const accountMenuIconMobile = this.shadow.querySelector('.mobile-account-icon');
    const accountMenuIconMobileContainer = this.shadow.querySelector('.mobile-account-icon-container');


    const accountMenuButtons = this.shadow.querySelectorAll('.account-menu__button');

    const accountMenuElements = [
      accountDesktopMenuIcon,
      accountDesktopMenuIconContainer,
      accountMenuIconMobile,
      accountMenuIconMobileContainer,
      accountMenuEmpty,
      accountMenu,
    ];

    accountMenuButtons.forEach(value => {accountMenuElements.push(value)});

    accountDesktopMenuIcon.addEventListener('mouseenter', async () => {
      accountMenuContainer.style.display = 'block';
    });

    accountDesktopMenuIconContainer.addEventListener('mouseleave', async (e) => {
      if (accountMenuContainer.style.display !== 'none' && !accountMenuElements.find(item => item === e.relatedTarget)) {
        console.log(e.relatedTarget);
        accountMenuContainer.style.display = 'none';
      }
    });

    accountMenuEmpty.addEventListener('mouseleave', async (e) => {
      if (accountMenuContainer.style.display !== 'none' &&
        e.relatedTarget !== accountDesktopMenuIconContainer && !accountMenuElements.find(item => item === e.relatedTarget)) {
        console.log(e.relatedTarget);
        accountMenuContainer.style.display = 'none';
      }
    });

    accountMenu.addEventListener('mouseleave', async (e) => {
      if (accountMenuContainer.style.display !== 'none' &&
        !accountMenuElements.find(item => item === e.relatedTarget)) {
        console.log(e.relatedTarget);
        accountMenuContainer.style.display = 'none';
      }
    });

    accountMenuIconMobile.addEventListener('mouseenter', async () => {
      accountMenuContainer.style.display = 'block';
    });

    accountMenuIconMobileContainer.addEventListener('mouseleave', async (e) => {
      if (accountMenuContainer.style.display !== 'none' &&
        e.relatedTarget !== accountMenuIconMobile && !accountMenuElements.find(item => item === e.relatedTarget)) {
        accountMenuContainer.style.display = 'none';
        console.log(e.relatedTarget);
      }
    });

  }

  render() {
    this.shadow.innerHTML = `
      <style>
        html {
          box-sizing: border-box;
        }

        *,*::after,*::before {
          box-sizing: inherit;
        }
      
        body.lock {
          overflow-y: hidden;
        }
        
        .burger__menu {
          display: inline;
          position: fixed;
          top: -100px;
          left: 0;
          height: 0;
          transition: all 0.3s ease;
          width: 100%;
          background-color: #fff;
          text-align: center;
          overflow: auto;
          padding: 20px 10px;
          z-index: 1000;
        }
        
        .burger__menu.active {
          z-index: 1000;
          top: 60px;
          height: 100%;
          transition: all 0.3s ease;
        }
        @media (min-width: 1025px) {
          .burger__menu.active {
            min-height: 60%;
            height: auto;
            box-shadow: 0 17px 15px 0 rgba(159, 158, 158, 0.3);
            transition: all 0.3s ease;
          }
        
          .burger__menu-desktop {
            top: -100px !important;
            min-height: 0 !important;
            display: inline !important;
            height: 0 !important;
            transition: all 0.3s ease;
          }
        
          body.lock {
            overflow-y: auto;
          }
        }
        
        .header__inner__burger {
          position: relative;
          display: block;
          height: 48px;
          width: 48px;
          z-index: 2;
        }
        
        .burger-top {
          left: -7px;
          position: absolute;
          width: 30px;
          height: 30px;
          top: 9px;
          transition: transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96), -webkit-transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96);
        }
        
        .burger-bottom {
          left: -7px;
          position: absolute;
          width: 30px;
          height: 30px;
          top: 9px;
          transition: transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96), -webkit-transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96);
        }
        
        .burger-top__line {
          width: 17px;
          height: 1px;
          left: 7px;
          border-radius: 1px;
          position: absolute;
          background: #131313;
          top: 14px;
          transition: transform .1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) .1008s, -webkit-transform .1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) .1008s;
          transform: translateY(-3px);
        }
        
        .burger-bottom__line {
          width: 17px;
          left: 7px;
          height: 1px;
          border-radius: 1px;
          position: absolute;
          background: #131313;
          bottom: 14px;
          transition: transform .1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) .1008s, -webkit-transform .1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) .1008s;
          transform: translateY(3px);
        }
        
        .burger-top.active {
          transform: rotate(45deg);
          transition: transform .3192s cubic-bezier(0.04, 0.04, 0.12, 0.96) .1008s, -webkit-transform .3192s cubic-bezier(0.04, 0.04, 0.12, 0.96) .1008s;
        }
        
        .burger-bottom.active {
          transform: rotate(-45deg);
          transition: transform .3192s cubic-bezier(0.04, 0.04, 0.12, 0.96) .1008s, -webkit-transform .3192s cubic-bezier(0.04, 0.04, 0.12, 0.96) .1008s;
        }
        
        .burger-top__line.active {
          transition: transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96), -webkit-transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96);
          transform: none;
        }
        
        .burger-bottom__line.active {
          transition: transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96), -webkit-transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96);
          transform: none;
        }
        
        header {
          display: flex;
          position: fixed;
          width: 100%;
          min-height: 60px;
          z-index: 1000;
          background-color: #fff;
          top: 0;
          transition: top 0.3s ease 0s;
          border-bottom: 0 solid #eaeaea;
        }
        
        .header__inner {
            width: 100%;
            align-items: center;
            max-width: 1650px;
            padding: 0 0.75rem;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
        }
        
        .header__inner__icons {
            min-height: 100%;
            display: flex;
            align-items: center;
            gap: 20px;
        }
       
        
        .mobile-account-icon-container {
            height: 60px;
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @media (max-width: 768px) {
            .header__inner__icons__only-desktop {
                display: none;
            }
            
            .mobile-account-icon-container {
                min-width: 48px;
                justify-content: flex-end;
            }
        }
        
        @media (min-width: 1025px) {
          .header-remove {
            top: -80px;
            transition: top 0.3s ease 0s;
          }
        }
        
        @media (max-width: 1024px) {
          #desktop-header {
            display: none !important;
          }
        }
        
        .desktop-header-img {
          margin-left: -20px;
        }
        
        .desktop-header-img:hover {
          cursor: pointer;
        }
        
        @media (min-width: 500px) {
          .fixed-menu-mobile-logo {
            display: none;
          }
        }
        
        @media (max-width: 499px) {
          .fixed-menu-desk-logo {
            display: none;
          }
        }
        
        .desktop-header-links a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #999999;
          transition: all 0.3s ease 0s;
        }
        
        .desktop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1650px;
            margin: 0 auto;
            height: 90px;
            padding: 0 0.75rem;
        }
        
        .desktop-header-links {
            display: flex;
            align-items: center;
            gap: 40px;
            height: 100%;
        }
        
        .desktop-account-icon-container {
            min-height: 100%;
            min-width: 40px;
            justify-content: center;
            display: flex;
            align-items: center;
        }
        
        .desktop-header-links:hover {
          color: #333;
          transition: all 0.3s ease 0s;
        }
        
        .add-pointer-event:hover {
            cursor: pointer;
        }
        
        .account-menu-container {
            display: none;
            top: 60px;
            position: fixed;
            width: 100%;
            z-index: 2;
        }
        
        .account-menu-container__inner {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            max-width: 1690px;
            margin: 0 auto;
        }
        
        .account-menu-empty {
            min-width: 230px;
            min-height: 10px;
        }
        
        .account-menu {
            padding: 20px 20px;
            background-color: #fff;
            max-width: 240px;
            min-width: 230px;
        }
        
        .account-menu__inner {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .account-menu__button {
            background-color: #b4966e;
            color: #fff;
            border: none;
            width: 100%;
            max-width: 400px;
            padding: 10px 20px;
            transition: all 0.3s ease 0s;
            font-size: 14px;
        }
        
        .account-menu__button:hover {
            cursor: pointer;
            background-color: #9f845f;
            transition: all 0.3s ease 0s;
        }
        
        .account-menu__button-outline {
            background-color: transparent;
            border: 1px solid #b4966e;
            color: #333;
        }
        
        .account-menu__button-outline:hover {
            background-color: transparent;
            color: #9f845f;
        }
       
      </style>
      <div class="account-menu-container">
        <div class="account-menu-container__inner">
          <div class="account-menu-empty"></div>
          <div class="account-menu">
            <div class="account-menu__inner">
            </div>
          </div>
        </div>
      </div>
      <nav class="burger__menu">
        <div class="burger__menu__content">
          <div class="d-flex flex-column gap-3">
            <div class="d-flex flex-row gap-3">
              <button type="button" class="btn btn-outline-secondary">КУПИТЬ БИЛЕТ</button>
              <button type="button" class="btn btn-outline-secondary">СТАТЬ ДРУГОМ</button>
            </div>
            <div class="d-flex flex-row">
              <button type="button" class="btn btn-outline-secondary">ИНТЕРНЕТ-МАГАЗИН</button>
            </div>
          </div>
        </div>
      </nav>
      <header class="border-bottom align-items-center header-remove">
        <div class="header__inner" style="position: relative">
            <div>
              <div class="header__inner__burger">
                    <span class="burger-top">
                        <span class="burger-top__line"></span>
                    </span>
                <span class="burger-bottom">
                        <span class="burger-bottom__line"></span>
                    </span>
              </div>
            </div>
            <div>
              <a href="/" data-link><img class="fixed-menu-mobile-logo" src="./../../assets/header/logo.svg" style="max-height: 23px" alt="logo"></a>
              <a href="/" data-link><img class="fixed-menu-desk-logo" src="./../../assets/header/header-desk-logo.svg" alt="desk-logo"></a>
            </div>
            <div class="header__inner__icons">
              <img src="./../../assets/header/alert.svg" style="max-height: 19px" alt="alert" class="header__inner__icons__only-desktop">
              <img src="./../../assets/header/search.svg" style="max-height: 21px" alt="search" class="header__inner__icons__only-desktop">
              <div class="mobile-account-icon-container">
                <img src="./../../assets/header/account.svg" style="max-height: 21px" alt="account" class="add-pointer-event mobile-account-icon">
              </div>
            </div>
        </div>
      </header>
        <div id="desktop-header" class="desktop-header">
        <div class="desktop-header-img">
          <a href="/" data-link>
            <img src="./../../assets/header/desktop-logo.svg" alt="desktop-logo">
          </a>
        </div>
        <div class="desktop-header-links">
          <a href="https://www.tretyakovgallery.ru/tickets/afisha" target="_blank">
            <img src="./../../assets/header/ticket.svg" alt="store">
            <span>КУПИТЬ БИЛЕТ</span>
          </a>
          <a href="https://www.tretyakovgallery.ru/support/drug-tretyakovki" target="_blank">
            <img src="./../../assets/header/friends.svg" alt="store">
            <span>СТАТЬ ДРУГОМ</span>
          </a>
          <a href="https://shop.tretyakovgallery.ru/?utm_source=saitgtg&utm_medium=referral&utm_campaign=saitgtglinktoshop&utm_content=knopka1" target="_blank">
            <img src="./../../assets/header/store.svg" alt="store">
            <span>ИНТЕРНЕТ-МАГАЗИН</span>
          </a>
          <img src="./../../assets/header/alert.svg" style="max-height: 19px; min-width: 30px" alt="alert">
          <img src="./../../assets/header/search.svg" style="max-height: 21px; min-width: 30px" alt="search">
          <div class="desktop-account-icon-container">
            <img src="./../../assets/header/account.svg" style="max-height: 19px" alt="account" class="add-pointer-event desktop-account-icon">
          </div>
        </div>
      </div>
    `;
    const accountMenu = this.shadow.querySelector('.account-menu__inner');

    if (localStorage.getItem('token')) {
      const buttonExit = document.createElement('button');
      buttonExit.classList.add('account-menu__button');
      buttonExit.classList.add('account-menu__button-exit');
      buttonExit.innerHTML = 'Выйти';
      accountMenu.appendChild(buttonExit);

    } else {
      const buttonLogin = document.createElement('a');
      buttonLogin.href = '/login'
      buttonLogin.setAttribute('data-link', '');
      const buttonLoginInner = document.createElement('button');
      buttonLoginInner.classList.add('account-menu__button');
      buttonLoginInner.classList.add('account-menu__button-outline');
      buttonLoginInner.innerHTML = 'Войти';
      buttonLogin.appendChild(buttonLoginInner);

      const buttonReg = document.createElement('a');
      buttonReg.href = '/reg'
      buttonReg.setAttribute('data-link', '');
      const buttonRegInner = document.createElement('button');
      buttonRegInner.classList.add('account-menu__button');
      buttonRegInner.innerHTML = 'Регистрация';
      buttonReg.appendChild(buttonRegInner);

      accountMenu.appendChild(buttonLogin);
      accountMenu.appendChild(buttonReg);
    }
  }
}

export default TgHeader;