import axios from 'axios';

export default class ApiService {
  constructor() {
    this.page = 0;
    this.searchQuery = '';
  }

  async serverResponse() {
    const BASE_URL = 'https://pixabay.com/api/';
    const my_key = '34154048-696478ee83ae53950cc89dadb';
    
    const url = `${BASE_URL}?key=${my_key}&q=${this.searchQuery}&image_type=photo&
    orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    try {
      const response = await axios.get(url);
      this.page += 1;
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  set query(newquery) {
    this.searchQuery = newquery;
  }

  resetPage() {
    this.page = 1;
  }
}
