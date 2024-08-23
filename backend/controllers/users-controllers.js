const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const getAllUsersExceptCurrent = async (req, res, next) => {
  let filteredUsers;
  try {
    filteredUsers = await User.find().select("-password");
  } catch (err) {
    const error = new HttpError("could not found user", 500);
    return next(error);
  }

  res.json({
    users: filteredUsers.map((user) => user.toObject({ getters: true })),
  });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user for the provided user id.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Could not find user for the provided user id.",
      500
    );
    return next(error);
  }

  const imagePath = req.file.path;
  user.fullName = name;
  user.profileImage = imagePath;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Saving user failed, could not update the user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.getAllUsersExceptCurrent = getAllUsersExceptCurrent;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
