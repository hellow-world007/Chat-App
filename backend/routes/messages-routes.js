const express = require("express");
const { check } = require("express-validator");

const messagesControllers = require("../controllers/messages-controllers");

const router = express.Router();

router.post("/send/:senderId/:receiverId", messagesControllers.postMessage);

router.get("/read/:senderId/:receiverId", messagesControllers.getMessages);

module.exports = router;
