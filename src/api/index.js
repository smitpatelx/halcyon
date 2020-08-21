const express = require('express');

const contact = require('./contact');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/contact', contact);

module.exports = router;
