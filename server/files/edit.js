//Global Age-Ratings (wikipedia.org)
const RATINGS = ["G", "PG", "PG-13", "R", "NC-17"];

// Function to initialize ratings, independent of update/new
function initRatings(selected = "PG-13") {
    const select = document.getElementById("movieRating");

    select.innerHTML = "";

    RATINGS.forEach(rating => {
        const option = document.createElement("option");
        option.value = rating;
        option.textContent = rating;

        if (rating === selected) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

// Function to set the movie information when updating a movie
function setMovie(movie) {

    //console.log(movie)
    document.getElementById("movieTitle").value = movie.Title;
    document.getElementById("movieReleaseYear").value = movie.Year;

    //Initialize ratings
    initRatings(movie.Rated);
    document.getElementById("movieRating").value = movie.Rated;

    //ISO formatting
    const parsedDate = new Date(movie.Released);
    const formattedDate = parsedDate.toISOString().split("T")[0];
    //console.log(formattedDate);
    document.getElementById("movieReleaseDate").value = formattedDate;
    document.getElementById("movieRuntime").value = movie.Runtime.split(" ")[0];

    //Genres
    const genres = movie.Genre.split(",").map(g => g.trim());
    document.querySelectorAll('#movieGenre input[type="checkbox"]').forEach(cb => {
        if (genres.includes(cb.value)) {
            cb.checked = true;
        }
    });

    //Actors and Directors
    movie.Actors.forEach(actor => addActor(actor));
    movie.Directors.forEach(director => addDirector(director));
    movie.Writers.forEach(writer => addWriter(writer));

    document.getElementById("moviePlot").value = movie.Plot;
    document.getElementById("moviePoster").value = movie.Poster;
    document.getElementById("movieMetascore").value = movie.Metascore;
    document.getElementById("movieImdbRating").value = movie.imdbRating;
    document.getElementById("movieimdbID").value = movie.imdbID;
}

// Helper function for filling Array-lists
function createInput(containerId, value = "") {
    const div = document.createElement("div");
    div.classList.add("dynamic-input");

    div.innerHTML = `
    <input type="text" value="${value}">
    <button type="button" class="remove-btn">✕</button>
  `;

    div.querySelector("button").addEventListener("click", () => {
        div.remove();
    });

    document.getElementById(containerId).appendChild(div);
}

// Call helper depending on parent
function addActor(value = "") {
    createInput("actorsContainer", value);
}
function addDirector(value = "") {
    createInput("directorsContainer", value);
}
function addWriter(value = "") {
    createInput("writersContainer", value);
}

// Function to retrieve data from form
function getMovie() {
    const movie = {};

    //Basic fields
    movie.Title = document.getElementById("movieTitle").value;
    movie.Year = document.getElementById("movieReleaseYear").value;
    movie.Rated = document.getElementById("movieRating").value;
    movie.Released = document.getElementById("movieReleaseDate").value;
    movie.Runtime = document.getElementById("movieRuntime").value + " min";
    movie.Plot = document.getElementById("moviePlot").value;
    movie.Poster = document.getElementById("moviePoster").value;
    movie.Metascore = Number(document.getElementById("movieMetascore").value);
    movie.imdbRating = Number(document.getElementById("movieImdbRating").value);
    movie.imdbID = document.getElementById("movieimdbID").value;
    console.log(movie.imdbID);

    // Genres (checkboxes)
    movie.Genre = [...document.querySelectorAll('#movieGenre input:checked')]
        .map(cb => cb.value);

    // Actors / Directors / Writers (dynamic inputs)
    movie.Actors = getValues("actorsContainer");
    movie.Directors = getValues("directorsContainer");
    movie.Writers = getValues("writersContainer");

    return movie;
}

// Helper function to retrieve data from multivalue fields
function getValues(containerId) {
    return [...document.querySelectorAll(`#${containerId} input`)]
        .map(input => input.value.trim())
        .filter(v => v);
}

// Put movie onto server
function putMovie() {
    /* Task 3.3.  */
    const xhr = new XMLHttpRequest();

    //data
    const movie = getMovie();

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
            window.redirectAfterModal = true;
            showModal(
                "Success",
                movie.imdbID ? "Movie updated successfully." : "Movie created successfully."
            );
        } else {
            showModal(
                "Error",
                "Saving failed. Status code: " + xhr.status
            );
        }
    };

    // ID exists-> put, otherwise post
    if (movie.imdbID.trim() !== "") {
        console.log("PUT URL:", "/movies/" + movie.imdbID);
        xhr.open("PUT", "/movies/" + movie.imdbID, true);
    } else {
        xhr.open("POST", "/movies", true);
    }

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(movie));
}

// Modal helpers
function showModal(title, message) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");

    // optional: redirect after success
    if (window.redirectAfterModal) {
        window.location.href = "index.html";
    }
}

/** Loading and setting the movie data for the movie with the passed imdbID */
const imdbID = new URLSearchParams(window.location.search).get("imdbID"); //read out id
//console.log(imdbID);

//check if I set data
if (imdbID) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/movies/" + imdbID);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText) {
            try {
                const data = JSON.parse(xhr.responseText);
                setMovie(data);
            } catch (e) {
                console.error("Invalid JSON:", xhr.responseText);
                showModal("Error", "Invalid movie data received.");
            }
        } else if (xhr.status === 404) {
            //console.log("Movie not found, creating a new");
        } else {
            showModal(
                "Error",
                "Loading failed: " + xhr.status + " - " + xhr.statusText
            );
        }
    };

    xhr.send();
} else {
    //console.log("No ID, new movie");
    initRatings(); // defaults to PG-13
}





