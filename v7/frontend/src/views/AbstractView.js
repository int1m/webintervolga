import TgHeader from "./../components/Header/TgHeader";
import TgFooter from "./../components/Footer/TgFooter";

customElements.define('tg-header', TgHeader);
customElements.define('tg-footer', TgFooter);

export default class AbstractView {
  permission = [];


  constructor(params) {
    this.params = params;
  }

  setTitle(title) {
    document.title = title;
  }

  async onMounted() {};

  async getHtml(content) {
    return `
      <tg-header></tg-header>
      <main>
        ${content}
      </main>
      <tg-footer></tg-footer>
    `;
  }
}