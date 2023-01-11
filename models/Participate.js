const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participateSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  quizId: {
    type: String,
    required: true,
    ref: "Quiz",
  },
  answers: [
    {
      questionId: {
        type: String,
        required: true,
        ref: "Question",
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Participate", participateSchema);
