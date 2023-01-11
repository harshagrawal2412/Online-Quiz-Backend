const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: {
    type: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // required: true,
  },
});

quizSchema.methods.checkAnswers = function (answers) {
  let score = 0;
  this.questions.forEach((question) => {
    const answer = answers.find(
      (a) => a.questionId.toString() === question._id.toString()
    );
    if (answer && answer.answer === question.correctAnswer) {
      score++;
    }
  });
  return score;
};

module.exports = mongoose.model("Quiz", quizSchema);
