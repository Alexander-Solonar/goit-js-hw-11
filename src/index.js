import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './fetchContainers';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.load-more');

btnLoad.style.display = 'none';

const newApiService = new ApiService();
let lightbox = new SimpleLightbox('.gallery a');

async function serverResponse() {
  try {
    return await newApiService.fetchCountries();
  } catch (error) {}
}
form.addEventListener('submit', async e => {
  e.preventDefault();
  const userInput = e.currentTarget.elements.searchQuery.value.trim();
  newApiService.query = userInput;
  if (userInput === '') {
    return;
  }
  gallery.innerHTML = '';
  newApiService.resetPage();
  showInfoMessage();
  onSerarch();
});

async function showInfoMessage() {
  const dataServer = await serverResponse();
  if (dataServer.hits.length > 0) {
    btnLoad.style.display = 'block';
    notiflixSuccess(dataServer.totalHits);
  } else if (dataServer.hits.length === 0) {
    notiflixFailure();
  }
}

async function onSerarch() {
  const dataServer = await serverResponse();
  console.log(dataServer);
  if (dataServer === undefined) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    btnLoad.style.display = 'none';
    return;
  }
  createMarcup(dataServer.hits);
}

btnLoad.addEventListener('click', async () => {
  btnLoad.style.display = 'none';
  onSerarch();
  btnLoad.style.display = 'block';
});

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
