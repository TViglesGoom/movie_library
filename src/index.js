import './styles.css';
import movies from './apiMovies';
import templateAllFilms from './templates/allFilms.hbs';
const debounce = require('lodash.debounce');

const refs = {
  filmList: document.querySelector('#js-film-list'),
  searchInput: document.querySelector('#js-input'),
};

fetch(
  'https://api.themoviedb.org/3/search/movie?api_key=a44fa9b82760a2bc65fcbc5bfbd17e96&query=sun',
)
  .then(data => data.json())
  .then(data => {
    /* console.log(data.results[16]); */

    const markup = templateAllFilms(data);
    refs.filmList.innerHTML = markup;
  });

function inputHandler(e) {
  const searchQuery = e.target.value;
  console.dir(searchQuery);

  movies.fetchMovies(searchQuery).then(data => {
    console.dir(searchQuery);
  });
}
const debounceInputHandler = debounce(e => {
  inputHandler(e);
}, 1000);

refs.searchInput.addEventListener('input', e => {
  debounceInputHandler(e);
});
