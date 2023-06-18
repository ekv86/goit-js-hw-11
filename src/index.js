import './sass/index.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const { default: axios } = require("axios");

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmit);
buttonEl.addEventListener('click', onClick);
buttonEl.classList.add('is-hidden');

let searchQuery = '';
let currentPage = 1;
const perPage = 40;

async function getRequest(searchQuery, page = 1) {
  const apiKey = '37435138-9bf6764fd840a5be13ea6794c';
  const baseUrl = 'https://pixabay.com/api/';

  try {
    const response = await axios.get(`${baseUrl}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
    const lightBox = new SimpleLightbox('.gallery a');
    lightBox.refresh();

    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();
   
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
    
    if (response.data.total === 0) {
      throw new Error();
    }
    let totalHits = response.data.totalHits;

    if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

    let totalImages = response.data.total;
    let lastPage = Math.ceil(totalImages / perPage);
    if (page !== lastPage) {
      buttonEl.classList.remove('is-hidden');
    }
    if (totalImages <= perPage) {
      buttonEl.classList.add('is-hidden');
      return
    }

    if (page === lastPage) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      buttonEl.classList.add('is-hidden');
    }
  }
  catch (error) {
    buttonEl.classList.add('is-hidden');
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
}


function onSubmit(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  currentPage = 1;
  buttonEl.classList.add('is-hidden');
  getRequest(searchQuery);
}


function onClick() {
  currentPage += 1;
  getRequest(searchQuery, currentPage);
}


function createMarkup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="280" height="180"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`).join('');
}

// class NewApiSearch {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//     this.perPage = 40;
//     this.totalHits = 0;
//     this.totalImages = 0;
//     this.lastPage = 0;
//   }

//   async getRequest() {
//     const apiKey = '37435138-9bf6764fd840a5be13ea6794c';
//     const baseUrl = 'https://pixabay.com/api/';

//     try {
//       const response = await axios.get(`${baseUrl}?key=${apiKey}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`);
//       galleryEl.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
//       new SimpleLightbox('.gallery a');
//       if (response.data.total === 0) {
//         throw new Error();
//       }

//       this.totalHits = response.data.totalHits;
//       
//       this.totalImages = response.data.total;
//       this.lastPage = Math.ceil(this.totalImages / this.perPage);

//       if (this.page === 1) {
//         Notiflix.Notify.success(`Hooray! We found ${this.totalHits} images.`);
//       }
//       if (this.page !== this.lastPage) {
//         buttonEl.classList.remove('is-hidden');
//       }
//       if (this.totalImages <= this.perPage) {
//         buttonEl.classList.add('is-hidden');
//         return
//       }

//       if (this.page === this.lastPage) {
//         Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//         buttonEl.classList.add('is-hidden');
//       }
//       
//     }
//     catch (error) {
//       buttonEl.classList.add('is-hidden');
//       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//     }
//   }
  
//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }

// }

// const newApiSearch = new NewApiSearch();

// function onSubmit(evt) {
//   evt.preventDefault();
//   galleryEl.innerHTML = '';
//   buttonEl.classList.add('is-hidden');
//   newApiSearch.query = evt.currentTarget.elements.searchQuery.value;
//   newApiSearch.page = 1;
//   newApiSearch.getRequest();
  
// }

// function onClick() {
//   newApiSearch.page += 1;
//   newApiSearch.getRequest();
// }


// function createMarkup(arr) {
//   return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
//     `<div class="photo-card">
//     <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="280" height="180"/></a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//       <span>${likes}</span>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//       <span>${views}</span>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//       <span>${comments}</span>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//       <span>${downloads}</span>
//     </p>
//   </div>
// </div>`).join('');
// }
