const express = require('express');

const router = express.Router();
const Contact = require('../../models/contact');
const { validateContacts } = require('../../helpers/contacts');
const { isLoggedIn, isAdmin } = require('../../helpers/auth');

/* GET - All contacts */
router.get('/', isLoggedIn, isAdmin, (req, res) => {
  const config = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };
  Contact.paginate({}, config, (err, data) => {
    if (err) {
      res.status(500).json({
        error: 'Pagination error',
        details: err
      });
    } else {
      res.json(data);
    }
  });
});

/* POST - Create new contact */
router.post('/', validateContacts, async (req, res) => {
  // Contact Object
  await Contact.syncIndexes();
  await Contact.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    country_code: req.body.country_code,
    business_name: req.body.business_name,
    business_employees: req.body.business_employees,
    est_budget: req.body.est_budget,
    message: req.body.message,
    ip_address: req.body.ip_address
  }).then((data) => {
    res.status(201).json(data);
  }).catch((err) => {
    res.status(500).json({
      error_message: 'Error Creating User',
      err
    });
  });
});

/* GET - Specific Contact */
router.get('/:id', isLoggedIn, isAdmin, (req, res) => {
  const { id } = req.params;

  Contact.findById({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: `Invalid ID : ${id}`,
      });
    } else if (data == null) {
      res.status(500).json({
        error: `ID ${id} doesn't exist in our database.`,
      });
    } else {
      res.json(data);
    }
  });
});

/* POST - Edit Contact */
router.post('/:id', isLoggedIn, isAdmin, validateContacts, (req, res) => {
  const { id } = req.params;

  Contact.findByIdAndUpdate({ _id: id }, req.body,
    {
      new: true
    }, (err, data) => {
      if (err) {
        res.status(500).json({
          error: `Invalid ID : ${id}`,
        });
      } else {
        res.json(data);
      }
    });
});

/* DELETE - Delete Specific contact */
router.delete('/:id', isLoggedIn, isAdmin, (req, res) => {
  const { id } = req.params;

  Contact.findOneAndDelete({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: `Invalid ID : ${id}`,
      });
    } else if (data == null) {
      res.status(500).json({
        error: `ID ${id} doesn't exist in our database.`,
      });
    } else {
      res.json({
        message: `ID ${id} deleted successfully.`
      });
    }
  });
});

// Validate ID
// function isInt(value) {
//   var x;
//   return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
// }

// Clean Obj
// const cleanEmpty = obj => {
//   if (Array.isArray(obj)) {
//     return obj
//         .map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
//         .filter(v => !(v == null));
//   } else {
//     return Object.entries(obj)
//         .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
//         .reduce((a, [k, v]) => (v == null ? a : (a[k]=v, a)), {});
//   }
// }

module.exports = router;
