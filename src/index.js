import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchCountries } from './fetchContainers';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.load-more');
const MY_API_KEY = '34154048-696478ee83ae53950cc89dadb';

form.addEventListener('submit', onSerarch);

async function onSerarch(e) {
  e.preventDefault();

  const userQuery = e.currentTarget.elements.searchQuery.value;

  try {
    const arrayImages = await fetchCountries(MY_API_KEY, userQuery);
    createMarcup(arrayImages);
    let lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
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

  gallery.innerHTML = markup;
}
