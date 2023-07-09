const nodemailer = require('nodemailer');
const env = require('../helpers/config');

const config = () => {
  switch (env.MAIL_DRIVER) {
    case 'mailtrap':
      return {
        host: env.MAILTRAP_HOST,
        port: env.MAILTRAP_PORT,
        secure: env.MAILTRAP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: env.MAILTRAP_USER,
          pass: env.MAILTRAP_CREDENTIALS,
        },
      };
    default:
      return {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: env.MAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_CREDENTIALS,
        },
      };
  }
};

const transporter = nodemailer.createTransport(config());

module.exports = { transporter };
