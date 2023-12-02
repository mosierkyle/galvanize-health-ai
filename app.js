const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const routes = require('./controllers/routes');
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

//Authentication;
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//Middleware
app.use(
  session({ secret: 'galvanize', resave: false, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.static('public/css'));
app.use(express.static('public/scripts'));
app.use(express.static('public/logos'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//miscellaneous
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Routes
app.use(routes);

app.post('/sign-up', async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 8, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        firstName: capitalizeFirstLetter(req.body.firstName),
        lastName: capitalizeFirstLetter(req.body.lastName),
        username: req.body.username,
        password: hashedPassword,
      });

      try {
        const result = await user.save();

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/health-questions');
        });
      } catch (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage:
      'The password or username you entered does not match what we have in our database. Please try again or select "Forgot" to recover your account.',
  }),
  (req, res) => {
    res.redirect('dashboard');
  }
);
