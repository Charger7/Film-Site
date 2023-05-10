const API_KEY = "703cce9d-e7cf-424a-b1eb-f6cfb7de4bad";

const TOP_URL =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(TOP_URL);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respDate = await resp.json();
  showMovies(respDate);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  // Очищение предидущих фильмов
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <div class="movie__cover-inner">
            <img
              src="${movie.posterUrlPreview}"
              class="movie__cover"
              alt="${movie.nameRu}"
            />
            <div class="movie__cover-lightness"></div>
            </div>
            <div class="movie__info">
            <div class="movie-title">${movie.nameRu}</div>
            <div class="movie-category">${movie.genres.map(
              (genre) => `${genre.genre}`
            )};</div>
            ${
              movie.rating &&
              `
            <div class="movie-rating movie-rating-${getClassByRate(
              movie.rating
            )}">${movie.rating}</div>
            `
            }
            </div>
            `;
    movieEl.addEventListener("click", () => openModal(movie.filmId));
    moviesEl.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header-search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});

// modal
const modalElement = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respDate = await resp.json();

  modalElement.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");

  modalElement.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respDate.posterUrl}" alt="" />
      <h2>
        <span class="modal__movie-title">${respDate.nameRu}</span>
        <span class="modal__movie-release-year">${respDate.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">${respDate.genres.map(
          (el) => `<span>${el.genre}</span>`
        )}</li>
        <li class="modal__movie-runtime">Длительность - ${
          respDate.filmLength
        } минут</li>
        <li>Сайт: <a class="modal__movie-site" href="${respDate.webUrl}">${
    respDate.webUrl
  }</a></li>
        <li class="modal__movie-overview">${respDate.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>  
    `;

  const buttonClose = document.querySelector(".modal__button-close");
  buttonClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalElement.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalElement) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});
