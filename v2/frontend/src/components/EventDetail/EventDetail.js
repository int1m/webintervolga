const eventDetailCols = document.querySelector('.event-detail__about-cols').children;

for (const col of eventDetailCols) {
    if (col.children[0]) {
        col.children[0].children[0].addEventListener('click', async (e) => {
            const target = e.currentTarget.parentNode;
            const content = target.children[1];
            target.children[0].children[0].classList.toggle('v-icon-rotate');

            if (content.scrollHeight === 0) {
                content.classList.toggle('event-detail__about-col__tab__content-active');
                content.setAttribute('style', `height: ${content.scrollHeight + 17}px`);
            } else {
                content.setAttribute('style', `height: 0px`);
                setTimeout(() => { content.classList.toggle('event-detail__about-col__tab__content-active') }, 350);
            }
        });
    }
}
