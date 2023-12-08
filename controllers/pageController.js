const User = require('../models/user');
const ai = require('./databaseController');

const health_questions_get = (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.locals.currentUser = req.user;
  if (res.locals.currentUser) {
    res.render('health-questions', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
};

const goals_questions_get = (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.locals.currentUser = req.user;
  if (res.locals.currentUser.goals) {
    return res.render('dashboard', { user: res.locals.currentUser });
  }
  res.render('goals-questions', { user: res.locals.currentUser });
};

const dashboard_get = async (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.locals.currentUser = req.user;
  const id = res.locals.currentUser._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.health) {
      return res.render('health-questions', { user: res.locals.currentUser });
    }
    if (!user.goals) {
      return res.render('goals-questions', { user: res.locals.currentUser });
    }
    if (!user.fitnessPlan) {
      await ai.sendFitnessChatRequest(id);
    }
    if (!user.dietPlan) {
      await ai.sendDietChatRequest(id);
    }
    if (!user.nutritionPlan) {
      await ai.sendNutritionChatRequest(id);
    }
    res.render('dashboard', { user: res.locals.currentUser });
  } catch (err) {
    console.log(err);
  }
};

const landing_get = (req, res) => {
  res.render('index');
};

const login_get = (req, res) => {
  res.render('login', { req: req });
};

const signup_get = (req, res) => {
  res.render('signup');
};

const loading_get = async (req, res) => {
  res.render('loading');
  res.locals.currentUser = req.user;
  const id = res.locals.currentUser._id;
  await ai.sendFitnessChatRequest(id);
  await ai.sendDietChatRequest(id);
  await ai.sendNutritionChatRequest(id);
};

const workout_get = (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.render('workout', { user: res.locals.currentUser });
};

const diet_get = (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.render('diet', { user: res.locals.currentUser });
};

const nutrition_get = (req, res) => {
  if (!req.user) {
    return res.redirect('error');
  }
  res.render('nutrition', { user: res.locals.currentUser });
};

const user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

const error_get = (req, res) => {
  res.render('error');
};

module.exports = {
  health_questions_get,
  goals_questions_get,
  dashboard_get,
  landing_get,
  login_get,
  signup_get,
  loading_get,
  workout_get,
  diet_get,
  nutrition_get,
  user_logout,
  error_get,
};
