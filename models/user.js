const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  health: {
    age: { type: String, required: false },
    weight: { type: String, required: false },
    height: { type: String, required: false },
    activity: { type: String, required: false },
    currentFitness: { type: String, required: false },
    other: { type: String, required: false },
  },
  goals: {
    overall: { type: String, required: false },
    strength: { type: String, required: false },
    weight: { type: String, required: false },
    priority: { type: String, required: false },
    other: { type: String, required: false },
  },
  dietPlan: {
    title: { type: String, required: false },
    body: { type: String, required: false },
    extra: { type: String, required: false },
  },
  fitnessPlan: {
    title: { type: String, required: false },
    body: { type: String, required: false },
    extra: { type: String, required: false },
  },
  nutritionPlan: {
    title: { type: String, required: false },
    body: { type: String, required: false },
    extra: { type: String, required: false },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
