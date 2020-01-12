import './styles.css';
import './movie.css';
import movies from './apiMovies';
import createPugNav from "./createPugNav";
import templateMovies from "./templates/movies.hbs";
import templateAllFilms from './templates/allFilms.hbs';
import addFilmDetails from "./addFilmDetails";
import cardTemplate from './templates/cardtempl.hbs';
import templateLibrary from "./templates/library.hbs";
const debounce = require('lodash.debounce');

const refs = {
  main: document.querySelector("main"),
  apiKey: "a44fa9b82760a2bc65fcbc5bfbd17e96",
  movie: "movie",
  search: "search",
  library: "library",
  watched: "watched",
  queue: "queue",
};

export default refs;

function addToList(listType, movie) {
  let btn = document.getElementById(listType + "-btn");
  let list = localStorage.getItem(listType);
  if (list) list = JSON.parse(list);
  else list = [];
  if (btn.dataset.flag === "false") {
    list.push(movie);
    localStorage.setItem(listType, JSON.stringify(list));
    btn.dataset.flag = "true";
  } else if (btn.dataset.flag === "true") {
    localStorage.setItem(listType, JSON.stringify(list.filter(el => el.id !== movie.id)));
    btn.dataset.flag = "false";
  }
  changeButtonText(btn, listType);
}

function changeButtonText(btn, listType) {
  if (btn.dataset.flag === "false") btn.textContent = `Add to ${listType}`;
  else if (btn.dataset.flag === "true") btn.textContent = `Remove from ${listType}`;
}

function renderMoviePage() {
  refs.main.classList.add('mainLine');
  addFilmDetails().then(movie => {
    refs.main.innerHTML = cardTemplate(movie);
    let addToWatchedButton = document.getElementById(refs.watched + "-btn");
    let loc = JSON.parse(localStorage.getItem(refs.watched));
    addToWatchedButton.dataset.flag = String(Boolean(loc) && (loc.findIndex(el => el.id === movie.id) !== -1));
    changeButtonText(addToWatchedButton, refs.watched);
    addToWatchedButton.addEventListener("click", () => addToList(refs.watched, movie));
    let addToQueueButton = document.getElementById(refs.queue + "-btn");
    addToQueueButton.dataset.flag = String(Boolean(localStorage.getItem(refs.queue)));
    loc = JSON.parse(localStorage.getItem(refs.queue));
    addToQueueButton.dataset.flag = String(Boolean(loc) && (loc.findIndex(el => el.id === movie.id) !== -1));
    changeButtonText(addToQueueButton, refs.queue);
    addToQueueButton.addEventListener("click", () => addToList(refs.queue, movie));
  });
}

function popstateChange() {
  refs.main.classList.remove("mainLine");
  if (location.hash.startsWith("#" + refs.search)) {
    let moviesList;
    if (!refs.main.querySelector("#movie-input")) {
      refs.main.innerHTML = templateAllFilms();
      function inputHandler(e) {
        location.hash = `#search?request=${e.target.value.replace(" ", "+")}&page=1`;
      }
      document.querySelector("#movie-input").addEventListener('input', debounce(inputHandler, 400));
      moviesList = document.querySelector("#movies");
      moviesList.addEventListener("click", e => {
        if (e.target.closest(".movie"))
          location.hash = `#movie?id=${e.target.closest(".movie").dataset.id}`
      });
    }
    if (location.hash !== "#" + refs.search) {
      if (!moviesList) moviesList = document.querySelector("#movies");
      let params = new URLSearchParams(location.hash.replace("#" + refs.search, ""));
      let page = params.get("page");
      movies.fetchMovies(params.get("request"), page).then(data => {
        moviesList.innerHTML = templateMovies(data);
        createPugNav(data.total_pages, params.get("page"));
        document.getElementById("prev-btn").addEventListener("click", () => {
          location.hash = location.hash.replace(/page=\d+/, `page=${Math.max(1, Number(page) - 1)}`);
        });
        document.getElementById("next-btn").addEventListener("click", () => {
          location.hash = location.hash.replace(/page=\d+/, `page=${Math.min(data.total_pages, Number(page) + 1)}`);
        })
      });
    }
  } else if (location.hash.startsWith("#" + refs.movie)) {
    renderMoviePage();
  } else if (location.hash.startsWith("#" + refs.library)) {
    if (location.hash === "#" + refs.library) location.hash = "#library?active=watched";
    let params = new URLSearchParams(location.hash.replace("#" + refs.library, ""));
    refs.main.innerHTML = templateLibrary(refs);
    let obj = {
      results: localStorage.getItem(params.get("active")),
    };
    if (obj.results) {
      obj.results = JSON.parse(obj.results);
      let moviesList = document.getElementById("movies");
      moviesList.innerHTML = templateMovies(obj);
      moviesList.addEventListener("click", e => {
        if (e.target.closest(".movie"))
          location.hash = `#movie?id=${e.target.closest(".movie").dataset.id}`
      });
    }
    Array.from(document.querySelectorAll(".list-type-button")).forEach(el => el.addEventListener("click", () => {
      location.hash = location.hash.replace(/active=[a-zA-Z]+/, `active=${el.dataset.type}`);
    }));
  }
  else location.hash = "#" + refs.search;
}

window.addEventListener("popstate", () => {
  popstateChange();
});

popstateChange();

