import AbstractView from "../AbstractView.js";

import {navigateTo} from "../../utils/router";

export default class PaintingsEdit extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Изменить картину");
    this.permission = ['users'];
  }

  loadData = async () => {
    const params = (new URL(document.location)).searchParams;
    if (params.get('p_guid')) {
      const searchParams = new URLSearchParams;

      searchParams.append('p_guid', params.get('p_guid'));

      let response = await fetch('/api/paintings?' + searchParams, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      response = await response.json();

      if (response.status) {
        const form = await document.querySelector('tg-paintings-form').virtualDom.setForm(response.model.paintings[0]);
      }
    }

  }

  editPaintings = async () => {
    const generalErrors = document.querySelector('.form-general-errors');
    generalErrors.innerHTML = '';

    const form = await document.querySelector('tg-paintings-form').virtualDom.getForm();
    const params = (new URL(document.location)).searchParams;

    if (form && params.get('p_guid')) {
      const searchParams = new URLSearchParams;

      searchParams.append('p_guid', params.get('p_guid'));

      let response = await fetch('/api/paintings/edit?' + searchParams, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: form,
      });

      response = await response.json();

      if (response.status) {
        const formResult = document.querySelector('#tg-form-result');
        formResult.innerHTML = 'Картина успешно изменена!';
        await navigateTo('/paintings');
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
      await this.editPaintings();
    });

    await this.loadData();
  }


  async getHtml() {
    return await super.getHtml(`
          <div class="container-xl">
            <section class="full-view-section">
              <div class="full-view">
                  <div class="d-flex gap-2 align-items-center mb-2">
                    <a href="/paintings" data-link><img src="./../../assets/icons/v-arrow-left.svg" alt="back"></a>
                    <h2 style="margin: 0">Изменение картины</h2>
                  </div>
                  <form id="tg-form">
                     <tg-paintings-form></tg-paintings-form>
                     <div class="form-errors form-general-errors"></div>
                     <div class="form-button-inner" style="grid-template-columns: 1fr; justify-content: center; text-align: center">
                        <button id="regSubmit" type="submit" class="btn btn-primary tg-form-button">Изменить</button>
                        <div id="tg-form-result"></div>
                     </div>  
                   </form>
              </div>
            </section>
          </div>
    `)
  }
}