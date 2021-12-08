class TgPaintings extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    window.addEventListener('PaintingsViewMounted', this.getContent);
    this.addEvents();
  }

  disconnectedCallback() {
    window.removeEventListener('PaintingsViewMounted', this.getContent);
  }

  addEvents() {
    document.querySelector('#painting-filter-yearStart').addEventListener('input', async () => await this.getPaintings());
    document.querySelector('#painting-filter-yearEnd').addEventListener('input', async () => await this.getPaintings());
    document.querySelector('#painting-filter-author').addEventListener('change', async () => await this.getPaintings());
    document.querySelector('#painting-filter-name').addEventListener('input', async () => await this.getPaintings());
    document.querySelector('#painting-filter-clear').addEventListener('click', async () => await this.clearFilter());
  }

  getContent = async () => {
    await this.getAuthors();
    await this.getPaintings();
  }

  getFiltersParam = async () => {
    const searchParams = new URLSearchParams;

    const filterYearStart = document.querySelector('#painting-filter-yearStart');
    const filterYearEnd = document.querySelector('#painting-filter-yearEnd');
    const filterAuthor = document.querySelector('#painting-filter-author');
    const filterName = document.querySelector('#painting-filter-name');
    if (filterYearStart?.value) {
      searchParams.append('yearStart', filterYearStart.value);
    }
    if (filterYearEnd?.value) {
      searchParams.append('yearEnd', filterYearEnd.value);
    }
    if (filterAuthor?.value) {
      searchParams.append('author', filterAuthor.value);
    }
    if (filterName?.value) {
      searchParams.append('name', filterName.value);
    }
    return searchParams;
  }

  clearFilter = async () => {
    const paintingFilterYearStart = document.querySelector('#painting-filter-yearStart');
    const paintingFilterYearEnd = document.querySelector('#painting-filter-yearEnd');
    const paintingFilterAuthor = document.querySelector('#painting-filter-author');
    const paintingFilterName = document.querySelector('#painting-filter-name');
    if (paintingFilterYearStart) {
      paintingFilterYearStart.value = null;
    }
    if (paintingFilterYearEnd) {
      paintingFilterYearEnd.value = null;
    }
    if (paintingFilterAuthor) {
      paintingFilterAuthor.value = '';
    }
    if (paintingFilterName) {
      paintingFilterName.value = null;
    }
    await this.getPaintings();
  }

  getAuthors = async () => {
    let response = await fetch('api/authors', {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    response = await response.json();

    if (response.status) {
      const paintingsAuthorsFilter = document.querySelector('#painting-filter-author');

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

  deletePaintings = async (p_guid) => {
    console.log(p_guid);

    const searchParams = new URLSearchParams;

    searchParams.append('p_guid', p_guid);

    let response = await fetch('/api/paintings?' + searchParams, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'DELETE',
    });

    response = await response.json();

    console.log(response);

    await this.getPaintings();
  }

  getPaintings = async () => {
    const searchParams = await this.getFiltersParam();
    let response = await fetch('api/paintings?' + searchParams, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    response = await response.json();
    const paintingsContainer = document.querySelector('.paintings-container');
    if (response.status) {
      if (paintingsContainer) {
        paintingsContainer.innerHTML = '';
      }

      response.model.paintings.forEach(painting => {
        const paintingItem = document.createElement('div');

        paintingItem.innerHTML = `
          <div class="painting__img" style='background-image: url("data:image/png;base64,${painting.image}")'"></div>
          <div class="painting__header">
            <div class="painting__name">${painting.name}</div>
            <div class="painting__tools">
                <a href="/paintings/edit?p_guid=${painting.p_guid}" data-link><img src="./../../assets/icons/edit.svg" alt="edit"></a>
                <div onclick="this.closest('tg-paintings').deletePaintings('${painting.p_guid}')"><img src="./../../assets/icons/delete.svg" alt="delete"></div>
            </div>
          </div>
          <div class="painting__author">${painting.author.authorFullName} — ${painting.yearOfCreation} г.</div>
          <div class="painting__disc">${painting.description}</div>
        `;

        paintingsContainer?.appendChild(paintingItem);
      });
    } else {
      if (paintingsContainer) {
        paintingsContainer.innerHTML = '';
      }
      response.errors.forEach(error => {
        const errorItem = document.createElement('div');
        errorItem.classList.add('paintings__errors');
        errorItem.innerText = error;
        paintingsContainer?.appendChild(errorItem);
      });
    }
  }


  render() {
    this.innerHTML = `
      <style>
        .painting-filter {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .painting-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .painting-row {
            grid-template-columns: 1fr;
          }
        }
       
        .painting-filter__bottom button {
            min-width: 220px;
        }
        
        .painting-row-column {
          display: flex;
          gap: 20px;
        }
        
        .painting-row-column button, a {
          width: 100%;
        }
        
        #painting-filter-clear {
          min-width: 180px;
        }
        
        .paintings-container {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
          gap: 40px;
          justify-content: space-between;
        }
        
        .painting__img {
          width: 100%;
          height: 300px;
          background-image: url("http://localhost/tretyakovgallery/v2/api/storage/paintings/1.jpg");
          background-repeat: no-repeat;
          background-size: cover;
          background-position-y: center;
          background-position-x: center;
        }
        
        .painting__header {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
        }
        
        .painting__name {
          font-size: 24px;
          
        }
        
        .painting__tools {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .painting__tools *:hover {
            cursor: pointer;
        }
        
        .painting__author {
          font-size: 16px;
        }
        
        .painting__disc {
          color: #666;
        }
        
        .paintings__errors {
          font-size: 24px;
          text-align: center;
        }
        
        @media (max-width: 500px) {
          .paintings-container {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }
      </style>
      
      <div class="painting-filter">
        <div class="painting-row">
          <div class="form-input">
             <select class="form-select" id="painting-filter-author" aria-label="Default select example">
                <option selected value="">Выберите автора</option>
             </select>
          </div>
    
          <div class="painting-row-column">
            <input type="number" class="form-control" id="painting-filter-yearStart" placeholder="Год создания от">
            <input type="number" class="form-control" id="painting-filter-yearEnd" placeholder="Год создания до">
          </div>
        </div>
        
        
        <div class="painting-row">
            <input type="text" class="form-control" id="painting-filter-name" placeholder="Введите название картины">
    
          <div class="painting-row-column">
           <button class="btn btn-outline-primary" id="painting-filter-clear">Сбросить фильтры</button>
           <a href="/paintings/create" data-link class="btn btn-primary" id="painting-create">Добавить картину</a>
          </div>
        </div>
       
      </div>
      <div class="paintings-container">
      </div>        
    `
  }
}

export default TgPaintings;