const { body, validationResult } = require('express-validator');

// Validate Subscription Data
const validateSubscription = async (req, res, next)=>{
    await body('first_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
    await body('last_name').not().isEmpty().trim().escape().isAlpha().bail().isLength({ min: 2, max: 20 }).run(req)
    await body('email').not().isEmpty().bail().isEmail().bail().run(req)
    await body('ip_address').not().isEmpty().trim().escape().isLength({ min: 8, max:20 }).bail().isIP().run(req)
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next()
    }
}

module.exports = { validateSubscription }