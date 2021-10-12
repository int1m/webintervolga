const getFiltersParam = async () => {
    const searchParams = new URLSearchParams;
    const filterYearStart = document.querySelector('#painting-filter-yearStart');
    const filterYearEnd = document.querySelector('#painting-filter-yearEnd');
    const filterAuthor = document.querySelector('#painting-filter-author');
    const filterName = document.querySelector('#painting-filter-name');
    if (filterYearStart.value) {
        searchParams.append('yearStart', filterYearStart.value);
    }
    if (filterYearEnd.value) {
        searchParams.append('yearEnd', filterYearEnd.value);
    }
    if (filterAuthor.value) {
        searchParams.append('author', filterAuthor.value);
    }
    if (filterName.value) {
        searchParams.append('name', filterName.value);
    }
    return searchParams;
}

const clearFilter = async () => {
    document.querySelector('#painting-filter-yearStart').value = null;
    document.querySelector('#painting-filter-yearEnd').value = null;
    document.querySelector('#painting-filter-author').value = '';
    document.querySelector('#painting-filter-name').value = null;
    await getPaintings();
}

const getPaintings = async () => {
    const searchParams = await getFiltersParam();
    const headers = new Headers();
    headers.append('Content-Type','text/html;charset=UTF-8');
    let response = await fetch('api/paintings?' + searchParams, {
        headers: headers,
    });
    response = await response.json();
    const paintingsContainer = document.querySelector('.paintings-container');
    if (response.status) {
        paintingsContainer.innerHTML = '';
        response.model.paintings.forEach(painting => {
            const paintingItem = document.createElement('div');
            const paintingImg = document.createElement('div');
            paintingImg.classList.add('painting__img');
            paintingImg.style.backgroundImage = `url("http://localhost/tretyakovgallery/v2/api/storage/paintings/${painting.id}.jpg")`
            paintingItem.appendChild(paintingImg);

            const paintingName = document.createElement('div');
            paintingName.classList.add('painting__name');
            paintingName.innerText = painting.name;
            paintingItem.appendChild(paintingName);

            const paintingAuthor = document.createElement('div');
            paintingAuthor.classList.add('painting__author');
            paintingAuthor.innerText = `${painting.author.authorFullName} — ${painting.yearOfCreation} г.`;
            paintingItem.appendChild(paintingAuthor);

            const paintingDisc = document.createElement('div');
            paintingDisc.classList.add('painting__disc');
            paintingDisc.innerText = painting.description;
            paintingItem.appendChild(paintingDisc);

            paintingsContainer.appendChild(paintingItem);
        });
    } else {
        paintingsContainer.innerHTML = '';
        response.errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.classList.add('paintings__errors');
            errorItem.innerText = error;
            paintingsContainer.appendChild(errorItem);
        });
    }
}

const getAuthors = async () => {
    const headers = new Headers();
    headers.append('Content-Type','text/html;charset=UTF-8');
    let response = await fetch('api/authors', {
        headers: headers,
    });
    response = await response.json();

    if (response.status) {
        const paintingsAuthorsFilter = document.querySelector('#painting-filter-author');
        response.model.authors.forEach(value => {
            const option = document.createElement('option');
            option.innerText = `${value.name} ${value.surname}${value.patronymic ? ` ${value.patronymic}` : ''}`;
            option.value = value.id;

            paintingsAuthorsFilter.appendChild(option);
        });
    }
}

window.onload = async () => {
    await getAuthors();
    await getPaintings();
}

document.querySelector('#painting-filter-yearStart').addEventListener('input', async () => await getPaintings());
document.querySelector('#painting-filter-yearEnd').addEventListener('input', async () => await getPaintings());
document.querySelector('#painting-filter-author').addEventListener('change', async () => await getPaintings());
document.querySelector('#painting-filter-name').addEventListener('input', async () => await getPaintings());


document.querySelector('#painting-filter-clear').addEventListener('click', async () => await clearFilter());