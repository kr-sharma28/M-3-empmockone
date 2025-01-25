let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let userRoutes = require("./routes/userRoutes");
let blogRoutes = require("./routes/blogRoutes");
let logger = require("./middlewares/logger");

let app = express();
let PORT = 8080;
let DB_NAME = "emphermockone";

app.use(bodyParser.json());
app.use(logger);

mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blogging Platform API!");
});

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
