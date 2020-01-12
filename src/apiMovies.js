import refs from "./index";


const baseUrl = 'https://api.themoviedb.org/3/search/movie';
export default {
  fetchMovies(searchQuery, page) {
    return fetch(`${baseUrl}?api_key=${refs.apiKey}&query=${searchQuery.replace(" ", "+")}&page=${page}`)
      .then(data => data.json());
  },
};
