import AbstractView from './AbstractView';

export default class NotFoundView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Страница не найдена");
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view">
                <h2 style="text-align: center">Error 404 — Страница не найдена</h2>
            </div>
        </section>
      </div>
    `)
  }
}