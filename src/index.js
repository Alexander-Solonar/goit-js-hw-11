import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './fetchContainers';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.load-more');

const newApiService = new ApiService();

form.addEventListener('submit', onSerarch);

async function onSerarch(e) {
  e.preventDefault();
  newApiService.query = e.currentTarget.elements.searchQuery.value;

  try {
    const arrayImages = await newApiService.fetchCountries();
    if (arrayImages.hits.length > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${arrayImages.totalHits} images.`
      );
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    createMarcup(arrayImages.hits);
    let lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

btnLoad.addEventListener('click', () => {
  onSerarch();
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
}
