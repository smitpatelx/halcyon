// Database mongo
var mongoose = require('mongoose');
var { createAdmin } = require("../seed/admin")

mongoose.set('bufferCommands', false);
mongoose.connect(`mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}?authSource=admin`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
    useCreateIndex: true,
    useFindAndModify: false
  });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  // we're connected!
  console.log("Database Connected successfully!")
  await createAdmin().then(data=>{}).catch(err=>{});
});
