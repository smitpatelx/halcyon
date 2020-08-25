const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const mongoosePaginate = require('mongoose-paginate');

const contactSchema = new mongoose.Schema({
  first_name:{
    type: String,
    min: 2,
    max: 20,
    lowercase: true,
    required: true
  },
  last_name:{
    type: String,
    min: 2,
    max: 20,
    lowercase: true,
    required: true
  },
  email:{
    type: String,
    min:6,
    max:60,
    lowercase: true,
    unique: false,
    required: true
  },
  phone:{
    type: String,
    min:10,
    max:15,
    required: true
  },
  country_code:{
    type: String,
    max:2,
    default:'ca',
    lowercase: true,
  },
  business_name:{
    type: String,
    min: 3, 
    max: 50
  },
  business_employees:{
    type: Number,
    min:2, 
    max:10000
  },
  est_budget:{
    type: Number,
    min:3000, 
    max:200000
  },
  message:{
    type: String,
    max: 1500
  },
  ip_address:{
    type: String,
    min: 8,
    max: 20,
    required: true
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

contactSchema.plugin(mongoosePaginate);
// contactSchema.plugin(findOrCreate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
