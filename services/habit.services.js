const { RestoreRequestFilterSensitiveLog } = require("@aws-sdk/client-s3");
const Habit = require("../models/habit.model");
const User = require("../models/user.model");

const getAllHabits = async (user) => {
  let result = {};
  const habits = await Habit.find({ user });
  if (habits) {
    (result.success = true),
      (result.message = `Get habits of user ${user} successfully!`);
    result.data = habits;
  } else {
    throw new Error();
  }

  return result;
};

const getAllPublicHabits = async (user) => {
  let result = {};
  const userExist = await User.findById(user);
  if (!userExist) {
    throw new Error("userNotFound");
  }
  const publicHabits = await Habit.find({ private: false }).populate({
    path: "user",
    select: ["username", "avatarUrl"],
  });

  if (publicHabits) {
    result.success = true;
    result.message = "Get all public habits successfully";
    result.data = publicHabits;
  } else {
    throw new Error();
  }
  return result;
};

const getOneHabit = async (userId, habitId) => {
  let result = {};
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("userNotFound");
  }
  const habit = await Habit.findById(habitId);
  //check habit user matches login user
  if (habit.user.toString() !== user.id) {
    throw new Error("userUnauthorized");
  }

  if (habit) {
    result.success = true;
    result.message = `Get habit id ${habitId} successfully`;
    result.data = habit;
  } else {
    throw new Error("habitNotFound");
  }
  return result;
};

//create a new habit
const createOneHabit = async (
  user,
  name,
  description,
  frequency,
  endDate,
  targetCount,
  currentCount,
  private
) => {
  let result = {};

  const habit = await Habit.create({
    user,
    name,
    description,
    frequency,
    endDate,
    targetCount,
    currentCount,
    private,
  });
  if (habit) {
    (result.success = true), (result.message = "Habit created successfully");
    result.data = habit;
  } else {
    throw new Error();
  }
  return result;
};

const updateOneHabit = async (habitId, userId, body) => {
  let result = {};
  //check for habit
  const habit = await Habit.findById(habitId);

  if (!habit) {
    throw new Error("habitNotFound");
  }
  //check for user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("userNotFound");
  }
  //check habit user matches login user
  if (habit.user.toString() !== user.id) {
    throw new Error("userUnauthorized");
  }
  const updateHabit = await Habit.findByIdAndUpdate(habitId, body, {
    new: true,
  });
  result.success = true;
  result.message = `Habit ${habitId} updated successfully`;
  result.data = updateHabit;
  return result;
};

const deleteOneHabit = async (habitId, userId) => {
  let result = {};
  //check for habit
  const habit = await Habit.findById(habitId);

  if (!habit) {
    throw new Error("habitNotFound");
  }
  //check for user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("userNotFound");
  }
  //check habit user matches login user
  if (habit.user.toString() !== user.id) {
    throw new Error("userUnauthorized");
  }
  await habit.remove();
  (result.success = true),
    (result.message = `Habit ${habitId} deleted successfully`);
  return result;
};

//like a public Habit
const likeOneHabit = async (userId, habitId) => {
  let result = {};
  //check for habit

  const habit = await Habit.findById(habitId);

  if (!habit) {
    throw new Error("habitNotFound");
  }

  //check for user

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("userNotFound");
  }

  //check habit user matches login user. owner cannot like their own habit

  if (habit.user.toString() === user.id) {
    throw new Error("userIsOwner");
  }

  const updatedHabit = await Habit.findByIdAndUpdate(
    habitId,
    { $push: { likes: userId } },
    { new: true }
  );

  if (updatedHabit) {
    result.success = true;
    result.message = `habit ${habitId} like by user ${userId} successfully`;
    result.data = updatedHabit;
  }
  return result;
};

//unlike a public Habit
const unlikeOneHabit = async (userId, habitId) => {
  let result = {};
  //check for habit
  const habit = await Habit.findById(habitId);

  if (!habit) {
    throw new Error("habitNotFound");
  }

  //check for user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("userNotFound");
  }

  //check habit user matches login user. owner cannot unlike their own habit
  if (habit.user.toString() === user.id) {
    throw new Error("userIsOwner");
  }

  const updatedHabit = await Habit.findByIdAndUpdate(
    habitId,
    { $pull: { likes: userId } },
    { new: true }
  );

  if (updatedHabit) {
    result.success = true;
    result.message = `habit ${habitId} unlike by user ${userId} successfully`;
    result.data = updatedHabit;
  }
  return result;
};

module.exports = {
  getAllHabits,
  createOneHabit,
  updateOneHabit,
  deleteOneHabit,
  getOneHabit,
  getAllPublicHabits,
  likeOneHabit,
  unlikeOneHabit,
};
