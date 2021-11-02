import AbstractView from './AbstractView';

export default class ForbiddenView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Доступ запрещен");
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view">
                <h2 style="text-align: center">Доступ запрещен</h2>
            </div>
        </section>
      </div>
    `)
  }
}