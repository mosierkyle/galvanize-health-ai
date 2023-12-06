const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  title: { type: Object, required: false },
  body: { type: Object, required: false },
});

module.exports = dietSchema;
