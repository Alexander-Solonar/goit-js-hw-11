import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './serverResponse';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonUp = document.querySelector('.up');

buttonUp.style.display = 'none';

const newApiService = new ApiService();
let lightbox = new SimpleLightbox('.gallery a');
let isloading = false;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const userInput = e.currentTarget.elements.searchQuery.value.trim();
  newApiService.query = userInput;

  if (userInput === '') {
    return;
  }

  gallery.innerHTML = '';
  buttonUp.style.display = 'none';
  
  newApiService.resetPage();
  onSerarch();
});

async function onSerarch() {
  isloading = true;

  const dataServer = await newApiService.serverResponse();

  if (!dataServer) {
    notiflixWarning();
    return;
  }
  if (dataServer.total === 0) {
    notiflixFailure();
  } else if (newApiService.page === 2) {
    notiflixSuccess(dataServer.totalHits);
  }

  createMarcup(dataServer.hits);
  isloading = false;
}

window.addEventListener('scroll', () => {
  if (isloading) return;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  showButton(scrollTop);
  if (scrollHeight - scrollTop - 1000 <= clientHeight) {
    onSerarch();
  }
});

buttonUp.addEventListener('click', scrollPageUp);

function showButton(scrollTop) {
  if (scrollTop > 500) {
    buttonUp.style.display = 'block';
  } else {
    buttonUp.style.display = 'none';
  }
}

function scrollPageUp() {
  const { height: cardHeight } = gallery.getBoundingClientRect();

  window.scrollBy({
    top: -cardHeight,
    behavior: 'smooth',
  });
}

function createMarcup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => `<div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"  width = 360 height = 240/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes <br> ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views <br> ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments <br> ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads <br> ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function notiflixSuccess(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notiflixFailure() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notiflixWarning() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}
