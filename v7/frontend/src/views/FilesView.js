import AbstractView from "./AbstractView";

export default class FilesView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Работа с файлами");
  }

  async onMounted() {
    document.querySelector('#tg-export-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.exportForm();
    });

    document.querySelector('#tg-import-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.importForm();
    });
  }


  async exportForm() {
    const result = document.querySelector('#export-result');
    const errors = document.querySelector('#export-errors');
    result.innerHTML = '';
    errors.innerHTML = '';

    let response = await fetch('api/files', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    response = await response.json();

    if (response.status) {
      result.innerHTML = `${response.model.fileName} передан в WorkerController.php по протоколу HTTP методом POST.
      Ссылка на скачивание: <a href="http://localhost/tretyakovgallery/v5/api/${response.model.fileSrc}">localhost/tretyakovgallery/v5/api/${response.model.fileSrc}</a>`;
    } else {
      response.errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = error;

        errors.appendChild(errorDiv);
      });
    }
  }

  async importForm() {
    const result = document.querySelector('#import-result');
    const errors = document.querySelector('#import-errors');
    result.innerHTML = '';
    errors.innerHTML = '';

    const filePath = document.querySelector('#tg-import-file-path');
    const form = new FormData;
    form.append('filePath', filePath.value);

    let response = await fetch('api/files', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'POST',
      body: form,
    });
    response = await response.json();

    if (response.status) {
      result.innerHTML = response.model.result;
    } else {
      response.errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = error;

        errors.appendChild(errorDiv);
      });
    }
  }

  async getHtml() {
    return await super.getHtml(`
      <style>        
        .full-view-html {
            width: 100%;
            max-width: 500px;
        }
        
        @media (max-width: 764px) {
          .form-input-inner-html {
              min-width: 100%;
          }
        }
       
        .full-view-section {
            flex-direction: column;
            gap: 30px;
        }
        
        .tg-input-file {
            min-width: 100%;
        }
        
        .form-result {
            margin-top: 20px;
        }
        
        .form-general-errors {
            gap: 6px;
        }
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view full-view-html">
                <h2>Экспорт</h2>
                <form class="tg-form" id="tg-export-form">
                    <h6 class="form-input-inner-html">Экспорт главной таблицы внешнему скрипту в формате CSV</h6>
                    <div class="form-button-inner">
                        <button id="export-submit" type="submit" class="btn btn-primary tg-form-button">Экспортировать</button>
                    </div>
                    <div id="export-result" class="form-result" style="max-width: 700px; overflow-wrap: anywhere"></div>
                    <div id="export-errors" class="form-general-errors"></div>
                </form>
            </div>
            <div class="full-view full-view-html">
                <h2>Импорт</h2>
                <form class="tg-form" id="tg-import-form">
                    <div class="tg-form-row">
                      <div class="form-input-inner form-input-inner-html">
                        <span>Полный путь к файлу</span>
                        <input class="form-control tg-input-file" id="tg-import-file-path" value="D:/Programs/xampp/htdocs/tretyakovgallery/v5/api/storage/public/files/paintings_imported.csv">
                      </div>
                    </div>
                    <div class="form-button-inner">
                        <button id="import-submit" type="submit" class="btn btn-primary tg-form-button">Импортировать</button>
                    </div>
                    <div id="import-result" class="form-result" style="max-width: 700px; overflow-wrap: anywhere"></div>
                    <div id="import-errors" class="form-general-errors"></div>
                </form>
            </div>
        </section>
      </div>
    `)
  }
}