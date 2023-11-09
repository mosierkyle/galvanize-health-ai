const express = require('express');
const router = express.Router();
const pageController = require('./pageController');
const databaseController = require('./databaseController');

//gets
router.get('/health-questions', pageController.health_questions_get);

router.get('/goals-questions', pageController.goals_questions_get);

router.get('/dashboard', pageController.dashboard_get);

router.get('/', pageController.landing_get);

router.get('/login', pageController.login_get);

router.get('/signup', pageController.signup_get);

router.get('/authenticated', pageController.authenticated_get);

//posts
router.post('/health-info/:id', databaseController.health_post);

router.post('/goals-info/:id', databaseController.goals_post);

module.exports = router;
