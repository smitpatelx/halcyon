const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

/* GET - All contacts */
router.get('/', (req, res) => {
  res.json({
    function: 'Get all contacts',
    next:'http://localhost:9009/api/v1/contact/1'
  });
});

/* POST - Create new contact */
router.post('/',[
  body('first_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }),
  body('last_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }),
  body('email').not().isEmpty().trim().escape().normalizeEmail().isEmail(),
  body('phone').not().isEmpty().bail().isMobilePhone(),
  body('country_code').not().isEmpty().bail().isISO31661Alpha2(),
  body('business_name').isAlpha().bail().isLength({ min: 3, max: 20 }),
  body('business_employees').isNumeric().bail().isInt({gt:2, lt:10000}),
  body('est_budget').isNumeric().bail().isInt({gt:3000, lt:200000}),
  body('message').not().isEmpty().trim().escape().isLength({ max: 1500 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  res.json(req.body);
});

/* GET - Specific Contact */
router.get('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isInt(page_id)){
    res.json({
      function: `Get specific contact with ${page_id}`,
    });
  } else {
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  }
});

/* POST - Edit Contact */
router.post('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isInt(page_id)){
    res.json({
      function: `Editing contact id: ${page_id}`,
    });
  } else {
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  }
});

/* DELETE - Delete Specific contact */
router.delete('/:page_id', (req, res) => {
  let page_id = req.params.page_id;

  // Validate page id
  if (isInt(page_id)){
    res.json({
      function: `Delete contact id: ${page_id}`,
    });
  } else {
    res.status(500);
    res.json({
      error: 'Invalid ID',
    });
  }
});

// Validate ID
function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

module.exports = router;
