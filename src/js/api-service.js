const RESOURCE_URL = 'https://pixabay.com/api/';
const API_KEY = '21850804-e13ac47ee6c84255406cdac88';
const PER_PAGE_DEFAULT = 12;

const OPTIONS = {};

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 1;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.currentPage,
      per_page: PER_PAGE_DEFAULT,
      key: API_KEY,
    });

    const url = RESOURCE_URL + '?' + searchParams;

    return fetch(url, OPTIONS).then(response => {
      if (!response.ok) {
        throw new Error('Unforseen error');
      }
      return response.json();
    });
  }

  incrementPage() {
    this.currentPage += 1;
  }

  resetPage() {
    this.currentPage = 1;
  }

  get page() {
    return this.currentPage;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
