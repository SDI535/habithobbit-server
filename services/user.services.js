const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const aws = require("aws-sdk");
const crypto = require("crypto");
const { promisify } = require("util");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const expiredToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1ms" });
};

const randomBytes = promisify(crypto.randomBytes);
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const registerOneUser = async (username, email, password) => {
  let result = {};

  const userExists = await User.findOne({ email });
  //check for user
  if (userExists) {
    throw new Error("userExists");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    (result.success = true), (result.message = "User created successfully");
    result.data = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
  }

  return result;
};

const loginOneUser = async (email, password) => {
  let result = {};

  //check for user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("notFound");
  }
  const isPwCorrect = await bcrypt.compare(password, user.password);
  if (user && isPwCorrect) {
    (result.success = true), (result.message = "Login successfully");
    result.data = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    result.token = generateToken(user._id);
  } else if (!isPwCorrect) {
    throw new Error("wrongPw");
  }
  return result;
};

const getUserProfile = async (user) => {
  let result = {};
  const userProfile = await User.findById(user);
  (result.success = true),
    (result.message = `Get user ${user} profile successfully`);
  result.data = userProfile;

  return result;
};

const updateUserProfile = async (user, body) => {
  let result = {};
  //check for user
  const userExists = await User.findById(user);
  if (!userExists) {
    throw new Error("User not found");
  }
  const updateProfile = await User.findByIdAndUpdate(user, body, {
    new: true,
  });
  result.success = "true";
  result.message = `Update User ${user} profile successfully`;
  result.data = updateProfile;
  return result;
};

const logoutOneUser = async (user) => {
  let result = {};
  const userExists = await User.findById(user);
  if (userExists) {
    (result.success = true), (result.message = "Logout successfully");
    result.data = {
      token: expiredToken(userExists._id),
    };
  }
  return result;
};

const generateUploadUrl = async () => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};

module.exports = {
  registerOneUser,
  loginOneUser,
  getUserProfile,
  updateUserProfile,
  logoutOneUser,
  generateUploadUrl,
};
