const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');
const movies = require("./movie-model");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

//HTTP/GET
app.get('/movies', function (req, res) {

  /* Task 1.2. */
  try{
    const movies = require("./movie-model.js");
    res.json(movies);
  }catch(e){
    res.sendStatus(500)
  }
})

//HTTP/GET?=imdb_id
app.get('/movies/:imdbID', function (req, res) {
  try {
    const imdbID = req.params.imdbID;

    const movie = movies.find(m => m.imdbID === imdbID);

    if (!movie) {
      return res.sendStatus(404);
    }
    return res.json(movie);

  } catch (e) {
    return res.sendStatus(500);
  }
});

/* Task 3.1 and 3.2. */

app.put('/movies/:imdbID', function (req, res) {

  console.log("PUT PARAM:", req.params.imdbID);
  console.log("BODY:", req.body);
  //Read movie from req
  const imdbID = req.params.imdbID;
  const movieData = req.body;
  //Check if exists
  const exists = movies.find(movie => movie.imdbID === imdbID);
  //save update whatnot
  if (!exists) {
    res.sendStatus(404);
  }

  //array fix
  if (Array.isArray(movieData.Genre)) {
    movieData.Genre = movieData.Genre.join(", ");
  }

  Object.assign(exists, movieData);

  res.send(200);
})

app.post('/movies', function (req, res) {
  //Create a new movie
  console.log(req.body);
  const movieData = req.body;
  movieData.imdbID = "tt"+Date.now();
  movies.push(movieData);
  console.log(movies);
  return res.status(201);
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

