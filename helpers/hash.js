const bcrypt = require('bcrypt');
const env = require('./config');

// eslint-disable-next-line radix
const saltRounds = parseInt(env.SALT_ROUNDS);

// Create a admin password hash
const generateHash = async (adminPassword) => new Promise((resolve, reject) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) throw (err);
    bcrypt.hash(adminPassword, salt, (err2, hash) => {
      if (err2) {
        return reject(new Error({
          error_message: 'Error creating hash for admin password.',
          error_data: err2
        }));
      }
      return resolve(hash);
    });
  });
});

module.exports = { generateHash };
