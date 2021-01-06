const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const AuthToken = require('../models/authtokens')
const { RERFRESH_TOKEN_EXPIRE_TIME, TOKEN_EXPIRE_TIME, JWT_SECRET, JWT_REFRESH_SECRET} = process.env;
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
const cookieOptions = (maxAgeVal)=>{
    const maxAgeParsed = maxAgeVal ? maxAgeVal : eval(process.env.COOKIE_EXPIRY);
    const expDate = new Date(Number(new Date()) + maxAgeParsed); 
    return {
        domain: process.env.COOKIE_DOMAIN,
        expires: expDate,
        maxAge: maxAgeParsed,
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV!=="development"
    }
}

//Validate if variable exist
const validateLogin = async (req, res, next)=>{

  await body('email').not().isEmpty().bail().isEmail().bail()
    .custom(async (value) => {
      let newError;
      await User.findOne({ email: value }).then(res=>{
        if (res){
          newError = false;
        } else {
          newError = true;
        }
      })
      
      if(newError) { return Promise.reject("E-mail doesn't exist"); }
    }).run(req)

  await body('password').not().isEmpty().bail().trim().run(req)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next()
  }
}

// Generate JWT Token
const generateToken = async(user)=>{
  let userObj = user.toObject();
  delete userObj["password"];    // Deleting password
  return new Promise((resolve, reject)=>{
    // Sign asynchronously
    jwt.sign({userObj}, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME }, (err, token) => {
      if(err){
        reject({default:"Error creating JWT token!", err})
      } else {
        // Create a refresh token incase we need it
        const newRefreshToken = jwt.sign({userObj}, JWT_REFRESH_SECRET, { expiresIn: RERFRESH_TOKEN_EXPIRE_TIME });
        // Find or create a refresh token
        AuthToken.findOrCreate({user_id: userObj._id}, {
          user_id: userObj._id,
          refresh_token: newRefreshToken
        }, (err, data)=>{
          if(data){
            //Return new/existing token
            resolve({token: token, refreshToken: data.refresh_token })
          } else {
            //Throw RefreshToken findOrCreate error
            reject({default:"RefreshToken findOrCreate error"})
          }
        })
      }
    });
  })
}

const refreshAccessToken = async(refreshToken)=>{
  const data = jwt.decode(refreshToken, {complete: true});
  const userObj = data.payload.userObj;

  const token = jwt.sign({userObj}, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME });
  
  return new Promise((resolve, reject)=>{
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, data)=>{
      if(err){
        if(err.name=='TokenExpiredError'){
          reject("Please login again!");
          // AuthToken.findOne({user_id: userObj._id}, (err, data)=>{
          //   if(data){
          //     //Return new JWT token & Old refresh token
          //     resolve({token: 'JWT '+token, refreshToken: data.refresh_token })
          //   } else {
          //     //Throw RefreshToken findOrCreate error
          //     reject("Please login again!")
          //   }
          // })
        } else {
          reject({errorCode:'REFRESH_TOKEN_INVALID', error_data: err})
        }
      } else {
        resolve({token: token, refreshToken: refreshToken});
      }
    })
  })
}

const isLoggedIn = (req, res, next)=>{
  if(typeof req.headers.cookie === "undefined") { res.status(400).json({error_message: "Header cookies undefined"}) }
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies['x-access-token'];
    const refreshToken = cookies['x-refresh-token'];
    jwt.verify(token, JWT_SECRET, async (err, data)=>{
      if(err){
        if(err.name=='TokenExpiredError'){
          // Generate new token and send it
          await refreshAccessToken(refreshToken).then(data=>{
            const newTokensInCookies = cookie.serialize('x-access-token', data.token, cookieOptions());
            req.headers.cookie = newTokensInCookies;
            res.setHeader('Set-Cookie', [
              newTokensInCookies, 
            ]);
            // res.status(200).json({message: "Done!"});
            next();
          }).catch(err=>{
            res.status(403).json({error_message:"Please try again!", error_data: err})
          })
        } else {
          console.log("isLoggedIn Error : ",err)
          res.status(401).json({error_message:"Invalid token provided!"});
        }
      } else {
        next();
      }
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({error_message: "Unauthorised access blocked!"})
  }
}

const isAdmin = (req, res, next)=>{
  if(typeof req.headers.cookie === "undefined") { res.status(400).json({error_message: "Header cookies undefined"}) }
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies['x-access-token'];
    jwt.verify(token, JWT_SECRET, (err, data)=>{
      if(err){
        if(err.name=='TokenExpiredError'){
          res.status(403).json({error_message:"Token Expired!"});
        } else {
          res.status(401).json({error_message:"Invalid token provided!"});
        }
      } else {
        if(data.userObj.user_type==="admin"){
          next();
        } else {
          res.status(401).json({error_message:"Your dont have access to this endpoint!"});
        }
      }
    });
  } catch (err) {
    res.status(400).json({error_message: "Unauthorised access blocked!"})
  }
}

module.exports = { validateLogin, generateToken, isLoggedIn, isAdmin, refreshAccessToken }