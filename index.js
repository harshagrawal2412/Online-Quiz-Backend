const express = require("express");
const connect = require("./config/db");
const router = require("./routes");

const app = express();

app.use(express.json());
connect();

// const PORT

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use(cors());
// app.use(passport.initialize());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error logged is: ${error}`);
  server.close(() => process.exit(1));
});
