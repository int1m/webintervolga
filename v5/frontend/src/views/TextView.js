import AbstractView from "./AbstractView";

export default class TextView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Обработка HTML");
  }

  async onMounted() {
    document.querySelector('#tg-text-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.formHandling();
    });

    const params = (new URL(document.location)).searchParams;
    if (params.get('preset')) {
      await this.setPreset(params.get('preset'));
    }
  }

  async setPreset(presetParam) {
    const textHtml = document.querySelector('#text-html');
    let response = null;
    switch (presetParam) {
      case '1':
        response = await fetch('api/storage/public/presetOne.html');
        textHtml.innerHTML = await response.text();
        break;
      case '2':
        response = await fetch('api/storage/public/presetTwo.html');
        textHtml.innerHTML = await response.text();
        break;
      case '3':
        response = await fetch('api/storage/public/presetThree.html');
        textHtml.innerHTML = await response.text();
        break;
    }
  }

  async htmlTextClearing(textHtml) {
    const domParser = new DOMParser();

    const page = domParser.parseFromString(textHtml, 'text/html');
    const clearHtml = page.body;

    clearHtml.querySelectorAll('script').forEach(node => node.remove());
    clearHtml.querySelectorAll('style').forEach(node => node.remove());
    clearHtml.querySelectorAll('iframe').forEach(node => node.remove());

    return clearHtml;
  }

  async htmlTextTaskOne(page) {
    const result = document.querySelector('#tg-text-task-item-result-1');
    result.innerHTML = '';

    const headers = page.querySelectorAll('h1 ,h2');

    let ol = document.createElement('ol');

    headers.forEach(header => {
      if (header.tagName === 'H1') {
        const li = document.createElement('li');
        li.textContent = header.textContent;
        const olH2 = document.createElement('ol');
        li.appendChild(olH2);
        ol.appendChild(li);
      }

      if (header.tagName === 'H2') {
        const li = document.createElement('li');
        li.innerHTML = header.innerHTML;
        ol.lastChild.lastChild.appendChild(li);
      }
    });

    result.appendChild(ol);
  }

  async htmlTextTaskTwo(page) {
    const result = document.querySelector('#tg-text-task-item-result-2');
    result.innerHTML = '';

    const sentences = page.querySelectorAll('p');

    const rowTextSentences = [];

    sentences.forEach(item => {
      const rowItem = item.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");
      rowTextSentences.push(rowItem)
    });

    let longSentence = rowTextSentences.reduce((prev, cur) => prev.length > cur.length ? prev : cur);

    page.querySelectorAll('p').forEach(p => {
      if (p.textContent === longSentence) {
        p.setAttribute('id', 'longSentence');
        return p;
      }
    });

    longSentence = longSentence.substring(0, 80);
    longSentence = longSentence.split(' ');

    const a = document.createElement('a');
    if (longSentence.length > 2) {
      a.text = `${longSentence[longSentence.length - 2]} ${longSentence[longSentence.length - 1]}…`;
      a.href = '#longSentence';
      a.setAttribute('data-link', '');
    }

    const div = document.createElement('div');

    longSentence.forEach((item, index) => {
      if (index < longSentence.length - 2) {
        div.textContent += `${item} `;
      }
    });
    div.appendChild(a);

    result.innerHTML = div.innerHTML;
    return page;
  }

  async htmlTextTaskThree(page) {
    const result = document.querySelector('#tg-text-task-item-result-3');
    result.innerHTML = '';

    const refsBody = document.createElement('div');
    refsBody.style.display = 'flex';
    refsBody.style.flexDirection = 'column';
    page.querySelectorAll('a').forEach((item, index) => {
      const a = document.createElement('a');
      a.text = `Ссылка ${index + 1} "${item.textContent}"`;
      a.href = `#aRef-${index}`;
      a.setAttribute('data-link', '');
      refsBody.appendChild(a);

      item.setAttribute('id', `aRef-${index}`);
      return item;
    });

    result.appendChild(refsBody);
    return page;
  }

  async htmlTextTaskFour(page) {
    const result = document.querySelector('#tg-text-task-item-result-4');
    result.innerHTML = '';

    const allWords = {};

    const pageText = page.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");

    const russianSymbols = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я'];

    pageText.split(' ').forEach(word => {
      if (word.length > 2 && russianSymbols.find(item => item === word[0])) {
        if (allWords[word]) {
          allWords[word].count += 1;
        } else {
          allWords[word] = {
            count: 1,
          }
        }
      }
    });

    const sorted = Object.entries(allWords).sort((a, b) => a[1].count - b[1].count).reverse();
    const allWordsSortedArray = sorted.slice(0, 100);

    const refsBody = document.createElement('tag');
    refsBody.style.display = 'flex';
    refsBody.style.flexDirection = 'column';

    allWordsSortedArray.forEach((item, index) => {
      const a = document.createElement('a');
      a.textContent = `${item[0]} — ${item[1].count}`;
      a.href = `#wordRef${index}`;
      a.setAttribute('data-link', '');
      refsBody.appendChild(a);

      const word = document.createElement('p');
      word.textContent = item[0];
      word.setAttribute('id', `wordRef${index}`);
      word.style.color = '#5368ea';

      page.innerHTML = page.innerHTML.replace(item[0], word.outerHTML);
    });

    result.appendChild(refsBody);
    return page;
  }

  async formHandling() {
    const textHtml = document.querySelector('#text-html').value;
    const introducedHtml = document.querySelector('#introduced-html');
    let page = await this.htmlTextClearing(textHtml);

    document.querySelector('#tg-text-task-frame').style.display = 'flex';

    await this.htmlTextTaskOne(page);
    page = await this.htmlTextTaskTwo(page);
    page = await this.htmlTextTaskThree(page);
    page = await this.htmlTextTaskFour(page);

    introducedHtml.innerHTML = page.innerHTML;
  }

  async getHtml() {
    return await super.getHtml(`
      <style>
        .form-input-inner-html {
            min-width: 700px;
        }
        
        .full-view-html {
            max-width: unset;
        }
        
        @media (max-width: 764px) {
          .form-input-inner-html {
              min-width: 320px;
          }
        }
        
        #tg-text-task-frame {
            max-width: 700px;
            display: none;
            flex-direction: column;
            gap: 10px;
        }
        
        .tg-text-task-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
      </style>
      <div class="container-xl">
        <section class="full-view-section">
            <div class="full-view full-view-html">
                <h2>HTML обработка</h2>
                <form class="tg-form" id="tg-text-form">
                    <div class="tg-form-row">
                      <div class="form-input-inner form-input-inner-html">
                        <span>HTML код</span>
                        <textarea id="text-html" class="form-control" rows="5"></textarea>
                      </div>
                    </div>
                    <div class="form-errors form-general-errors"></div>
                    <div class="form-button-inner">
                        <button id="textSubmit" type="submit" class="btn btn-primary tg-form-button">Отправить</button>
                    </div>
                </form>
                <div class="mt-5" id="tg-text-task-frame">
                  <h2>Выполненные задания</h2>
                  <div class="tg-text-task-container">
                      <div class="tg-text-task-item">
                          <h5>Задание 1</h5>
                          <div class="tg-text-task-item-result" id="tg-text-task-item-result-1"></div>
                      </div>
                      <div class="tg-text-task-item">
                          <h5>Задание 2</h5>
                          <div class="tg-text-task-item-result" id="tg-text-task-item-result-2"></div>
                      </div>
                      <div class="tg-text-task-item">
                         <h5>Задание 3</h5>
                          <div class="tg-text-task-item-result" id="tg-text-task-item-result-3"></div>
                      </div>
                      <div class="tg-text-task-item">
                          <h5>Задание 4</h5>
                          <div class="tg-text-task-item-result" id="tg-text-task-item-result-4"></div>
                      </div>
                  </div>
                  <div>
                    <h2>Введенный HTML</h2>
                    <div id="introduced-html"></div>
                  </div>
                </div>
            </div>
        </section>
      </div>
    `)
  }
}