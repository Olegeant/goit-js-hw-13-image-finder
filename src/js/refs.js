export default function getRefs() {
  const searchForm = document.querySelector('#search-form');
  const inputField = searchForm.querySelector('[data-action="input"]');
  const submitBtn = document.querySelector('[data-action="submit"]');
  const loadMoreBtn = document.querySelector('[data-action="load-more"]');
  const gallery = document.querySelector('.gallery');
  const preloader = document.querySelector('.preloader');
  const upArrow = document.querySelector('[data-action="back-to-top"]');
  const downArrow = document.querySelector('[data-action="down-to-bottom"]');
  const sentinel = document.querySelector('#sentinel');

  return {
    searchForm,
    inputField,
    submitBtn,
    loadMoreBtn,
    gallery,
    preloader,
    upArrow,
    downArrow,
    sentinel,
  };
}
