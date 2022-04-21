const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

/** IMPORT THE ROUTES */
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

/** ERROR HANDLER */
const NotFound = require("./helpers/404");
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/authJwt");

/** INITIALIZE THE APP */
const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

/** MIDDLEWARES */
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
//app.use(authJwt());
app.use(errorHandler);

/**ROUTES */
app.use(`${process.env.API_URL}/user`, userRouter);
app.use(`${process.env.API_URL}/todo`, todoRouter);

/** CONNECTING TO THE DATABSE */
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("could not connect to database"));

app.use(NotFound);
app.listen(process.env.PORT, () => {
  console.log(`Server running on: http://localhost:${process.env.PORT}/api/v1`);
});
