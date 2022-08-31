const express = require("express");

const {
  getAllHabits,
  createOneHabit,
  updateOneHabit,
  deleteOneHabit,
} = require("../services/habit.services");

// @desc Get all habits of a user
// @route GET /api/v1/habits
// @acess Private

const getHabits = async (req, res, next) => {
  const user = req.user.id;
  try {
    const result = await getAllHabits(user);
    res.status(200).json(result);
  } catch (error) {
    next();
  }
};

// @desc Set a habit
// @route POST /api/v1/habits
// @acess Private

const setHabit = async (req, res, next) => {
  const user = req.user.id;
  const {
    name,
    description,
    frequency,
    endDate,
    targetCount,
    currentCount,
    private,
  } = req.body;
  try {
    const result = await createOneHabit(
      user,
      name,
      description,
      frequency,
      endDate,
      targetCount,
      currentCount,
      private
    );
    res.status(201).json(result);
  } catch (error) {
    next();
  }
};

// @desc Update a habit
// @route PUT /api/v1/habits/:id
// @acess Private

const updateHabit = async (req, res, next) => {
  const habitId = req.params.id;
  const userId = req.user.id;
  const body = req.body;

  try {
    const result = await updateOneHabit(habitId, userId, body);
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    if (error.message === "habitNotFound") {
      next({ status: 404, message: "Habit not found" });
    } else if (error.messsage === "userNotFound") {
      next({ status: 404, message: "User not found" });
    } else if (error.message === "userUnauthorized") {
      next({ status: 401, message: "Habit doesn't belong to User" });
    } else {
      next();
    }
  }
};

// @desc Delete a habit
// @route DELETE /api/v1/habits/:id
// @acess Private

const deleteHabit = async (req, res, next) => {
  const habitId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await deleteOneHabit(habitId, userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "habitNotFound") {
      next({ status: 404, message: "Habit not found" });
    } else if (error.messsage === "userNotFound") {
      next({ status: 404, message: "User not found" });
    } else if (error.message === "userUnauthorized") {
      next({ status: 401, message: "Habit doesn't belong to User" });
    } else {
      next();
    }
  }
};

module.exports = {
  getHabits,
  setHabit,
  updateHabit,
  deleteHabit,
};
