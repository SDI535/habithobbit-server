const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");

const { errorHandler } = require("./middleware/error.middleware");
const connectDB = require("./config/db");

const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(express.json());

app.use("/", require("./routes/landing.routes"));
app.use("/api/v1/habits", require("./routes/habit.routes"));
app.use("/api/v1/users", require("./routes/user.routes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
