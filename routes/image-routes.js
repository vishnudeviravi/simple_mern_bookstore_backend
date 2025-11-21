const express = require('express');
const multer = require('multer');

const router = express.Router();

router.post('/image-upload', (req, res) => {
  try {
  } catch (e) {
    return res.status(500).json({ message: e.message, error: true });
  }
});

module.exports = router;
