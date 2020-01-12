import './styles.css';
import './movie.css';
import movies from './apiMovies';
import createPugNav from './createPugNav';
import templateMovies from './templates/movies.hbs';
import templateAllFilms from './templates/allFilms.hbs';
import addFilmDetails from './addFilmDetails';
import cardTemplate from './templates/cardtempl.hbs';
import templateLibrary from './templates/library.hbs';
// require('@fontawersome/fontawersome-free/js/all');
const debounce = require('lodash.debounce');

const refs = {
  main: document.querySelector('main'),
  apiKey: 'a44fa9b82760a2bc65fcbc5bfbd17e96',
  movie: 'movie',
  search: 'search',
  library: 'library',
  watched: 'watched',
  queue: 'queue',
};

export default refs;

function addToList(listType, movie) {
  let btn = document.getElementById(listType + '-btn');
  let list = localStorage.getItem(listType);
  if (list) list = JSON.parse(list);
  else list = [];
  if (btn.classList.contains('false')) {
    list.push(movie);
    localStorage.setItem(listType, JSON.stringify(list));
    btn.classList.remove('false');
    btn.classList.add('true');
    btn.textContent = `Remove from ${listType}`;
  } else if (btn.classList.contains('true')) {
    localStorage.setItem(
      listType,
      JSON.stringify(list.filter(el => el.id !== movie.id)),
    );
    btn.classList.remove('true');
    btn.classList.add('false');
    btn.textContent = `Add to ${listType}`;
  }
}

function popstateChange() {
  refs.main.classList.remove('mainLine');
  if (location.hash.startsWith('#' + refs.search)) {
    let moviesList;
    if (!refs.main.querySelector('#movies')) {
      refs.main.innerHTML = templateAllFilms();
      function inputHandler(e) {
        location.hash = `#search?request=${e.target.value.replace(
          ' ',
          '+',
        )}&page=1`;
      }
      document
        .querySelector('#movie-input')
        .addEventListener('input', debounce(inputHandler, 400));
      moviesList = document.querySelector('#movies');
      moviesList.addEventListener('click', e => {
        if (e.target.closest('.movie'))
          location.hash = `#movie?id=${e.target.closest('.movie').dataset.id}`;
      });
    }
    if (location.hash !== '#' + refs.search) {
      if (!moviesList) moviesList = document.querySelector('#movies');
      let params = new URLSearchParams(
        location.hash.replace('#' + refs.search, ''),
      );
      movies
        .fetchMovies(params.get('request'), params.get('page'))
        .then(data => {
          moviesList.innerHTML = templateMovies(data);
          createPugNav(data.total_pages, params.get('page'));
        });
    }
  } else if (location.hash.startsWith('#' + refs.movie)) {
    refs.main.classList.add('mainLine');
    addFilmDetails().then(movie => {
      refs.main.innerHTML = cardTemplate(movie);
      let addToWatchedButton = document.getElementById(refs.watched + '-btn');
      addToWatchedButton.addEventListener('click', () =>
        addToList(refs.watched, movie),
      );
      let addToQueueButton = document.getElementById(refs.queue + '-btn');
      addToQueueButton.addEventListener('click', () =>
        addToList(refs.queue, movie),
      );
    });
  } else if (location.hash.startsWith('#' + refs.library)) {
    let params = new URLSearchParams(
      location.hash.replace('#' + refs.library, ''),
    );
    templateLibrary(refs);
    let list = localStorage.getItem(params.get('active'));
    if (list) {
      list = JSON.parse(list);
      console.log(list);
    }
  } else location.hash = '#' + refs.search;
}

window.addEventListener('popstate', () => {
  popstateChange();
});

popstateChange();
