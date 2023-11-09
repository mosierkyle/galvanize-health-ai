const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  title: { type: String, required: false },
  body: { type: String, required: false },
});

module.exports = dietSchema;
