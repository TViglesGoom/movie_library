import './styles.css';
import template from './helpers/cardtempl.hbs';
const mainLine = document.createElement('main');
mainLine.classList.add('mainLine');
mainLine.insertAdjacentHTML(
  'afterbegin',
  '<a class="linkTest" href="/#movie?id=75780">ddddddddddd</a>',
);
// ('<button class="button" style="width:150px;height:50px"></button>');
document.body.prepend(mainLine);
const addFilmDetails = () => {
  const id = Number(location.hash.replace('#movie?id=', ''));
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=a44fa9b82760a2bc65fcbc5bfbd17e96`,
  )
    .then(res => res.json())
    .then(res => {
      mainLine.insertAdjacentHTML('afterbegin', template(res));
    })
    .catch(er => {});
};
window.addEventListener('popstate', addFilmDetails);
