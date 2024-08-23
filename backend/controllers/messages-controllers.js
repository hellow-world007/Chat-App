const Conversation = require("../models/conversation");
const Message = require("../models/message");
const HttpError = require("../models/http-error");
const { getReceiverSocketId, socket } = require("../socket/socket");

const postMessage = async (req, res, next) => {
  const { message } = req.body;
  const receiverId = req.params.receiverId;
  // const senderId = req.userData.userId;
  const senderId = req.params.senderId;

  let conversation;
  try {
    conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
  } catch (err) {
    const error = new HttpError("Couldnot find any conversation.", 500);
    return next(error);
  }

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const createdMessage = new Message({
    senderId: senderId,
    receiverId: receiverId,
    message: message,
  });

  if (!createdMessage) {
    const error = new HttpError("Creating message failed.", 403);
    return next(error);
  }

  try {
    await createdMessage.save();
  } catch (err) {
    const error = new HttpError("Saving message failed.", 500);
    return next(error);
  }

  try {
    conversation.messages.push(createdMessage.id);
    await conversation.save();
  } catch (err) {
    const error = new HttpError("Saving conversation failed.", 500);
    return next(error);
  }

  // socket io functionality
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    socket.to(receiverSocketId).emit("message", createdMessage);
  }

  res.status(201).json({ message: createdMessage });
};

const getMessages = async (req, res, next) => {
  const { senderId, receiverId: userToChatId } = req.params;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages");

  if (!conversation) {
    const error = new HttpError(
      "could not find conversation between them.",
      403
    );
    return next(error);
  }

  res.status(200).json({ messages: conversation.messages });
};

exports.postMessage = postMessage;
exports.getMessages = getMessages;
