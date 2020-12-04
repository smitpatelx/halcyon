const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const mongoosePaginate = require('mongoose-paginate-v2');

const subscriptionSchema = new mongoose.Schema({
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
    unique: true,
    required: true
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

subscriptionSchema.plugin(mongoosePaginate);
// subscriptionSchema.plugin(findOrCreate);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
