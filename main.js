// Objeto Map para almacenar las películas
const moviesMap = new Map();

// Elementos del formulario
const formAddMovie = document.getElementById('form__addMovie');
const nameInput = document.getElementById('nameInput');
const genderInput = document.getElementById('genderInput');
const timeInput = document.getElementById('timeInput');
const directorInput = document.getElementById('directorInput');
const imageInput = document.getElementById('imageInput');

// Evento submit del formulario para guardar la película
formAddMovie.addEventListener('submit', (event) => {
  event.preventDefault();
  saveMovie();
});

// Función para guardar una película
function saveMovie() {
  // Obtener valores del formulario
  const name = nameInput.value;
  const gender = genderInput.value;
  const time = timeInput.value;
  const director = directorInput.value;
  const image = imageInput.files[0]; // Obtener el archivo de imagen seleccionado, solo el primero, por si acaso

  // Generar un ID único para la película
  const movieId = `movie-${Date.now()}`;

  // Crear objeto de película
  const movie = {
    id: movieId,
    name: name,
    gender: gender,
    time: time,
    director: director,
    image: ''
  };

  // Guardar la película en el mapa
  moviesMap.set(movieId, movie);

  // Crear una nueva tarjeta con la información de la película
  createMovieCard(movie);

  // Cerrar el modal de agregar película
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();

  // Restablecer los valores del formulario
  formAddMovie.reset();

  // Procesar la imagen seleccionada
  if (image) {
    const reader = new FileReader(); //leer archivos, nativo de js

    reader.onload = function (event) {
      // Obtener la URL de la imagen cargada
      const imageURL = event.target.result;

      // Actualizar la propiedad 'image' del objeto 'movie'
      movie.image = imageURL;
      // Actualizar la tarjeta de la película con la imagen
      updateMovieCardImage(movieId, imageURL);
    };

    // Leer el archivo de imagen como una URL de datos
    reader.readAsDataURL(image); // o sea, convertir la imagen a base64 jeje, o si no, F
  }
}

// Función para actualizar la imagen de la tarjeta de película
function updateMovieCardImage(movieId, imageURL) {
  const card = document.querySelector(`[data-card-id="${movieId}"]`);
  if (card) {
    const img = card.querySelector('.card-img-top');
    if (img) {
      img.src = imageURL;
    }
  }
}

// Función para crear una nueva tarjeta de película
function createMovieCard(movie) {
  const cardContainer = document.querySelector('.card__container');

  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.cardId = movie.id;

  const img = document.createElement('img');
  img.classList.add('card-img-top');
  img.alt = '...';
  img.src = movie.image; // Asignar la URL de la imagen
  card.appendChild(img);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.appendChild(cardBody);

  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = movie.name;
  cardBody.appendChild(title);

  const gender = document.createElement('p');
  gender.classList.add('card-text');
  gender.textContent = 'Género: ' + movie.gender;
  cardBody.appendChild(gender);

  const duration = document.createElement('p');
  duration.classList.add('card-text');
  duration.textContent = 'Duración: ' + movie.time;
  cardBody.appendChild(duration);

  const director = document.createElement('p');
  director.classList.add('card-text');
  director.textContent = 'Director: ' + movie.director;
  cardBody.appendChild(director);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Eliminar';
  cardBody.appendChild(deleteButton);

  // Agregar evento para eliminar la película al hacer clic en el botón "Eliminar"
  deleteButton.addEventListener('click', () => {
    deleteMovie(movie.id);
    card.remove();
  });

  cardContainer.appendChild(card);
}



// Función para eliminar una película
function deleteMovie(movieId) {
  moviesMap.delete(movieId);
}

// Función para mostrar el modal de búsqueda
function showSearchModal(movie) {
  const modalTitle = document.querySelector('#searchModal .modal-title');
  const modalBody = document.querySelector('#searchModal .modal-body');

  modalTitle.textContent = movie.name;
  modalBody.innerHTML = `
    <h5 class="card-title" id="mTitle">${movie.name}</h5>
    <p class="card-text--gender" id="mGender">Género: ${movie.gender}</p>
    <p class="card-text--time" id="mDuration">Duración: ${movie.duration}</p>
    <p class="card-text--director" id="mDirector">Director: ${movie.director}</p>
    <img src="${movie.image}" alt="Portada" class="card-img-top">
  `;

  const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
  searchModal.show();

  // Cerrar el modal de la búsqueda
  const modal = bootstrap.Modal.getInstance(document.getElementById('searchModalClose'));
  modal.hide();
}

// Función para buscar una película
function searchMovie() {
  const searchInput = document.querySelector('#searchInput');
  const searchValue = searchInput.value.toLowerCase();

  const matchingMovie = Array.from(moviesMap.values()).find((movie) => {
    const movieTitle = movie.name.toLowerCase();
    const movieDirector = movie.director.toLowerCase();

    return movieTitle.includes(searchValue) || movieDirector.includes(searchValue);
  });

  if (matchingMovie) {
    showSearchModal(matchingMovie);
  } else {
    alert('No se encontró ninguna película con los criterios de búsqueda.');
  }


}

// Agregar evento al botón de búsqueda
const bSearch = document.getElementById('bSearch');
bSearch.addEventListener('click', searchMovie);





