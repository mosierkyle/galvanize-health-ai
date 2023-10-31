const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

const mongoDB =
  'mongodb+srv://mosierkyle:46k9YYMgN2B6B4sJ@cluster0.aesr15j.mongodb.net/Users?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);

const main = async () => {
  try {
    await mongoose.connect(mongoDB);
    app.listen(4000);
  } catch (err) {
    console.log(err);
  }
};

main();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});
