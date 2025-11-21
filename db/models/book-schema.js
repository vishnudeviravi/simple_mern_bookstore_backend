const { Schema, model } = require('mongoose');

const bookSchema = Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  price: {
    type: Number,
    default: 400,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'authors',
  },
  image: {
    type: String,
  },
});

const Book = model('books', bookSchema);

module.exports = Book;
