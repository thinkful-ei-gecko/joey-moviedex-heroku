

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movies = require('./movies.js');

let moviesResults = [];
const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next){
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

app.get('/movie', (req, res) => {
  const genre = req.query.genre;
  const country = req.query.country;
  const avgVote = req.query.avg_vote;

  

  if(genre){
    moviesResults = movies.filter( movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country){
    moviesResults = movies.filter( movie => 
      movie.country.toLowerCase().includes(country.toLowerCase()));
    
  }

  if(avgVote){
    moviesResults = movies.filter( movie => 
      movie.avg_vote >= parseInt(avgVote)
    );
  }

  return res.json(moviesResults);
});

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT);