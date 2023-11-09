const health_questions_get = (req, res) => {
  res.locals.currentUser = req.user;
  if (res.locals.currentUser) {
    res.render('health-questions', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
};

const goals_questions_get = (req, res) => {
  res.locals.currentUser = req.user;
  if (res.locals.currentUser) {
    res.render('goals-questions', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
};

const dashboard_get = (req, res) => {
  res.render('dashboard');
};

const landing_get = (req, res) => {
  res.render('index');
};

const login_get = (req, res) => {
  res.render('login');
};

const signup_get = (req, res) => {
  res.render('signup');
};

const authenticated_get = async (req, res) => {
  res.locals.currentUser = req.user;
  if (res.locals.currentUser) {
    console.log('someone logged in');
    res.render('authenticated', { user: res.locals.currentUser });
  } else {
    res.render('401');
  }
};

module.exports = {
  health_questions_get,
  goals_questions_get,
  dashboard_get,
  landing_get,
  login_get,
  signup_get,
  authenticated_get,
};
