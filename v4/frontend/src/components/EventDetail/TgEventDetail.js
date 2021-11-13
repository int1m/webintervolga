class TgEventDetail extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  addEvents() {
    const eventDetailCols = document.querySelector('.event-detail__about-cols').children;

    for (const col of eventDetailCols) {
      if (col.children[0]) {
        col.children[0].children[0].addEventListener('click', async (e) => {
          const target = e.currentTarget.parentNode;
          const content = target.children[1];
          target.children[0].children[0].classList.toggle('v-icon-rotate');

          if (content.scrollHeight === 0) {
            content.classList.toggle('event-detail__about-col__tab__content-active');
            content.setAttribute('style', `height: ${content.scrollHeight + 17}px`);
          } else {
            content.setAttribute('style', `height: 0px`);
            setTimeout(() => { content.classList.toggle('event-detail__about-col__tab__content-active') }, 350);
          }
        });
      }
    }
  }

  render() {
    this.innerHTML = `
            <div class="container-xl event-detail__about-cols pt-4 pb-4 pb-md-5">
              <div class="event-detail__about-col">
                <div class="event-detail__about-col__tab">
                  <div class="event-detail__about-col__tab__title d-flex justify-content-between">Адрес и часы работы <img class="v-icon" src="./assets/icons/v-arrow.svg" alt="v-icon"></div>
                  <div class="event-detail__about-col__tab__content gap-4">
                    <div class="d-flex gap-2 align-items-start">
                      <img class="event-detail__about-col__tab__content__img" src="./assets/section-event-detail/map.svg" alt="map">
                      <div>Историческое здание, Лаврушинский переулок, д. 10</div>
                    </div>
                    <div class="d-flex gap-2 align-items-start">
                      <img class="event-detail__about-col__tab__content__img" src="./assets/section-event-detail/phone.svg" alt="map">
                      <div><a href="tel:+74959570727" style="text-decoration: none; color: #333">8 (495) 957-07-27</a></div>
                    </div>
                    <div class="d-flex gap-2 align-items-start">
                      <img class="event-detail__about-col__tab__content__img" src="./assets/section-event-detail/clock.svg" alt="map">
                      <div class="d-flex flex-column gap-4">
                        <div>
                          <div>ВС, ВТ, СР: 10:00 — 18:00 (кассы до 17:00)</div>
                          <div>ПН: выходной</div>
                          <div>ЧТ, ПТ, СБ: 10:00 — 21:00 (кассы до 20:00)</div>
                        </div>
                        <div class="graphic-online">
                          <div>Сегодня откроется в 10:00</div>
                          <div>Завтра выходной</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="event-detail__about-col">
                <div class="event-detail__about-col__tab">
                  <div class="event-detail__about-col__tab__title d-flex justify-content-between">Билеты <img class="v-icon" src="./assets/icons/v-arrow.svg" alt="v-icon"></div>
                  <div class="event-detail__about-col__tab__content gap-3">
                    <ul class="event-detail__about-item">
                      <li>Взрослые — 500 ₽</li>
                      <li>Льготные — 0, 250, 300 ₽</li>
                    </ul>
                    <a href="https://www.tretyakovgallery.ru/tickets#/buy/event/3765" target="_blank" style="max-width: 162px" class="btn btn-outline-primary">КУПИТЬ БИЛЕТ</a>
                    <div class="d-flex flex-column gap-3">
                      <div>Присоединяйтесь к индивидуальной программе  лояльности «Друзья Третьяковской галереи» и посещайте все выставки музея без очереди и без билета в течение года.</div>
                      <a href="https://www.tretyakovgallery.ru/support/drug-tretyakovki" target="_blank" style="max-width: 220px" class="btn btn-red d-flex align-items-center gap-2 justify-content-center">
                        <img src="./assets/section-event-detail/friend.svg" alt="friend"><span>Стать другом</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="event-detail__about-col">
                <div class="event-detail__about-col__tab">
                  <div class="event-detail__about-col__tab__title d-flex justify-content-between">Требования и сервисы <img class="v-icon" src="./assets/icons/v-arrow.svg" alt="v-icon"></div>
                  <div class="event-detail__about-col__tab__content gap-3">
                    <div class="event-detail__about-item d-flex gap-2">
                      <div class="event-detail__about-icon"><img src="./assets/section-event-detail/rules.svg" alt="rules"></div>
                      <div class="event-detail__about-icon"><img src="./assets/section-event-detail/photo.svg" alt="photo"></div>
                      <div class="event-detail__about-icon"><img src="./assets/section-event-detail/invalid.svg" alt="invalid"></div>
                    </div>
                    <div class="event-detail__about-item">
                      <a href="https://www.tretyakovgallery.ru/about/faq" target="_blank">Ответы на частые вопросы</a>
                    </div>
                    <div class="event-detail__about-item">
                      <a href="https://www.tretyakovgallery.ru/for-visitors/new-rules/" target="_blank">Правила посещения</a>
                    </div>
                    <div class="event-detail__about-item">
                      <a href="/" target="_blank">Доступный музей</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `
  }
}

export default TgEventDetail;