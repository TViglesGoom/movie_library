export default function (number, current) {
  let res = '';
  let pugNav = document.querySelector("#pug-div");
  res += `<button class="pug-btn" data-page="${1}">${1}</button>`;
  current = Math.max(2, current);
  current = Math.min(number - 2, current);
  if (current > 2) {
    res += "<span>...</span>"
  }
  let temp = number > 2 ? 0 : (number === 2 ? 1 : 2);
  for (let i = 0; i < 2 - temp; i++) {
    res += `<button class="pug-btn" data-page="${current + i}">${current + i}</button>`;
  }
  if (current < number - 2) {
    res += "<span>...</span>"
  }
  if (current < number && number > 3) {
    res += `<button class="pug-btn" data-page="${number}">${number}</button>`
  }
  pugNav.innerHTML = res;
  pugNav.addEventListener("click", handleClick);
}

function handleClick(e) {
  if (e.target.classList.contains("pug-btn"))
    location.hash = location.hash.replace(/page=\d+/, `page=${e.target.dataset.page}`);
}
