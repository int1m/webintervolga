import AbstractView from "../AbstractView.js";

export default class PaintingsCreate extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Добавить картину");
    this.permission = ['users'];
  }

  createPaintings = async () => {
    const generalErrors = document.querySelector('.form-general-errors');
    generalErrors.innerHTML = '';

    const form = await document.querySelector('tg-paintings-form').virtualDom.getForm();

    if (form) {
      let response = await fetch('/api/paintings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: form,
      });

      response = await response.json();

      if (response.status) {
        await document.querySelector('tg-paintings-form').virtualDom.dataReset();
        await document.querySelector('tg-paintings-form').virtualDom.domUpdate();
        const formResult = document.querySelector('#tg-form-result');
        formResult.innerHTML = 'Картина успешно добавлена!';
        setTimeout(async () => {
          formResult.innerHTML = '';
        }, 2000);
      } else {
        response.errors.forEach(error => {
          const errorDiv = document.createElement('div');
          errorDiv.classList.add('form-errors-item');
          errorDiv.innerText = error;
          generalErrors.appendChild(errorDiv);
        });
      }
    }
  }

  async onMounted() {
    window.dispatchEvent(new CustomEvent('PaintingsCreateOrUpdateMounted'));

    document.querySelector('#tg-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.createPaintings();
    });
  }


  async getHtml() {
    return await super.getHtml(`
          <div class="container-xl">
            <section class="full-view-section">
              <div class="full-view">
                  <div class="d-flex gap-2 align-items-center mb-2">
                    <a href="/paintings" data-link><img src="./../../assets/icons/v-arrow-left.svg" alt="back"></a>
                    <h2 style="margin: 0">Добавление картины</h2>
                  </div>
                  <form id="tg-form">
                     <tg-paintings-form></tg-paintings-form>
                     <div class="form-errors form-general-errors"></div>
                     <div class="form-button-inner" style="grid-template-columns: 1fr; justify-content: center; text-align: center">
                        <button id="regSubmit" type="submit" class="btn btn-primary tg-form-button">Добавить</button>
                        <div id="tg-form-result"></div>
                     </div>  
                   </form>
              </div>
            </section>
          </div>
    `)
  }
}