const express = require('express');
// const checkToken = require('./middlewares/check-token');
const cors = require('cors');

require('dotenv').config('./.env');

require('./db');

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//routes
const bookRoutes = require('./routes/book-routes');
app.use(bookRoutes);

const userRoutes = require('./routes/user-routes');
app.use(userRoutes);

const authorRoutes = require('./routes/author-routes');
app.use(authorRoutes);

app.listen(8000, () => {
  console.log('App is running @ http://localhost:8000');
});
