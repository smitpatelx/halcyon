const express = require('express');

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie');

const router = express.Router();
const User = require('../../models/user');
const AuthToken = require('../../models/authtokens');
const {
  validateLogin, generateToken, refreshAccessToken, isLoggedIn
} = require('../../helpers/auth');


const cookieOptions = (maxAgeVal) => {
  const maxAgeParsed = maxAgeVal || eval(process.env.COOKIE_EXPIRY);
  const expDate = new Date(Number(new Date()) + maxAgeParsed);
  return {
    domain: process.env.COOKIE_DOMAIN,
    expires: expDate,
    maxAge: maxAgeParsed,
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV !== 'development',
    path: '/'
  };
};
/*
 * POST - Login Route
 * @accept - email, password
 * @return token, refreshToken
*/
router.post('/login', validateLogin, async (req, res) => {
  await User.findOne({ email: req.body.email }).then((data) => {
    bcrypt.compare(req.body.password, data.password, (err, result) => {
      if (result === true) {
        const user = data.toObject();
        delete user.password; // Deleting password
        // Generating new token
        generateToken(data).then((data) => {
          res.setHeader('Set-Cookie', [
            cookie.serialize('x-access-token', data.token, cookieOptions()),
            cookie.serialize('x-refresh-token', data.refreshToken, cookieOptions())
          ]);
          delete user._id;
          delete user.__v;
          res.status(200).json(user);
        }).catch((error) => {
          res.status(401).json({ error_message: 'Error generating Token', error_data: error });
        });
      } else {
        res.status(401).json({ error_message: 'User login failed!', error_data: err });
      }
    });
  });
});

/*
 * GET - Current User
 * @accept - none
 * @return - user
 */
router.get('/me', isLoggedIn, async (req, res) => {
  const cookies = JSON.parse(cookie.parse(req.headers.cookie).x - access - token);
  const token = cookies.token.split(' ')[1];
  let id = null;

  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      if (err.name == 'TokenExpiredError') {
        res.status(403).json({ error_message: 'Token Expired!' });
      } else {
        res.status(401).json({ error_message: 'Invalid token provided!' });
      }
    } else if (data.userObj._id) {
      id = data.userObj._id;
    }
  });
  if (id !== null) {
    try {
      const userData = await User.findOne({ _id: id });
      if (userData) {
        const newData = { ...userData._doc };
        delete newData.password;
        delete newData._id;
        delete newData.__v;
        res.status(200).json(newData);
      }
    } catch (err) {
      res.status(400).json({ error_message: 'Error fetching user!' });
    }
  }
});

/*
 * POST - Refresh Token
 * @accept - refreshToken
 * @return - accessToken
 */
// router.post('/refresh', async(req, res)=>{
//     if(typeof req.headers.cookie === "undefined") { res.status(400).json({error_message: "Header cookies undefined"}) }
//     let cookies, refreshToken;
//     try{
//         cookies = await JSON.parse(cookie.parse(req.headers.cookie).x-access-token);
//         refreshToken = cookies.refreshToken;
//     } catch(err){
//         res.status(404).json({error_message: "You are already logged out!"})
//         process.exit();
//     }
//     await refreshAccessToken(refreshToken).then(data=>{
//         res.setHeader('Set-Cookie', cookie.serialize('x-access-token', JSON.stringify(data), cookieOptions()));
//         res.status(200).json({message: "Done!"});
//     }).catch(err=>{
//         res.status(403).json({error_message:"Please try again!", error_data: err})
//     })
// })

/*
 * POST - Refresh Token
 * @accept - refreshToken
 * @return - accessToken
 */
router.post('/logout', isLoggedIn, async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = cookies['x-access-token'];
  let id = null;

  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      if (err.name == 'TokenExpiredError') {
        res.status(403).json({ error_message: 'Token Expired!' });
      } else {
        res.status(401).json({ error_message: 'Invalid token provided!' });
      }
    } else if (data.userObj._id) {
      id = data.userObj._id;
    }
  });
  // Delete Token from DB
  AuthToken.findOneAndDelete({ user_id: id }, (err, data) => {
    if (err) {
      res.status(300).json({ error_message: 'Error deleting AuthToken!' });
    } else {
      // Unset Cookie
      res.setHeader('Set-Cookie', [cookie.serialize('x-access-token', '', cookieOptions(-1)), 
        cookie.serialize('x-refresh-token', '', cookieOptions(-1))]);
      res.status(200).json({ message: 'AuthToken deleted successfully!' });
    }
  });
});

module.exports = router;
