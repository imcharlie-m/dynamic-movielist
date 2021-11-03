/*
 Authors:
 Your name and student #:
*/
const express = require("express");
const { readFile }  = require("fs/promises");

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const movieArray = () => {
    return readFile('./movieDescriptions.txt', 'utf8')
        .then((lines) =>  lines.split("\n"))
        .then((lines) => {
            const movieList = [];
            lines.forEach(line => {
                movieList.push(line.trim().split(':').shift().trim())
            })
            return movieList;
        })
        .catch(err => console.log(err));
}

app.get("/", (req, res) => {
    movieArray().then( (movieArray) => {
            res.render("pages/index",  {movieArray: movieArray});
    }
    )
});

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.post("/myForm", (req, res) => {
  const movieList = req.body.movieList;
  res.render("pages/index", { movieArray: movieList.trim().split(',')});
});

app.get("/myListQueryString", (req, res) => {
  const {movie1, movie2 } = req.query;
  res.render("pages/index", {movieArray: new Array(movie1.trim(), movie2.trim())});
});

app.get("/search/:movieName", (req, res) => {
  const movieName = req.params.movieName;
  readFile('./movieDescriptions.txt', 'utf8')
      .then((lines) =>  lines.split("\n"))
      .then((lines) => {
          const searchResults = [];
          lines.forEach(line => {
              if(movieName.trim().toLowerCase() === line.trim().split(':').shift().trim().toLowerCase())
                  searchResults.push(line.split(':'));
          })
          return searchResults;
      })
      .then(searchResults => {
          res.render('pages/searchResult', {searchResults})
      })
      .catch(err => console.log(err));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});