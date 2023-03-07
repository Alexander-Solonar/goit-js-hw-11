
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.my_key = '34154048-696478ee83ae53950cc89dadb';
    this.page = 1;
  }

  async fetchCountries() {
    const url = `https://pixabay.com/api/?key=${this.my_key}&q=${this.searchQuery}&image_type=photo&
    orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    const response = await fetch(url);
    const r = await response.json();
    this.page += 1;
    return r;
  }

  set query(newquery) {
    this.searchQuery = newquery;
  }
}
