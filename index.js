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

//Blog//

let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Blog", blogSchema);

//middlewares//

let fs = require("fs");

let logger = (req, res, next) => {
  let log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFileSync("logs.txt", log);
  next();
};

module.exports = logger;

//usercontroller//

let User = require("../models/User");

exports.addUser = async (req, res) => {
  try {
    let user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//blogcontroller//

let Blog = require("../models/Blog");

exports.addBlog = async (req, res) => {
  try {
    let blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    let blogs = await Blog.find().populate("author");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).populate("author");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByUserId = async (req, res) => {
  try {
    let blogs = await Blog.find({ author: req.params.userid }).populate("author");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    let blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//userRoutes//

let express = require("express");
let { addUser, getUserById, deleteUser } = require("../controllers/userController");

let router = express.Router();

router.post("/add", addUser);
router.get("/:id", getUserById);
router.delete("/delete/:id", deleteUser);

module.exports = router;

//blogRoutes//

let express = require("express");
let {
  addBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

let router = express.Router();

router.post("/add", addBlog);
router.get("/get/all", getAllBlogs);
router.get("/get/:id", getBlogById);
router.get("/get/user/:userid", getBlogsByUserId);
router.patch("/update/:id", updateBlog);
router.delete("/delete/:id", deleteBlog);

module.exports = router;

//index1.js//

const os = require("os");

app.get("/memory", (req, res) => {
  const freeMemory = os.freemem();
  res.json({ freeMemory });
});

