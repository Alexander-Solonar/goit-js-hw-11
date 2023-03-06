import Notiflix from 'notiflix';

export async function fetchCountries(key, query) {
  const url = `https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await fetch(url);
  const r = await response.json();
  if (r.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  return r.hits;
}
