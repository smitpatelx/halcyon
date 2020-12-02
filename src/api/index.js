const express = require('express');

const contact = require('./contact');
const subscribe = require('./subscriptions');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/contact', contact);
router.use('/subscribe', subscribe);

module.exports = router;
