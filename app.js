const express = require("express");
const app = express();
const cors = require("cors");
const { uploadHandler } = require("./routes/uploadthings");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/events", require("./routes/eventRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/blog", require("./routes/blogRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/uploadthings", uploadHandler);

module.exports = app;
