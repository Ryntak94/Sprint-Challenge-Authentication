const axios = require('axios');
const knex = require('knex');
const dbConfig = require('../knexfile');
const db = knex(dbConfig.development);
const bcrypt = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
    const creds = req.body;
    creds.username = creds.username.toUpperCase();
    creds.password = bcrypt.hashSync(creds.password);
    db('users').insert(creds)
        .then(id    =>  {
            res.status(201).json( {id: id[0]} )
        })
        .catch(err  =>  {
            res.status(500).json( {message: "Please a provide username and password"} )
        })
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
