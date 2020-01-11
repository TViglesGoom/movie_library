const baseUrl = 'https://api.themoviedb.org/3/search/movie';
export default {
  fetchMovies(request) {
    const requestParams = `/${request}`;
    return fetch(baseUrl + requestParams).then(data => data.json());
  },
};
