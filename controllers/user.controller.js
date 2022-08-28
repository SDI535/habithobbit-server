const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

const {
  registerOneUser,
  loginOneUser,
  getUserProfile,
  logoutOneUser,
  generateUploadUrl,
  updateUserProfile,
} = require("../services/user.services");

// @desc Register new user
// @route POST  /api/v1/users
// @access Public

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const result = await registerOneUser(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "userExists") {
      next({ status: 400, message: "user already exists" });
    } else {
      next();
    }
  }
};

// @desc Authenticate a user
// @route POST  /api/v1/users/login
// @access Public

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await loginOneUser(email, password);
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.message === "notFound") {
      next({ status: 404, message: "user not found" });
    } else if (error.message === "wrongPw") {
      next({ status: 400, message: "incorrect password" });
    } else {
      next();
    }
  }
};

// @desc Get user profile
// @route GET  /api/v1/users/profile
// @access Private

const getProfile = async (req, res, next) => {
  const user = req.user.id;
  try {
    const result = await getUserProfile(user);
    res.status(200).json(result);
  } catch (error) {
    next();
  }
};

// @desc  Update user profile
// @route PUT  /api/v1/users/uploadurl
// @access Private

const updateProfile = async (req, res, next) => {
  const user = req.user.id;
  const body = req.body;
  try {
    const result = await updateUserProfile(user, body);
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    next();
  }
};

// @desc  Logout User from server, set token exp to 1ms
// @route POST  /api/v1/users/logout
// @access Private

const logoutUser = async (req, res, next) => {
  const user = req.user.id;
  try {
    const result = await logoutOneUser(user);
    res.status(200).json(result);
  } catch (error) {
    next();
  }
};

// @desc  get presigned s3 URL to upload profile image, expiry 60s
// @route GET  /api/v1/users/uploadurl
// @access Private

const uploadUrl = async (req, res, next) => {
  const url = await generateUploadUrl();
  res.send({ url });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
  uploadUrl,
};
