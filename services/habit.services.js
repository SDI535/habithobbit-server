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

const createOneHabit = async (user, name, description, frequency, endDate) => {
  let result = {};

  const habit = await Habit.create({
    user,
    name,
    description,
    frequency,
    endDate,
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

module.exports = {
  getAllHabits,
  createOneHabit,
  updateOneHabit,
  deleteOneHabit,
};
