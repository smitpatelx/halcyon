const User = require('../models/user');
const env = require('../helpers/config');
const { generateHash } = require('../helpers/hash');

const adminPassword = env.ADMIN_PASSWORD;

// eslint-disable-next-line no-async-promise-executor
const createAdmin = async () => new Promise(async (resolve, reject) => {
  let hashedPassword = null;

  // Validate generated hash
  hashedPassword = await generateHash(adminPassword);

  const adminUser = {
    first_name: env.ADMIN_FIRST_NAME,
    last_name: env.ADMIN_LAST_NAME,
    password: hashedPassword,
    email: env.ADMIN_EMAIL,
    user_type: 'admin'
  };

  await User.syncIndexes();
  if (env.ADMIN_RENEW === 'yes') {
    const user = await User.findOne({ email: env.ADMIN_EMAIL });
    if (user) {
      // Update user
      const updatedUser = await User.updateOne({ email: env.ADMIN_EMAIL }, adminUser);
      resolve();
      return;
    }
    // Create user
    const newUser = await User.create(adminUser);
    if (!newUser) {
      reject(new Error(null));
    }
    resolve();

    // await User.findOneAndUpdate({ email: env.ADMIN_EMAIL }, async (err, data) => {
    //   if (data) {
    //     reject(new Error(null));
    //     return;
    //   }
    //   await User.create(adminUser, (err2, result) => {
    //     if (err2) {
    //       reject(new Error(null));
    //       return;
    //     }
    //     resolve(null);
    //   });
    // });
  } else {
    const user = await User.findOne({ email: env.ADMIN_EMAIL });
    if (user) {
      resolve();
      return;
    }

    const newUser = await User.create(adminUser);
    if (!newUser) {
      reject(new Error(null));
    }
    resolve();
    // await User.findOne({ email: env.ADMIN_EMAIL }, async (err, data) => {
    //   if (data) {
    //     reject(new Error(null));
    //     return;
    //   }
    //   await User.create(adminUser, (err2, result) => {
    //     if (err2) {
    //       reject(new Error(null));
    //       return;
    //     }
    //     resolve();
    //   });
    //   reject();
    // });
  }
});

module.exports = { createAdmin };
