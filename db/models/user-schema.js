const { Schema, model } = require('mongoose');

const addressScehma = Schema({
  houseName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});

const userSchema = Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: [addressScehma],
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    // default: 'USER',
    enum: ['USER', 'ADMIN'],
  },
});

const User = model('users', userSchema);

module.exports = User;
