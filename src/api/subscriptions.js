const express = require('express');
const router = express.Router();
const Subscription = require('../../models/subscriptions')
const {validateNotEmptySubscription} = require('../middlewares')

/* GET - All Subscription */
router.get('/', (req, res) => {
    let config = {
        page: parseInt(req.query.page,10) || 1,
        limit: parseInt(req.query.limit,10) || 10,
    }
    Subscription.paginate({}, config, function(err, data) {
        if(err){
            res.status(401).json({
                error: 'Pagination error',
                details: err
            })
        } else {
            res.json(data)
        }
    });
});

/* POST - Create new Subscription */
router.post('/',validateNotEmptySubscription, async (req, res) => {
    //Subscription Object
    var newSubscription = await new Subscription({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      ip_address: req.body.ip_address
    });

    newSubscription.save((err,data)=>{
      if(err){
        res.status(401).json({
            error_message:'Error creating new subscription',
            err
        });
      } else {
        res.status(200).json(data);
      }
    });
});

/* GET - Specific Subscription */
router.get('/:email', (req, res) => {
  let {email} = req.params;

  Subscription.findOne({email: email}, (err, data)=>{
    if(err){
      res.status(400).json({
        error: `Invalid Email : ${email}`,
      });
    } else if(data == null) {
      res.status(400).json({
        error: `Email ${email} doesn't exist in our database.`,
      });
    } else {
      res.json(data);
    }
  });
});

module.exports = router;