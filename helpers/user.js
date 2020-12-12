const { body, validationResult } = require('express-validator');
const User = require('../models/user')
var validator = require('validator');

//Validate if variable exist
const validateUser = async (req, res, next)=>{
  await body('first_name').not().isEmpty().bail().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
  
  await body('last_name').not().isEmpty().bail().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
  
  await body('email').not().isEmpty().bail().isEmail().bail()
  .custom(async (value) => {
    let newError;
    await User.findOne({ email: value }).then(res=>{
      if (res){
        newError = true;
      } else {
        newError = false;
      }
    })
    
    if(newError) { return Promise.reject("E-mail already exist"); }
  }).run(req)

  await body('password').not().isEmpty().bail().trim().custom(async val=>{
    const isValidPass = await validator.isStrongPassword(val);
    if(!isValidPass){
      return Promise.reject("The password you provided is weak.");
    }
  }).run(req)

  await body('confirm_password').not().isEmpty().bail().trim().custom(async (value, { req })=>{
    if(value !== req.body.password){
      return Promise.reject("Confirm password doesn't match.");
    }
  }).run(req)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next()
  }
}

//Loose user data validation
const updateValidation = async (req, res, next)=>{
    await body('first_name').not().isEmpty().bail().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)

    await body('last_name').not().isEmpty().bail().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next()
  }
}

module.exports = { validateUser, updateValidation }