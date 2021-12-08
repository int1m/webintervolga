class TgFooter extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.render();
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
        
        p {
            padding: 0;
            margin: 0;
        }
      
      
        footer {
          background-color: #000;
          color: #fff;
        }
        
        footer a {
          text-decoration: none;
          transition: all 0.3s ease 0s;
        }
        
        footer a:hover {
          color: #fff;
          transition: all 0.3s ease 0s;
        }
        
        .footer-main {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1650px;
          margin: 0 auto;
          padding: 60px 0.75rem;
        }
        
        .footer-main-up {
          display: flex;
          justify-content: space-between;
          gap: 60px;
        }
        
        .footer-main-down {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 60px;
        }
        
        @media (min-width: 600px) {
          .footer-main-up {
            justify-content: space-between;
          }
        
          .footer-main-down {
            flex-direction: row-reverse;
          }
        }
        
        .footer-nav {
          gap: 140px;
          display: flex;
        }
        
        .footer-nav-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .link-custom-no-hover {
          color: #999 !important;
          text-decoration: none;
        }
        
        @media (max-width: 1400px) {
          .footer-nav {
            gap: 80px;
          }
        }
        
        .footer-nav-links a {
          color: #999 !important;
          transition: all 0.3s ease 0s;
        }
        
        .footer-nav-links a:hover {
          color: #fff !important;
          transition: all 0.3s ease 0s;
        }
        
        
        .social {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 30px;
        }
        
        @media (max-width: 900px) {
          .social {
            flex-direction: row-reverse;
            gap: 50px;
          }
        }
        
        @media (max-width: 600px) {
          .social {
            flex-direction: column;
            gap: 50px;
          }
        }
        
        .social-list {
          display: flex;
          margin-top: 20px;
          gap: 30px;
        }
        
        .social-item {
          opacity: 0.4;
          transition: all 0.3s ease 0s;
        }
        
        .social-item:hover {
          opacity: 1;
          transition: all 0.3s ease 0s;
        }
        
        .errors-likes {
          font-size: 12px;
          color: #999;
        }
        
        .footer-info {
          font-weight: lighter;
          font-size: 13px;
          color: #FFFFFF4D;
          text-align: center;
        }
        
        .footer-info a {
          color: #FFFFFF4D;
        }
        
        .footer-header {
          font-size: 16px;
        }
        
        .form-check-label {
          font-size: 12px;
          color: #999;
        }
        
        .form-arrow-button {
          position: absolute;
          right: 5px;
          top: 22px;
          background: none;
          border: none;
        }
        
        
        @media (min-width: 600px) {
          #tretyakovgallery-mobile-logo {
            display: none;
          }
        }
        
        @media (max-width: 900px) {
          #desktop-content-nav-logo {
            display: none !important;
          }
        }
        
        .errors-likes {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        @media (min-width: 900px) {
          .errors-likes {
            flex-direction: row;
          }
        }
        
        .footer-info {
          padding: 40px 0;
        }
        
        .footer-info__inner {
          display: flex;
          flex-direction: column;
          gap: 30px;
          max-width: 1650px;
          margin: 0 auto;
          padding: 0 0.75rem;
        }
        
        .footer-info__inner__up {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        
        .footer-info__inner__down {
          text-align: center;
        }
        
        .footer-info__inner__down__info {
          display: flex;
          justify-content: center;
          gap: 10px;
          align-items: center;
        }
        
        @media (min-width: 600px) {
          .footer-info__inner {
            flex-direction: row;
            justify-content: space-between;
          }
        
          .footer-info__inner__up {
            text-align: left;
          }
        
          .footer-info__inner__down {
            text-align: right;
          }
        }
        
        #desktop-content-nav-logo {
            display: flex;
            gap: 50px;
        }
        
        .form-input {
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .form-input-content {
          width: 100%;
          height: 56px;
          border: 1px solid #cccccc;
          background: transparent;
          font-size: 16px;
          outline: none;
          padding: 0 0 0 13px;
          color: #fff;
          transition: all 0.3s ease 0s;
        }
        
        .form-input-content:hover {
          border: 1px solid #fff;
          transition: all 0.3s ease 0s;
        }
        
        .form-input-content:focus {
          border: 1px solid #fff;
          transition: all 0.3s ease 0s;
        }
        
        .form-input-content:focus ~ .form-label,
        .form-input-content:not(:placeholder-shown) ~ .form-label {
          top: -7px;
          z-index: 1;
          color: #fff;
          font-size: 12px;
          transition: all 0.3s ease 0s;
        }
        
        .form-input-content:focus ~ .form-label {
          color: #fff;
          transition: all 0.3s ease 0s;
        }
        
        .form-input-content:hover ~ .form-label {
          color: #fff;
          transition: all 0.3s ease 0s;
        }
        
        .form-label {
          position: absolute;
          background-color: #000;
          padding: 0 3px;
          top: 18px;
          left: 10px;
          z-index: -1;
          color: #fff;
          transition: all 0.3s ease 0s;
        }
      </style>
      
      <footer>
      <div class="footer-main">
        <div class="footer-main-up">
          <div id="desktop-content-nav-logo">
            <a class="footer-main-logo-big" href="/" data-link>
              <img src="./../../assets/footer/logo-t-footer.svg" alt="logo">
            </a>
            <div id="footer-nav" class="footer-nav">
              <div class="footer-nav-row">
                <div class="footer-nav-header">О МУЗЕЕ</div>
                <div class="footer-nav-links">
                  <a href="https://www.tretyakovgallery.ru/about/faq" target="_blank">Ответы на частые вопросы</a>
                  <a href="https://www.tretyakovgallery.ru/about/history" target="_blank">История</a>
                  <a href="https://www.tretyakovgallery.ru/about/projects" target="_blank">Проекты</a>
                  <a href="https://www.tretyakovgallery.ru/about/board-of-trustees/" target="_blank">Попечительский совет</a>
                  <a href="https://www.tretyakovgallery.ru/about/fond/" target="_blank">Фонд поддержки</a>
                  <a href="https://www.tretyakovgallery.ru/about/contacts" target="_blank">Контакты</a>
                </div>
              </div>
              <div class="footer-nav-row">
                <div class="footer-nav-header">НАУКА В МУЗЕЕ</div>
                <div class="footer-nav-links">
                  <a href="https://www.tretyakovgallery.ru/about/science" target="_blank">Научные отделы</a>
                </div>
              </div>
              <div class="footer-nav-row">
                <div class="footer-nav-header">БИЛЕТЫ</div>
                <div class="footer-nav-links">
                  <a href="https://www.tretyakovgallery.ru/tickets/afisha" target="_blank">Купить билет</a>
                  <a href="https://www.tretyakovgallery.ru/tickets#/refund" target="_blank">Возвраты</a>
                </div>
              </div>
            </div>
          </div>

          <div class="social">
            <div class="email-subscribe">
              <div class="footer-header">ПОДПИШИТЕСЬ НА НОВОСТИ</div>
              <form style="margin-top: 20px">
                <div class="form-input" style="position: relative;">
                  <input required class="form-input-content" name="name" type="text" id="email-subscribe-name" placeholder=" ">
                  <label class="form-label" for="email-subscribe-name">E-mail</label>
                  <button type="submit" class="form-arrow-button">
                    <svg width="30" height="11" viewBox="0 0 30 11" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-cc3f25f8=""><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5558 11L29.1085 5.5L20.5558 0L23.6658 5H0.884521V6H23.6658L20.5558 11ZM23.9768 5.50008L23.9769 5.5L23.9768 5.49992V5.50008Z" fill="white" data-v-cc3f25f8=""></path></svg>
                  </button>
                </div>
                <div class="form-check" style="margin-top: 20px">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                    Подписываясь на рассылку, Вы соглашаетесь с правилами политики о конфиденциальности
                  </label>
                </div>
              </form>
            </div>
            <div>
              <div class="footer-header">ДАВАЙТЕ ДРУЖИТЬ</div>
              <div class="social-list">
                <a class="social-item" href="https://www.facebook.com/tretyakovgallery/?fref=ts" target="_blank">
                  <img src="./../../assets/footer/facebook.svg" style="max-height: 21px" alt="facebook">
                </a>
                <a class="social-item" href="https://vk.com/tretyakovgallery" target="_blank">
                  <img src="./../../assets/footer/vk.svg" style="max-height: 21px" alt="vk">
                </a>
                <a class="social-item" href="https://www.instagram.com/tretyakov_gallery/" target="_blank">
                  <img src="./../../assets/footer/instagram.svg" style="max-height: 21px" alt="instagram">
                </a>
                <a class="social-item" href="https://www.youtube.com/user/stg" target="_blank">
                  <img src="./../../assets/footer/youtube.svg" style="max-height: 21px" alt="youtube">
                </a>
                <a class="social-item" href="https://www.tripadvisor.ru/Attraction_Review-g298484-d300237-Reviews-State_Tretyakov_Gallery-Moscow_Central_Russia.html" target="_blank">
                  <img src="./../../assets/footer/tripadvisor.svg" style="max-height: 21px" alt="tripadvisor">
                </a>
                <a class="social-item" href="https://t.me/s/GT_Gallery" target="_blank">
                  <img src="./../../assets/footer/telegram.svg" style="max-height: 21px" alt="telegram">
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-main-down">
          <div class="errors-likes">
            <div style="display: flex; gap: 20px; align-items: center">
              <img src="./../../assets/footer/triangle.png" alt="triangle">
              <div style="width: 100%">Сообщить об ошибке</div>
            </div>
            <a href="http://quality.mkrf.ru/" target="_blank" class="link-custom-no-hover" style="display: flex; gap: 20px; align-items: center">
              <img src="./../../assets/footer/likedislike.png" style="min-width: 37px" alt="likedislike">
              <div>Оценка качества услуг учреждений культуры</div>
            </a>
          </div>
          <a href="https://culture.gov.ru/" target="_blank"><img src="./../../assets/footer/culture-gov.png" alt="culture-gov"></a>
        </div>
      </div>
      <div class="footer-info" style="border-top: 1px solid hsla(0,0%,100%,.1);">
        <div class="footer-info__inner">
          <div class="footer-info__inner__up">
            <a href="https://www.tretyakovgallery.ru/about/copirith/" target="_blank">Условия использования материалов сайта</a>
            <a href="https://www.tretyakovgallery.ru/upload/privacy_policy_gtg_museum.pdf" target="_blank">Политика конфиденциальности</a>
          </div>
          <div class="footer-info__inner__down">
            <div class="footer-info__inner__down__info">
              <img id="tretyakovgallery-mobile-logo" src="./../../assets/footer/logo.svg" alt="logo">
              <p>2021 © Государственная Третьяковская галерея</p>
            </div>
            <div>
              <a href="https://t.me/dirty_c0ke" target="_blank">Разработка сайта – dirty_c0ke</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    `
  }
}

export default TgFooter;