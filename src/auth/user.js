const express = require('express');

const router = express.Router();
const User = require('../../models/user');
const { validateUser, updateValidation } = require('../../helpers/user');
const { isLoggedIn, isAdmin } = require('../../helpers/auth');
const { generateHash } = require('../../helpers/hash');

let hashedPassword = null;

/* GET - All users */
router.get('/users', isLoggedIn, isAdmin, (req, res) => {
  const config = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
    select: '-password'
  };
  User.paginate({}, config, (err, data) => {
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

/* POST - Create new User */
router.post('/user', isLoggedIn, isAdmin, validateUser, async (req, res) => {
  // Validate generated hash
  await generateHash(req.body.password).then((data) => {
    hashedPassword = data;
  });

  await User.syncIndexes();
  await User.findOne({ email: req.body.email }, async (err, data) => {
    if (data) {
      res.status(401).json({
        error_message: 'User already exist'
      });
    } else {
      await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
      }).then((data) => {
        res.status(200).json({
          message: 'User created successful!'
        });
      }).catch((err) => {
        res.status(401).json({
          error_message: 'Error creating new User',
          err
        });
      });
    }
  });
});

/* DELETE - Delete user by _id */
router.delete('/user/:id', isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  await User.findOne({ _id: id }, async (err, data) => {
    if (data) {
      if (data.user_type === 'admin') {
        res.status(401).json({
          error_message: "You can't delete admin user."
        });
      } else {
        User.findOneAndDelete({ _id: id })
          .then((data) => {
            res.status(200).json({ message: `User id: ${data._id} deleted successfully!` });
          }).catch((err) => {
            res.status(400).json({
              error_message: `Invalid userId : ${id}`,
            });
          });
      }
    } else {
      res.status(400).json({
        error_message: `Invalid userId : ${id}`,
      });
    }
  });
});

/* PATCH - Update user data */
router.patch('/user/:id', isLoggedIn, isAdmin, updateValidation, async (req, res) => {
  const { id } = req.params;
  await User.findOne({ _id: id }, async (err, data) => {
    if (data) {
      if (data.user_type === 'admin') {
        res.status(400).json({
          error_message: "You can't edit admin user",
        });
      } else {
        const userObj = {
          first_name: req.body.first_name,
          last_name: req.body.last_name
        };
        await User.update({ _id: id }, userObj, (err, data) => {
          if (err) {
            res.status(400).json({
              error_message: `Error updating userId: ${id}`,
            });
          } else {
            res.status(400).json({
              error_message: `userId: ${id} updated successfully!`,
            });
          }
        });
      }
    } else {
      res.status(400).json({
        error_message: `Invalid userId : ${id}`,
      });
    }
  });
});

module.exports = router;
