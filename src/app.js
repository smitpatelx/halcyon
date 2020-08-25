const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();
env = process.env;

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

let whitelist = ['http://localhost:3000','https://smitpatelx.com']
let corsOptions = {
  origin: function (origin, callback) {
    if(env.NODE_ENV == 'development') {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } else {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
}

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));

// Mongoose Connection
require('../database/connect');

app.get('/', (req, res) => {
  res.json({
    message: 'You dont have any access to this API'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
