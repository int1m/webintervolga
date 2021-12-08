import { FormVirtualDOM } from "../../utils/FormVirtualDOM";

class TgPaintingsForm extends HTMLElement {
  form = {
    name: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    description: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    yearOfCreation: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    authorId: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    file: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
  };


  constructor() {
    super();
  }

  connectedCallback() {
    this.virtualDom = new FormVirtualDOM(this.form, '#tg-paintings-form');
    window.addEventListener('PaintingsCreateOrUpdateMounted', this.getContent);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('PaintingsCreateOrUpdateMounted', this.getContent);
  }

  getContent = async () => {
    await this.getAuthors();
    await this.virtualDom.dataSetUp();
  }

  getAuthors = async () => {
    let response = await fetch('/api/authors', {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    response = await response.json();

    if (response.status) {
      const paintingsAuthorsFilter = document.querySelector('#reg-authorId');
      response.model.authors.forEach(value => {
        const option = document.createElement('option');
        option.innerText = `${value.name} ${value.surname}${value.patronymic ? ` ${value.patronymic}` : ''}`;
        option.value = value.id;

        if (paintingsAuthorsFilter) {
          paintingsAuthorsFilter.appendChild(option);
        }
      });
    }
  }

  render() {
    this.innerHTML = `
      <style>
      </style>
      <div class="tg-form-row" id="tg-paintings-form">
        <div class="form-input-inner" about="name">
          <span>Название картины</span>
          <input id="tg-name" type="text" class="form-control"  about="name">
          <div class="form-errors"></div>
        </div>
        <div class="form-input-inner" about="description">
          <span>Описание картины</span>
          <textarea id="tg-description" class="form-control"  about="description"></textarea>
          <div class="form-errors"></div>
        </div>
        <div class="form-input-inner" about="yearOfCreation">
          <span>Год создания</span>
          <input id="tg-yearOfCreation" type="number" class="form-control"  about="yearOfCreation">
          <div class="form-errors"></div>
        </div>
        <div class="form-input-inner" about="authorId">
          <span>Автор</span>
          <select id="reg-authorId" class="form-select"  about="authorId">
              <option value="0">Выберите автора</option>
          </select>
          <div class="form-errors"></div>
        </div>
        
        <div class="form-input-inner" about="file">
          <span>Изображение</span>
          <input id="tg-file" type="file" about="file">
          <div class="form-errors"></div>
        </div>
      </div>
    `
  }
}

export default TgPaintingsForm;