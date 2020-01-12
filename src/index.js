import './styles.css';

function handleClick(e) {
    console.dir(e.target)
    if (e.target.classList.contains("pug-btn")) {
        location.hash = `#watched?page=${e.target.dataset.page}`;
        console.log(location.hash)
    }
}

//достастаем список просмотренных фильмов из LocalStorage

let watched = localStorage.getItem('watched');
if (watched) {
    const main = document.querySelector("main");
    // let watchedArray = [];
    // for (let i = 0; i < 112; i++) {
    //     watchedArray.push(i);
    // }

    const watchedArray = JSON.parse(watched);

    //получаем ссылку на кнопку addToWatched

    // const refs = {
    //     watchedBtn: document.querySelector(".js-watched-btn")
    // }

    //вешаем обработчик событий на кнопку addToWatched

    // watchedBtn.addEventListener("click", handleClick);



    //Создаем кнопки 

    let btn = document.createElement('button');
    btn.type = "button";
    btn.id = "Pug";

    // main.appendChild(btn);

    let numbers = Math.ceil(watchedArray.length / 20)

    let res = '';

    for (let i = 0; i < numbers; i++) {
        res += `<button class="pug-btn" data-page="${i + 1}">${i + 1}</button>`;
    }
    const pugNav = document.querySelector("#pug-div");
    pugNav.innerHTML = res;

    pugNav.addEventListener("click", handleClick);


}

// Делаю API запрос 

getWachedFilmsBySearch()

// Функция которая будет возвращать результат fetch к указаному url

function getWachedFilmsBySearch() {
    return fetch(
        'https://api.themoviedb.org/3/search/movie?api_key=a44fa9b82760a2bc65fcbc5bfbd17e96&query=sun&page=1'
    )
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Error fetching data");
        })
        .catch(err => {
            console.error("Error: ", err);
        });
}

function getWachedFilmsList() {
    return fetch(
        'https://api.themoviedb.org/4/list/1?page=1&api_key=a44fa9b82760a2bc65fcbc5bfbd17e96'
    )
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Error fetching data");
        })
        .catch(err => {
            console.error("Error: ", err);
        });
}

//получаем ссылку на кнопку addToWatched

const refs = {
    watchedBtn: document.querySelector(".js-add-to-watched")
}

//вешаем обработчик событий на кнопку addToWatched

refs.watchedBtn.addEventListener("click", handleClickWached);


function handleClickWached(e) {
    console.dir(e.target)
    if (e.target.classList.contains("js-add-to-watched")) {
        getWachedFilmsList()
    }
    console.log(response)
}

