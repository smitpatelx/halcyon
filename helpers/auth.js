/* eslint-disable max-len */
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../models/user');
const AuthToken = require('../models/authtokens');
const env = require('./config');

const cookieOptions = (maxAgeVal) => {
  const maxAgeParsed = maxAgeVal || Number(env.COOKIE_EXPIRY);
  const expDate = new Date(Number(new Date()) + maxAgeParsed);
  return {
    domain: env.COOKIE_DOMAIN,
    expires: expDate,
    maxAge: maxAgeParsed,
    httpOnly: true,
    sameSite: 'Strict',
    secure: Boolean(env.NODE_ENV !== 'development'),
    path: '/'
  };
};

// Validate if variable exist
const validateLogin = async (req, res, next) => {
  await body('email').not().isEmpty().bail()
    .isEmail()
    .bail()
    .custom(async (value) => {
      let newError;
      await User.findOne({ email: value }).then((res2) => {
        if (res2) {
          newError = false;
        } else {
          newError = true;
        }
      });

      // eslint-disable-next-line prefer-promise-reject-errors
      if (newError) { return Promise.reject("E-mail doesn't exist"); }
      return true;
    })
    .run(req);

  await body('password').not().isEmpty().bail()
    .trim()
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  return next();
};

// Generate JWT Token
const generateToken = async (user) => {
  const userObj = user.toObject();
  delete userObj.password; // Deleting password
  return new Promise((resolve, reject) => {
    // Sign asynchronously
    jwt.sign({ userObj }, env.JWT_SECRET, { expiresIn: env.TOKEN_EXPIRE_TIME }, (err, token) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ default: 'Error creating JWT token!', err });
      } else {
        // Create a refresh token incase we need it
        const newRefreshToken = jwt.sign({ userObj }, env.JWT_REFRESH_SECRET, { expiresIn: env.RERFRESH_TOKEN_EXPIRE_TIME });
        // Find or create a refresh token
        AuthToken.findOrCreate({ user_id: userObj._id }, {
          user_id: userObj._id,
          refresh_token: newRefreshToken
        }, (_err, data) => {
          if (data) {
            // Return new/existing token
            resolve({ token, refreshToken: newRefreshToken });
          } else {
            // Throw Refresh Token findOrCreate error
            return new Promise.Reject({ default: 'RefreshToken findOrCreate error' });
          }
          return null;
        });
      }
    });
  });
};

const refreshAccessToken = async (refreshToken) => {
  const data = jwt.decode(refreshToken, { complete: true });
  const { userObj } = data.payload;

  const token = jwt.sign({ userObj }, env.JWT_SECRET, { expiresIn: env.TOKEN_EXPIRE_TIME });

  return new Promise((resolve, reject) => {
    // Find token
    AuthToken.findById(userObj._id)
      .then((_d1) => {
        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, (err, _d2) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              return Promise.Rejectreject('Please login again!');
            }
            return Promise.Reject({ errorCode: 'REFRESH_TOKEN_INVALID', error_data: err });
          }
          return Promise.Resolve({ token, refreshToken });
        });
      })
      .catch((_) => Promise.Reject({ errorCode: 'FORCE_LOGOUT' }));
  });
};

const isLoggedIn = (req, res, next) => {
  if (typeof req.headers.cookie === 'undefined') { res.status(401).json({ error_message: 'Header cookies undefined' }); }
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies['x-access-token'];
    const refreshToken = cookies['x-refresh-token'];
    jwt.verify(token, env.JWT_SECRET, async (err, _) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Generate new token and send it
          await refreshAccessToken(refreshToken).then((data) => {
            const newTokensInCookies = cookie.serialize('x-access-token', data.token, cookieOptions());
            req.headers.cookie = newTokensInCookies;
            res.setHeader('Set-Cookie', [
              newTokensInCookies,
            ]);
            next();
          }).catch((err2) => {
            res.status(401).json({ error_message: 'Please try again!', error_data: err2 });
          });
        } else {
          res.status(401).json({ error_message: 'Invalid token provided!' });
        }
      } else {
        next();
      }
    });
  } catch (err) {
    res.status(401).json({ error_message: 'Unauthorised access blocked!' });
  }
};

const isAdmin = (req, res, next) => {
  if (typeof req.headers.cookie === 'undefined') { res.status(401).json({ error_message: 'Header cookies undefined' }); }
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies['x-access-token'];
    jwt.verify(token, env.JWT_SECRET, (err, data) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ error_message: 'Token Expired!' });
        } else {
          res.status(401).json({ error_message: 'Invalid token provided!' });
        }
      } else if (data.userObj.user_type === 'admin') {
        next();
      } else {
        res.status(401).json({ error_message: 'Your dont have access to this endpoint!' });
      }
    });
  } catch (err) {
    res.status(401).json({ error_message: 'Unauthorised access blocked!' });
  }
};

module.exports = {
  validateLogin, generateToken, isLoggedIn, isAdmin, refreshAccessToken
};
