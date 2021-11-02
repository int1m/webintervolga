import AbstractView from './AbstractView';

export default class PublicView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Авторизация");
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view">
                <h2 style="text-align: center">Третьяковская галлерея. Публичная страница</h2>
            </div>
        </section>
      </div>
    `)
  }
}