const express = require('express');
const Book = require('../db/models/book-schema');
const checkToken = require('../middlewares/check-token');

const router = express.Router();

router.get('/book', async (req, res) => {
  try {
    const {
      title,
      price,
      minprice,
      maxprice,
      sortby = 'title',
      sortorder = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    // http://localhost:8000/book?title=apple&minprice=300
    if (title) query.title = { $regex: title, $options: 'i' };

    if (price) query.price = price;
    else if (minprice && maxprice)
      query.price = { $lte: maxprice, $gte: minprice };
    else if (minprice) query.price = { $gte: minprice };
    else if (maxprice) query.price = { $lte: maxprice };

    console.log(query);
    const dbResponse = await Book.find(query)
      .sort({ [sortby]: sortorder })
      .limit(limit)
      .skip((page - 1) * limit);

    return res.status(200).json(dbResponse);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message, error: true });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { body } = req;
    const dbResponse = await Book.create(body);
    return res.status(201).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

router.get('/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbResponse = await Book.findById(id);

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

router.delete('/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Book deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

router.patch('/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const abc = await Book.findByIdAndUpdate(id, body);

    return res.status(200).json({ message: 'Book updated' });
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

module.exports = router;
