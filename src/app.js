const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
env = process.env;

const middlewares = require('./middlewares');
const { notFound } = require('../helpers/404');
const api = require('./api');
const auth = require('./auth');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const whitelist = env.CORS_ALLOWED.split(',');
const corsOptions = {
  origin(origin, callback) {
    if (env.NODE_ENV === 'development') {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  allowedHeaders: ['Accept-Version', 'Authorization', 'Credentials', 'Content-Type'],
};

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
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
app.use('/auth', auth);

app.use(notFound);
app.use(middlewares.errorHandler);

module.exports = app;
