const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");
const staff = require("./middleware/staff");

app.use(cors());
app.use(express.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connection established"))
  .catch((error) => console.log(error));

app.use("/api/users", auth, admin, require("./routes/users"));
app.use("/api/leads", auth, staff, require("./routes/leads"));
app.use("/api/auth", require("./routes/auth"));

app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});
