const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Answer", AnswerSchema);
