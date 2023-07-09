require('dotenv').config({
  path: '.env',
});

const { env } = process;

module.exports = {
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: env.PORT || 3000,
  CORS_ALLOWED: env.CORS_ALLOWED || 'http://localhost:3000',

  MONGO_USER: env.MONGO_USER || 'root',
  MONGO_PASS: env.MONGO_PASS || 'root',
  MONGO_HOST: env.MONGO_HOST || 'localhost',
  MONGO_PORT: env.MONGO_PORT || 27017,
  MONGO_DB: env.MONGO_DB || 'nodejs',

  MAIL_DRIVER: env.MAIL_DRIVER || 'smtp',
  MAIL_HOST: env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: env.MAIL_PORT || 587,
  MAIL_SECURE: env.MAIL_SECURE || false,
  MAIL_USER: env.MAIL_USER || '',
  MAIL_CREDENTIALS: env.MAIL_CREDENTIALS || '',
  MAIL_FROM_ADDRESS: env.MAIL_FROM_ADDRESS || '',
  MAIL_FROM_NAME: env.MAIL_FROM_NAME || '',

  MAILTRAP_HOST: env.MAILTRAP_HOST || 'smtp.mailtrap.io',
  MAILTRAP_PORT: env.MAILTRAP_PORT || 587,
  MAILTRAP_SECURE: env.MAILTRAP_SECURE || false,
  MAILTRAP_USER: env.MAILTRAP_USER || '',
  MAILTRAP_CREDENTIALS: env.MAILTRAP_CREDENTIALS || '',

  MAILCHIMP_KEY: env.MAILCHIMP_KEY || '',
  MAILCHIMP_SERVER: env.MAILCHIMP_SERVER || '',
  MAILCHIMP_DEFAULT_LIST_ID: env.MAILCHIMP_DEFAULT_LIST_ID || '',

  ADMIN_FIRST_NAME: env.ADMIN_FIRST_NAME || 'Admin',
  ADMIN_LAST_NAME: env.ADMIN_LAST_NAME || 'Admin',
  ADMIN_EMAIL: env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: env.ADMIN_PASSWORD || '',
  ADMIN_RENEW: env.ADMIN_RENEW || 'no',

  JWT_SECRET: env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET || 'secret-ref',
  TOKEN_EXPIRE_TIME: env.TOKEN_EXPIRE_TIME || '1h',
  RERFRESH_TOKEN_EXPIRE_TIME: env.RERFRESH_TOKEN_EXPIRE_TIME || '7d',

  SALT_ROUNDS: env.SALT_ROUNDS || 10,

  COOKIE_DOMAIN: env.COOKIE_DOMAIN || 'localhost',
  COOKIE_EXPIRY: Number(env.COOKIE_EXPIRY) || (60 * 60 * 24 * 60), // 60 days
};
