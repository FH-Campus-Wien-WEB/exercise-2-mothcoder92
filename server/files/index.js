
// On load, retrieve all movies from model
window.onload = function () {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        const container = document.getElementById("moviesContainer");

        if (xhr.status === 200) {
            const movies = JSON.parse(xhr.responseText);

            movies.forEach(movie => {
                const card = createMovieCard(movie);
                container.appendChild(card);
            });

        } else {
            container.innerHTML = "Failed to load movies.";
        }
    };

    xhr.open("GET", "/movies");
    xhr.send();
};

// Function to create cards for movies
function createMovieCard(movie) {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-6 col-sm-12";

    // normalize genre
    const genres = Array.isArray(movie.Genre)
        ? movie.Genre
        : movie.Genre.split(",").map(g => g.trim());

    col.innerHTML = `
    <div class="card movie-card h-100">
      <img class="card-img-top" src="${movie.Poster}" alt="Movie poster">

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${movie.Title}</h5>
        <small>${movie.Year} · ${movie.Runtime}</small>

        <div class="mt-2 mb-2">
          ${genres.map(g => `<span class="badge badge-info mr-1">${g}</span>`).join("")}
        </div>

        <p class="flex-grow-1">${movie.Plot}</p>

        <div class="accordion" id="accordion-${movie.imdbID}">
          ${createAccordionSection("Directors", movie.Directors, movie.imdbID)}
          ${createAccordionSection("Actors", movie.Actors, movie.imdbID)}
          ${createAccordionSection("Writers", movie.Writers, movie.imdbID)}
        </div>

        <a href="edit.html?imdbID=${movie.imdbID}" class="btn btn-edit mt-3">Edit</a>
      </div>

      <div class="card-footer">
        <small class="text-muted">
          ${movie.imdbRating} IMDb · ${movie.Metascore} Meta · Rated: ${movie.Rated}
        </small><br>
        <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">IMDB</a>
      </div>
    </div>
  `;

    return col;
}

// Helper function to create accordion for arrays
function createAccordionSection(title, items, id) {
    const collapseId = `${title}-${id}`;

    return `
    <div class="card">
      <div class="card-header p-1">
        <a data-toggle="collapse" href="#${collapseId}">${title}</a>
      </div>
      <div id="${collapseId}" class="collapse" data-parent="#accordion-${id}">
        <div class="card-body">
          <ul>
            ${items.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}
