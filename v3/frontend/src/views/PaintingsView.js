import AbstractView from "./AbstractView.js";

import TgPaintings from "../components/Paintings/TgPaintings";
customElements.define('tg-paintings', TgPaintings);

import TgEventDetail from "../components/EventDetail/TgEventDetail";
customElements.define('tg-event-detail', TgEventDetail);

export default class PaintingsView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Третьяковская галерея");
    this.permission = ['users'];
  }

  async onMounted() {
    window.dispatchEvent(new CustomEvent('PaintingsViewMounted'));
  }

  async getHtml() {
    return await super.getHtml(`
          <nav aria-label="breadcrumb" class="container-xl pt-3 pb-3">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active" aria-current="page"><a href="/" style="text-decoration: none">Главная</a></li>
              <li class="breadcrumb-item active" aria-current="page"><a href="https://www.tretyakovgallery.ru/exhibitions/" target="_blank" style="text-decoration: none">Выставки</a></li>
            </ol>
          </nav>
          <section>
            <div>
              <div class="section-1__content">
                <picture>
                  <source srcset="./assets/section-1/762.jpg" media="(max-width: 767px)">
                  <img src="./assets/section-1/background.jpg" alt="sec-1-backgroud" class="section-1__main__pic_img">
                </picture>
                <div class="container-xl section-1__info">
                  <div class="section-1__text">
                    <div class="d-flex justify-content-between align-items-center" id="section-1__info__start">
                      <div style="font-size: 18px">#Уже идет</div>
                      <div id="section-1__rating-mobile" class="section-1__rating">16+</div>
                    </div>
                    <div class="section-1__name">Александр Иванов. Библейские эскизы. Чудеса и проповеди Христа</div>
                    <div class="section-1__data">18 июня 2021 — 14 ноября 2021</div>
                    <div class="d-flex justify-content-between section-1__buy-ticket align-items-center">
                      <button type="button" class="btn btn-primary section-1__btn">КУПИТЬ БИЛЕТ</button>
                      <div id="section-1__rating-desktop" class="section-1__rating">16+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container-xl section-1__label text-sm-end">
              А.А. Иванов. Христос проповедует на портике храма («Иерусалим, Иерусалим, избивающий пророков и камнями побивающий посланных к тебе!»). Конец 1840-х – 1858. ГТГ
            </div>
          </section>
          <section>
            <tg-event-detail></tg-event-detail>
          </section>
          <section>
            <div class="container-xl pt-4 pb-4 pb-md-5">
              <h1>Картины</h1>
              <tg-paintings></tg-paintings>
            </div>
          </section>
    `)
  }
}


import '../components/Paintings/TgPaintings';
import '../components/EventDetail/TgEventDetail';