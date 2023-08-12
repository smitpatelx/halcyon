/* eslint-disable new-cap */
const express = require('express');

const router = express.Router();
const { default: validator } = require('validator');
const Subscription = require('../../models/subscriptions');
const { validateSubscription } = require('../../helpers/subscription');
const { sendmail } = require('../../mail/sendmail');
const { newSubscriber, changeStatus } = require('../../mail/mailchimp');
const { isLoggedIn, isAdmin } = require('../../helpers/auth');

/* GET - All Subscription */
router.get('/', isLoggedIn, isAdmin, (req, res) => {
  const config = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };
  Subscription.paginate({}, config, (err, data) => {
    if (err) {
      res.status(401).json({
        error: 'Pagination error',
        details: err
      });
    } else {
      res.json(data);
    }
  });
});

// router.get('/', async (req, res) => {
//     let text = "Hi this is just a test";
//     let html = "<br/><hr/><br/><h1 style='color:#000;font-weight:500;font-size:2rem;'>
//        Hi this is just a test
//        </h1><br/><hr/><br/>";
//     sendmail('smitpatel2x@gmail.com','Test 1', text, html)
//     .then(data=>{
//         res.status(200).json(data);
//     })
//     .catch(err=>{
//         res.status(401).json(err);
//     })
// });

/* POST - Create new Subscription */
router.post('/', validateSubscription, async (req, res) => {
  // Subscription Object
  await Subscription.syncIndexes();
  await Subscription.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    ip_address: req.body.ip_address
  }).then((data) => {
    newSubscriber(data).then((data2) => {
      res.status(200).json('Email subscription successful!');
    }).catch((err2) => {
      res.status(401).json(err2);
    });
  }).catch((err) => {
    res.status(401).json({
      error_message: 'Error creating new subscription',
      err
    });
  });
});

/* GET - Specific Subscription */
router.get('/:email', isLoggedIn, isAdmin, async (req, res) => {
  const { email } = req.params;
  const isEmailValid = await validator.isEmail(email);
  if (!isEmailValid) { res.status(401).json('Email is invalid'); }

  Subscription.findOne({ email }, (err, data) => {
    if (err) {
      res.status(400).json({
        error: `Invalid Email : ${email}`,
      });
    } else if (data == null) {
      res.status(400).json({
        error: `Email ${email} doesn't exist in our database.`,
      });
    } else {
      res.json(data);
    }
  });
});

/* Delete - Specific Subscription */
router.delete('/:email', isLoggedIn, isAdmin, (req, res) => {
  const { email } = req.params;

  Subscription.findOneAndDelete({ email })
    .then((data) => {
      if (!data) {
        res.status(400).json({
          error: `Email ${data.email} doesn't exist in our database.`,
        });
      } else {
        changeStatus(data.email).then((data2) => {
          res.status(200).json(`Unsubscribe ${data.email} successful!`);
        }).catch((err2) => {
          res.status(401).json({ error_message: `Unsubscribe to ${email} unsuccessful!`, error_data: err2 });
        });
      }
    }).catch((err) => {
      res.status(400).json({
        error: `Invalid Email : ${email}`,
      });
    });
});

module.exports = router;
