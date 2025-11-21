const express = require('express');
const Author = require('../db/models/author-schema');
const checkToken = require('../middlewares/check-token');

const router = express.Router();

router.get('/author', async (req, res) => {
  try {
    const { page } = req.query;
    const dbResponse = await Author.find({})
      .limit(2)
      .skip((page - 1) * 2);
    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

router.post('/author', async (req, res) => {
  try {
    const { body } = req;
    const dbResponse = await Author.create(body);
    return res.status(201).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

module.exports = router;
