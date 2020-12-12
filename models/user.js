const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  },
  user_type:{
    type: String,
    min:3,
    max:50,
    lowercase: true,
    default: 'client'
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

userSchema.plugin(mongoosePaginate);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;
