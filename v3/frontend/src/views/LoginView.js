import AbstractView from "./AbstractView";
import {navigateTo} from "../utils/router";

export default class LoginView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Авторизация");
  }

  async login() {
    const generalErrors = document.querySelector('.form-general-errors');
    generalErrors.innerHTML = '';

    const email = document.querySelector('#login-email');
    const password = document.querySelector('#login-password');

    const form = new FormData;
    form.append('email', email.value);
    form.append('password', password.value);

    let response = await fetch('api/login', {
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

  async onMounted() {
    document.querySelector('#tg-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.login();
    });
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view">
                <h2>Авторизация</h2>
                <form class="tg-form" id="tg-login-form">
                    <div class="tg-form-row">
                      <div class="form-input-inner">
                        <span>E-mail</span>
                        <input id="login-email" type="email" class="form-control">
                      </div>
                      <div class="form-input-inner">
                          <span>Пароль</span>
                          <input id="login-password" type="password" class="form-control">
                      </div>
                    </div>
                    <div class="form-errors form-general-errors"></div>
                    <div class="form-button-inner">
                        <button id="loginSubmit" type="submit" class="btn btn-primary tg-form-button">Войти</button>
                        <a href="/reg" data-link class="btn btn-outline-primary tg-form-button">Регистрация</a>
                    </div>
                </form>
            </div>
        </section>
      </div>
    `)
  }
}