const { Schema, model } = require('mongoose');

const authorSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  about: {
    type: String,
  },
  image: {
    type: String,
  },
  awards: [String],
});

const Author = model('authors', authorSchema);

module.exports = Author;
