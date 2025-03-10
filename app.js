// app.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Mount routes
app.use("/events", require("./routes/eventRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/blog", require("./routes/blogRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));

module.exports = app;

