const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const path = require("path");

const authRoutes = require("./routes/auth-routes");
const messagesRoutes = require("./routes/messages-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const { app, httpServer } = require("./socket/socket");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", usersRoutes);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route.", 404);
//   throw error;
// });

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.port || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.sxidkwv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected");
    httpServer.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
