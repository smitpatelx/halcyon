const express = require('express');
const auth = require('./auth');
const user = require('./user');

const router = express.Router();

router.use('/', auth);
router.use('/', user);

module.exports = router;
