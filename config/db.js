const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    const res = await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connect;
