import { createPhoto } from "./createPhoto";
import "./css/styles.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import axios from "axios";

const inputEl = document.querySelector("input[name='searchQuery']");
const searchBtnEl = document.querySelector("button[type='submit']");
const galleryEl = document.querySelector(".gallery");
const loadBtnEl = document.querySelector(".load-more");

const API_URL = "https://pixabay.com/api/";
const API_KEY = "36364572-be11ddf9e4d275e46894a73aa";

let page = 1;

const searchPixa = async () => {
  const res = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: inputEl.value,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });
  return res;
};

const loadPhotos = () => {
  searchPixa()
    .then((photos) => {
      const totalHits = photos.data.total;
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      if (photos.data.hits.length === 0) throw new Error();
      if (totalHits > 40) {
        loadBtnEl.style.visibility = "visible";
      }
      galleryEl.innerHTML = createPhoto(photos);
      let lightbox = new SimpleLightbox(".gallery a");
      page += 1;
    })
    .catch((error) => {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    });
};

const loadMorePhotos = () => {
  searchPixa().then((photos) => {
    const totalHits = photos.data.total;
    const totalPages = totalHits / 40;
    if (page > totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    galleryEl.insertAdjacentHTML("beforeend", createPhoto(photos));
    let lightbox = new SimpleLightbox(".gallery a");
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 15,
      behavior: "smooth",
    });
  });
};

searchBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  page = 1;
  loadPhotos();
});

loadBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  page += 1;
  loadMorePhotos();
});
