const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Routes
app.use("/events", require("./routes/eventRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes")); // Tambahkan

module.exports = app;
