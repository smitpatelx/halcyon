const md5 = require('md5');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const env = require('../helpers/config');

mailchimp.setConfig({
  apiKey: env.MAILCHIMP_KEY,
  server: env.MAILCHIMP_SERVER,
});

const changeStatus = async (email, status, listId) => {
  if (typeof status === 'undefined') {
    status = 'unsubscribed';
  }
  if (typeof listId === 'undefined') {
    listId = env.MAILCHIMP_DEFAULT_LIST_ID || null;
  }

  const subscriberHash = md5(email.toLowerCase());

  return new Promise((resolve, reject) => {
    mailchimp.lists.updateListMember(
      listId,
      subscriberHash,
      { status }
    ).then((data) => {
      if (data.status === status) {
        resolve(`Mailchimp status for ${email} is now ${data.status}`);
      } else {
        resolve(`Mailchimp failed to update status for ${email} : ${data.status}`);
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

const newSubscriber = async (data, listId) => {
  if (typeof listId === 'undefined') {
    listId = env.MAILCHIMP_DEFAULT_LIST_ID || null;
  }

  return new Promise((resolve, reject) => {
    mailchimp.lists.addListMember(listId, {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.first_name,
        LNAME: data.last_name
      }
    }).then((data2) => {
      resolve(data2);
    }).catch((err) => {
      if (err.response.status === 400) {
        changeStatus(data.email, 'subscribed')
          .then((data2) => {
            resolve(data2);
          }).catch((err2) => {
            reject(err2);
          });
      }
      reject(err);
    });
  });
};

module.exports = { newSubscriber, changeStatus };
