const express = require("express");
const bcrypt = require("bcrypt");
const Quiz = require("../models/quiz");
const Participate = require("../models/Participate");
const Question = require("../models/question");
const User = require("../models/user");
const Answer = require("../models/answer");
const router = express.Router();
require("dotenv").config();
// const JWT_SECRET = process.env.JWT_SECRET;

// List all quizzes
router.get("/quizzes", (req, res) => {
  Quiz.find({}, (err, quizzes) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(quizzes);
    }
  });
});

// Get single quiz detail
router.get("/quizzes/:id", (req, res) => {
  Quiz.findById(req.params.id, (err, quiz) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
    } else {
      res.json(quiz);
    }
  });
});

// Create a new quiz
router.post("/quizzes", (req, res) => {
  let quiz = new Quiz(req.body);
  quiz.save((err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(quiz);
    }
  });
});

// Participate in quiz
// router.post("/quizzes/:id/participate", isUser, async (req, res) => {
//   let quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404).json({ error: "Quiz not found" });
//   } else {
//     let questions = await Question.find({ _id: { $in: quiz.questions } });
//     let correctAnswers = 0;
//     req.body.answers.forEach((answer, index) => {
//       if (answer === questions[index].correctAnswer) {
//         correctAnswers++;
//       }
//     });
//     res.json({ score: correctAnswers / questions.length });
//   }
// });

router.post("/quizzes/:id/participate", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).send({ error: "Quiz not found" });

    req.body.quizId = quiz._id;
    // check if answers are correct
    req.body.score = quiz.checkAnswers(req.body.answers);
    const participate = new Participate(req.body);
    await participate.save();

    res.send(participate);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
router.get("/questions", (req, res) => {
  Question.find({}, (err, question) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(question);
    }
  });
});
router.post("/questions", async (req, res) => {
  try {
    // create new Answer model
    const correctAnswer = await Answer.create({
      content: req.body.correctAnswer,
    });

    // create new Question model and set answer to the created answer's id
    const question = new Question({
      content: req.body.content,
      options: req.body.options,
      answer: correctAnswer._id,
    });

    // save the question to the database
    await question.save();
    res.status(201).send(question);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/users", async (req, res) => {
  try {
    // create new User model
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    // hash the password and save the user to the database
    user.password = await bcrypt.hash(user.password, 8);
    await user.save();

    // generate and return a JSON web token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Middleware function to check if user is an admin
function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Middleware function to check if user is a normal user
function isUser(req, res, next) {
  if (req.user.role === "user") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = router;
