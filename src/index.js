import './sass/main.scss';

import * as basicLightbox from 'basiclightbox';
const throttle = require('lodash/throttle');

import imageCardTemplate from './templates/image-card.hbs';

import getRefs from './js/refs';
import ImageApiService from './js/api-service';
import { addSeparatorySpaces } from './js/utils';
import { registerLoadMoreObserver } from './js/io';

import {
  alertNoMoreImages,
  alertLastImages,
  alertSeachPerformed,
  alertUnforseenError,
  alertBadQuery,
} from './js/notification.js';

const clearOutput = () => {
  refs.inputField.value = '';
  API.resetPage();
  loadMoreObserver.unobserve(refs.sentinel);
  refs.gallery.innerHTML = '';
  refs.upArrow.hidden = true;
  refs.downArrow.hidden = true;
};

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('hidden');
  refs.loadMoreBtn.addEventListener('click', onLoadMore);
};

const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('hidden');
  refs.loadMoreBtn.removeEventListener('click', onLoadMore);
};

const scrollManager = () => {
  refs.upArrow.hidden = pageYOffset < document.documentElement.clientHeight;
  refs.downArrow.hidden =
    pageYOffset + 2 * document.documentElement.clientHeight >
    document.body.scrollHeight;
};

const scrollDown = () => {
  document.querySelector('.gallery-item:last-child').scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
};

const errorHandler = () => {
  alertUnforseenError();
  refs.preloader.classList.add('hidden');
  hideLoadMoreBtn();
};

const onSearch = evt => {
  evt.preventDefault();

  API.searchQuery = refs.inputField.value.trim();
  if (API.searchQuery === '') return;

  refs.preloader.classList.remove('hidden');

  clearOutput();

  API.fetchImages()
    .then(handleImageData)
    .catch(() => errorHandler());
};

const onLoadMore = () => {
  refs.preloader.classList.remove('hidden');

  API.incrementPage();

  API.fetchImages()
    .then(handleImageData)
    .then(() => scrollDown())
    .then(() => hideLoadMoreBtn())
    .catch(() => errorHandler());
};

const onImageClick = evt => {
  const targetCard = evt.target.closest('.photo-card');
  if (!targetCard) return;

  const targetImg = targetCard.querySelector('.gallery-image');

  lightbox.element().querySelector('img').src = targetImg.dataset.source;
  lightbox.show();
};

const onUpArrowClick = () => {
  window.scrollTo({ top: 0, left: pageXOffset, behavior: 'smooth' });
};

const onDownArrowClick = () => {
  const lastImageCard = refs.gallery.lastElementChild;
  lastImageCard.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
};

const handleImageData = data => {
  if (data.hits.length === 0) {
    if (API.page === 1) {
      alertBadQuery();
      hideLoadMoreBtn();
    } else {
      alertNoMoreImages();
    }

    refs.preloader.classList.add('hidden');
    loadMoreObserver.unobserve(refs.sentinel);
    return;
  }

  if (data.hits.length < 12) {
    alertLastImages();
  } else if (API.page === 1) {
    alertSeachPerformed();
  }

  const images = data.hits.map(
    ({ likes, views, comments, downloads, ...rest }) => {
      return {
        ...rest,
        likes: addSeparatorySpaces(likes),
        views: addSeparatorySpaces(views),
        comments: addSeparatorySpaces(comments),
        downloads: addSeparatorySpaces(downloads),
      };
    },
  );

  renderOutput(images);
};

const renderOutput = images => {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(images));

  if (API.page === 1 && images.length === 12) {
    showLoadMoreBtn();
  }

  if (images.length < 12) {
    hideLoadMoreBtn();
  }

  if (API.page !== 1) {
    loadMoreObserver.observe(refs.sentinel);
  }

  refs.preloader.classList.add('hidden');
};

const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);
refs.upArrow.addEventListener('click', onUpArrowClick);
refs.downArrow.addEventListener('click', onDownArrowClick);
refs.gallery.addEventListener('click', onImageClick);
window.addEventListener('scroll', throttle(scrollManager, 500));

const API = new ImageApiService();

const loadMoreObserver = registerLoadMoreObserver(onLoadMore);

const lightbox = basicLightbox.create(`
    <img src="" alt="photo" width="800" height="600">
`);
