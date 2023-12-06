const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
  title: { type: Object, required: false },
  body: { type: Object, required: false },
});

module.exports = fitnessSchema;
