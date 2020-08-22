const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');

const contactSchema = new mongoose.Schema({
  first_name:{
    type: String,
    min: 2,
    max: 20,
    lowercase: true
  },
  last_name:{
    type: String,
    min: 2,
    max: 20,
    lowercase: true
  },
  email:{
    type: String,
    min:6,
    max:60,
    lowercase: true,
    unique: false
  },
  email_verified:{
    type: Boolean,
    default: false
  },
  phone:{
    type: String,
    min:10,
    max:15,
  },
  extension:{
    type: String,
    min:2,
    max:6,
  },
  avatar:{
    type: String,
    default: 'default.png'
  },
  password:{
    type: String
  },
  google_id:{
    type: String,
    sparse: true
  },
  google_token:{
    type: String
  },
  google_refresh_token:{
    type: String
  },
  github_id:{
    type: String,
    sparse: true
  },
  github_token:{
    type: String
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

contactSchema.plugin(findOrCreate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
