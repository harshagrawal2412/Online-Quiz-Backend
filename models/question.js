const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
