const express = require('express');

const router = express.Router();

/* GET - All contacts */
router.get('/', (req, res) => {
  res.json({
    function: 'Get all contacts',
    next:'http://localhost:9009/api/v1/contact/1'
  });
});

/* POST - Create new contact */
router.get('/', (req, res) => {
  res.json({
    function: 'Create new contact',
  });
});

/* GET - Specific Contact */
router.get('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isNaN(page_id)){
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  } else {
    res.json({
      function: `Get specific contact with ${page_id}`,
    });
  }
});

/* POST - Edit Contact */
router.post('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isNaN(page_id)){
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  } else {
    res.json({
      function: `Editing contact id: ${page_id}`,
    });
  }
});

/* DELETE - Delete Specific contact */
router.delete('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isNaN(page_id)){
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  } else {
    res.json({
      function: `Delete contact id: ${page_id}`,
    });
  }
});

module.exports = router;
