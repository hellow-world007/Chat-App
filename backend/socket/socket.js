const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);

const socket = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId = (reciverId) => {
  return userSocketMap[reciverId];
};

const userSocketMap = {};

socket.on("connection", (socket) => {
  console.log("CONNECTED!", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  socket.emit("getActiveUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    delete userSocketMap[userId];
    socket.emit("getActiveUsers", Object.keys(userSocketMap));
  });

  //   socket.on("message", (data) => {
  //     console.log(data);
  //   });

  //   socket.emit("message", "Hellow client!");
});

// httpServer.listen(3000, () => {
//   //   console.log("Server is connected!");
// });

module.exports = { app, httpServer, socket, getReceiverSocketId };
