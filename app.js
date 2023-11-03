const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const User = require('/models/user');
require('dotenv').config();

//Server and Database connection
const app = express();

const mongoDB = process.env.S1;

mongoose.set('strictQuery', false);

const main = async () => {
  try {
    await mongoose.connect(mongoDB);
    app.listen(4000);
    console.log(`Server Listning on port 4000`);
  } catch (err) {
    console.log(err);
  }
};

main();

app.set('view engine', 'ejs');

//Authentication
// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username' });
//       }
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return done(null, false, { message: 'Incorrect password' });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

//Middleware
app.use(morgan('dev'));
app.use(express.static('public/css'));
app.use(express.static('public/scripts'));
app.use(express.static('public/logos'));
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});
