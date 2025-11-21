const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log('DB connected');
  })
  .catch(e => {
    console.log(e);
  });

module.exports = mongoose;
