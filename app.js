const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
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

// Authentication
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

// Routes

app.post('/sign-up', async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 8, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        name: req.body.name,
        email: req.body.email,
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
    successRedirect: 'authenticated',
    failureRedirect: 'signup',
  })
);

app.get('/health-questions', (req, res) => {
  if (res.locals.currentUser) {
    res.render('health-questions', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
});

app.get('/goals-questions', (req, res) => {
  //   if (res.locals.currentUser) {
  //     res.render('goals-questions', { user: res.locals.currentUser });
  //   } else {
  //     res.render('401');
  //   }
  res.render('goals-questions');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/authenticated', async (req, res) => {
  if (res.locals.currentUser) {
    console.log('someone logged in');
    res.render('authenticated', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
});

app.post('/health-info/:id', async (req, res) => {
  const id = req.params.id;
  const newInfo = req.body;
  console.log(newInfo);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.health = {
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      activity: req.body.activity,
      currentFitness: req.body.currentFitness,
      other: req.body.other,
    };

    await user.save();
    console.log(user);
    res.redirect('/goals-questions');
    console.log('updated');
  } catch (err) {
    console.log(err);
  }
});
