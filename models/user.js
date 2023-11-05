const mongoose = require('mongoose');
const healthSchema = require('./health');
const nutritionSchema = require('./nutrition_plan');
const dietSchema = require('./diet_plan');
const goalsSchema = require('./goals');
const fitnessSchema = require('./fitness_plan');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  health: healthSchema,
  goals: goalsSchema,
  dietPlan: dietSchema,
  fitnessPlan: fitnessSchema,
  nutritionPlan: nutritionSchema,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
