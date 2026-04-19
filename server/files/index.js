window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const bodyElement = document.querySelector("body");
    if (xhr.status == 200) {
      const movies = JSON.parse(xhr.responseText);
      let movieCounter = 1;
      for (const movie of movies) {
        /* Task 1.3 */
        //bodyElement.innerHTML = xhr.responseText;

        const rootNode = document.getElementById("movie-"+movieCounter);
        rootNode.querySelector("img").setAttribute("src", movie["Poster"])
        const bodyNode = rootNode.querySelector("div")
        bodyNode.querySelector("h5").innerHTML = movie["Title"];
        bodyNode.querySelector("small").innerHTML = movie["Year"]+" "+movie["Released"]+" "+movie["Runtime"]; //convert
        const genreNode = document.getElementById("Genres-"+movieCounter)

        for(const genre of (movie["Genre"].split(" "))){
          //console.log(genre)
          const badge = document.createElement("span");
          badge.classList.add("badge");
          badge.classList.add("badge-info");
          badge.innerText = genre.replace(/(^\s*,)|(,\s*$)/g, '');
          genreNode.appendChild(badge);
        }
        bodyNode.querySelector("p").innerHTML = movie["Plot"];

        // Fill Directors
        const directors = document.getElementById("collapseDirectors-"+movieCounter).querySelector("div");
        const directorsList = document.createElement("ul");
        for (const director of movie["Directors"]) {
          const directorEntry = document.createElement("li");
          directorEntry.innerHTML = director.replace(/(^\s*,)|(,\s*$)/g, '');
          directorsList.appendChild(directorEntry);
        }
        directors.appendChild(directorsList);

        // Fill Actors
        const actors = document.getElementById("collapseActors-"+movieCounter).querySelector("div");
        const actorsList = document.createElement("ul");
        for (const actor of movie["Actors"]) {
          const actorEntry = document.createElement("li");
          actorEntry.innerHTML = actor.replace(/(^\s*,)|(,\s*$)/g, '');
          actorsList.appendChild(actorEntry);
        }
        actors.appendChild(actorsList);

        // Fill Writers
        const writer = document.getElementById("collapseWriters-"+movieCounter).querySelector("div");
        const writersList = document.createElement("ul");
        for (const writer of movie["Writers"]) {
          const writerEntry = document.createElement("li");
          writerEntry.innerHTML = writer.replace(/(^\s*,)|(,\s*$)/g, '');
          writersList.appendChild(writerEntry);
        }
        writer.appendChild(writersList);

        const footer = document.getElementById("footer-"+movieCounter);
        const ratings = footer.querySelector("small");
        ratings.innerHTML = movie["imdbRating"]+"-IMDB "+movie["Metascore"]+"-Metascore - Rated: "+movie["Rated"];
        const imdbLink = footer.querySelector("a");
        imdbLink.setAttribute("href", "https://www.imdb.com/de/title/"+movie["imdbID"]);

        //set button link
        const editButton = document.getElementById("button-"+movieCounter);
        editButton.setAttribute("href", "edit.html?imdbID="+movie["imdbID"]);

        //console.log(movie)
        movieCounter +=1;

      }

    } else {
      bodyElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };
  xhr.open("GET", "/movies");
  xhr.send();
};
