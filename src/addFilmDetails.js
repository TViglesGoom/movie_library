export default function () {
  const id = location.hash.replace('#movie?id=', '');
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=a44fa9b82760a2bc65fcbc5bfbd17e96`,
  )
    .then(res => res.json());
}
