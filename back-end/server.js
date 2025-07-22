const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = require("./app");
app.use(express.json());
const port = process.env.PORT || 8000;
const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.acmappa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
