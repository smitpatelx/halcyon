// Database mongo
const mongoose = require('mongoose');
const { createAdmin } = require('../seed/admin');
const env = require('../helpers/config');

mongoose.set('bufferCommands', false);
mongoose.connect(`mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
    useCreateIndex: true,
    useFindAndModify: false
  });

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  // we're connected!
  await createAdmin().then(() => {}).catch(() => {});
});
