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
  /* Task 2.1. */
  console.log(req.params.imdbID.substring(1));
  try{
    const movies = require("./movie-model.js");
    res.json(movies.find(movie => movie.imdbID === req.params.imdbID.substring(1)));
  }catch(e){
    res.sendStatus(500)
  }
})

/* Task 3.1 and 3.2.
   - Add a new PUT endpoint
   - Check whether the movie sent by the client already exists 
     and continue as described in the assignment */

app.post('/movies/:imdbID', function (req, res) {})


app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

