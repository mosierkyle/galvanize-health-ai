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

app.use(routes);

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

// app.get('/health-questions', (req, res) => {
//   if (res.locals.currentUser) {
//     res.render('health-questions', { user: res.locals.currentUser });
//   } else {
//     res.render('401');
//   }
// });

// app.get('/goals-questions', (req, res) => {
//   if (res.locals.currentUser) {
//     res.render('goals-questions', { user: res.locals.currentUser });
//   } else {
//     res.render('401');
//   }
// });

// app.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/login', (req, res) => {
//   res.render('login');
// });

// app.get('/signup', (req, res) => {
//   res.render('signup');
// });

// app.get('/authenticated', async (req, res) => {
//   if (res.locals.currentUser) {
//     console.log('someone logged in');
//     res.render('authenticated', { user: res.locals.currentUser });
//   } else {
//     res.render('401');
//   }
// });

// app.post('/health-info/:id', async (req, res) => {
//   const id = req.params.id;
//   const newInfo = req.body;
//   console.log(newInfo);

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.health = {
//       age: req.body.age,
//       weight: req.body.weight,
//       height: req.body.height,
//       activity: req.body.activity,
//       skillLevel: req.body.skillLevel,
//       timeAvailability: req.body.timeAvailability,
//       prefferedExercise: req.body.prefferedExercise,
//       limitations: req.body.limitations,
//       other: req.body.other,
//     };

//     await user.save();
//     console.log(user);
//     res.redirect('/goals-questions');
//     console.log('updated');
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post('/goals-info/:id', async (req, res) => {
//   const id = req.params.id;
//   const newInfo = req.body;
//   console.log(newInfo);

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.goals = {
//       overall: req.body.overall,
//       strength: req.body.strength,
//       weight: req.body.weight,
//       other: req.body.other,
//     };

//     await user.save();
//     console.log(user);
//     res.redirect('/dashboard');
//     console.log('updated');
//     await sendChatRequest(id);
//   } catch (err) {
//     console.log(err);
//   }
// });

// async function sendChatRequest(id) {
//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return console.status(404).json({ message: 'User not found' });
//     }

//     const userSummary = `This user is ${user.health.age} years old, this height ${user.health.height}, this weight ${user.health.weight}, this user's current activity level is this ${user.health.activity}, this user's fitness skill level / knowledge level is ${user.health.skillLevel}, this user's time availability is ${user.health.timeAvailability}, this user's preffered type of exercise(s) is/are ${user.health.prefferedExercise}, this user's limitations are ${user.health.limitations}, these are additional comments made by the user about their current health and fitess ${user.health.other}. These are the users goals: overall goals ${user.goals.overall}, strength goals ${user.goals.strength}, weight goals ${user.goals.weight}, other goals ${user.goals.other}`;

//     const fitnessTitlePrompt = [
//       {
//         role: 'system',
//         content:
//           'You are a helpful assistant that is very knowledgable about health and fitness, you are a personal trainer/ health coach.',
//       },
//       {
//         role: 'user',
//         content: `Generate a title for a fitness plan for this user based upon this information about them ${userSummary}.`,
//       },
//     ];

//     const fitnessBodyPrompt = [
//       {
//         role: 'system',
//         content:
//           'You are a helpful assistant that is very knowledgable about health and fitness, you are basically a personal trainer/ health coach.',
//       },
//       {
//         role: 'user',
//         content: `Generate a fitness plan for this user based upon this information about them ${userSummary}.`,
//       },
//     ];

//     const fitnessExtraPrompt = [
//       {
//         role: 'system',
//         content:
//           'You are a helpful assistant that is very knowledgable about health and fitness, you are basically a personal trainer/ health coach.',
//       },
//       {
//         role: 'user',
//         content: `Generate additional details and things to keep in mind for a fitness plan for this user based upon this information about them ${userSummary}.`,
//       },
//     ];

//     const messages = [
//       [...fitnessTitlePrompt],
//       [...fitnessBodyPrompt],
//       [...fitnessExtraPrompt],
//     ];

//     const fitnessResponseTitle = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: messages[0],
//       max_tokens: 50,
//     });

//     const fitnessResponseBody = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: messages[1],
//       max_tokens: 500,
//     });

//     const fitnessResponseExtra = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: messages[2],
//       max_tokens: 100,
//     });

//     user.fitnessPlan = {
//       title: fitnessResponseTitle.choices[0].message.content,
//       body: fitnessResponseBody.choices[0].message.content,
//       extra: fitnessResponseExtra.choices[0].message.content,
//     };

//     await user.save();
//   } catch (err) {
//     console.log(err);
//   }
// }
