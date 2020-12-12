const { body, validationResult } = require('express-validator');

//Validate if variable exist
const validateContacts = async (req, res, next)=>{
  if(req.body.first_name){
    await body('first_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
  }
  if(req.body.last_name){
    await body('last_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
  }
  if(req.body.email){
    await body('email').not().isEmpty().bail().isEmail().bail().run(req)
  }
  if(req.body.phone){
    await body('phone').not().isEmpty().bail().isMobilePhone().run(req)
  }
  if(req.body.country_code){
    await body('country_code').not().isEmpty().bail().isISO31661Alpha2().run(req)
  }
  if(req.body.business_name){
    await body('business_name').not().isEmpty().bail().isLength({ min: 3, max: 50 }).run(req)
  }
  if(req.body.business_employees){
    await body('business_employees').isNumeric().bail().isInt({gt:0, lt:10000}).run(req)
  }
  if(req.body.est_budget){
    await body('est_budget').isNumeric().bail().isInt({gt:3000, lt:200000}).run(req)
  }
  if(req.body.message){
    await body('message').not().isEmpty().trim().escape().isLength({ max: 1500 }).run(req)
  }
  if(req.body.ip_address){
    await body('ip_address').not().isEmpty().trim().escape().isLength({ min: 8, max:20 }).bail().isIP().run(req)
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next()
  }
}

module.exports = { validateContacts }