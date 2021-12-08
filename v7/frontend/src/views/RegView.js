import AbstractView from './AbstractView';
import {navigateTo} from "../utils/router";

export default class RegView extends AbstractView {
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
    surname: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    patronymic: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    email: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    vk: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    date: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    sex: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    password: {
      value: {
        value: null,
        element: null,
      },
      errors: {
        value: [],
        element: null,
      },
    },
    passwordConfirm: {
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

  constructor(params) {
    super(params);
    this.setTitle("Регистрация");
  }

  errorsRender = async (fieldName) => {
    this.form[fieldName].errors.value.forEach(error => {
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('form-errors-item');
      errorDiv.innerText = error;

      this.form[fieldName].errors.element.appendChild(errorDiv);
    });
  }

  validateField = async (fieldName) => {
    let validateStatus = true;

    if (fieldName === 'passwordConfirm' || fieldName === 'password') {
      if (this.form.passwordConfirm.value.value !== this.form.password.value.value) {
        this.form.passwordConfirm.errors.value.push('Пароль не совпадает');
        if (fieldName === 'password') {
          if (this.form.passwordConfirm.value.value) {
            this.form.passwordConfirm.value.element.dispatchEvent(new Event('input'));
          }
        }
        validateStatus = false;
      } else {
        this.form.passwordConfirm.errors.element.innerHTML = '';
      }
    }

    if (!this.form[fieldName].value.value) {
      this.form[fieldName].errors.value.push('Поле не заполнено');
      validateStatus = false;
    }

    return validateStatus;
  }

  dataUpdate = async (e) => {
    const fieldName = e.target.getAttribute('about');

    if (fieldName) {
      this.form[fieldName].value.value = this.form[fieldName].value.element?.value;
      this.form[fieldName].errors.value = [];
      this.form[fieldName].errors.element.innerHTML = '';

      const validateStatus = await this.validateField(fieldName);

      if (!validateStatus) {
        await this.errorsRender(fieldName);
      }
    }
  }

  dataSetUp = async () => {
    const formDom = document.querySelector('#auth-data').children;

    for(const item of formDom) {
      const fieldName = item.getAttribute('about');
      if (fieldName) {
        this.form[fieldName].value.value = item.children[1]?.value;
        this.form[fieldName].value.element = item.children[1];

        this.form[fieldName].errors.value = [];
        this.form[fieldName].errors.element = item.children[2];
        this.form[fieldName].errors.element.innerHTML = '';

        this.form[fieldName].value.element.addEventListener('input', async (e) => {
          await this.dataUpdate(e);
        });
      }
    }
  }

  getForm = async () => {
    const form = new FormData;
    let validateStatus = true;

    for (const [key, field] of Object.entries(this.form)) {
      const validateFieldStatus = await this.validateField(key);
      if (!validateFieldStatus) {
        validateStatus = false;
        await this.errorsRender(key);
      }
    }

    if (validateStatus) {
      for (const [key, field] of Object.entries(this.form)) {
        form.append(key, field.value.value);
      }
      return form;
    } else {
      return null;
    }
  }

  setUser = async () => {
    const generalErrors = document.querySelector('.form-general-errors');
    generalErrors.innerHTML = '';
    const form = await this.getForm();

    if (form) {
      let response = await fetch('api/reg', {
        method: 'POST',
        body: form,
      });

      response = await response.json();

      if (response.status) {
        localStorage.setItem('token', response.model.token);

        await navigateTo('/paintings');
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
    await this.dataSetUp();

    document.querySelector('#tg-reg-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.setUser();
    });
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view">
                <h2>Регистрация</h2>
                <form class="tg-form" id="tg-reg-form">
                    <div class="tg-form-row" id="auth-data">
                      <div class="form-input-inner" about="name">
                        <span>Имя</span>
                        <input id="reg-name" type="text" class="form-control"  about="name">
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="surname">
                        <span>Фамилия</span>
                        <input id="reg-surname" type="text" class="form-control"  about="surname">
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="patronymic">
                        <span>Отчество</span>
                        <input id="reg-patronymic" type="text" class="form-control"  about="patronymic">
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="email">
                        <span>E-mail</span>
                        <input id="reg-email" type="email" class="form-control" about="email">
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="vk">
                        <span>Ссылка на профиль Вконтакте</span>
                        <input id="reg-vk" type="text" class="form-control"  about="vk">
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="date">
                        <span>Дата рождения</span>
                        <input id="reg-date" type="text" class="form-control"  about="date">
                        <div class="form-errors"></div>
                      </div>
                       <div class="form-input-inner" about="sex">
                        <span>Пол</span>
                        <select id="reg-sex" class="form-select"  about="sex">
                            <option selected value="">Выберите пол</option>
                             <option value="0">Мужской</option>
                             <option value="1">Женский</option>
                        </select>
                        <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="password">
                          <span>Пароль</span>
                          <input id="reg-password" type="password" class="form-control" about="password">
                          <div class="form-errors"></div>
                      </div>
                      <div class="form-input-inner" about="passwordConfirm">
                          <span>Подтвердите пароль</span>
                          <input id="reg-password-confirm" type="password" class="form-control" about="passwordConfirm">
                          <div class="form-errors"></div>
                      </div>
                    </div>
                    <div class="form-errors form-general-errors"></div>
                    <div class="form-button-inner" style="grid-template-columns: 1fr; justify-content: center; text-align: center">
                        <button id="regSubmit" type="submit" class="btn btn-primary tg-form-button">Зарегистрироваться</button>
                        <div>Уже зарегистрированы? <a href="/login" data-link style="text-decoration: none">Войти</a></div>
                    </div>  
                </form>
            </div>
        </section>
      </div>
    `)
  }
}