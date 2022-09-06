const express = require("express");

const {
  getAllHabits,
  createOneHabit,
  updateOneHabit,
  deleteOneHabit,
  getOneHabit,
  getAllPublicHabits,
  likeOneHabit,
  unlikeOneHabit,
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

// @desc Get all public habits in habithobbit
// @route GET /api/v1/habits/public
// @acess Private

const getPublicHabits = async (req, res, next) => {
  const user = req.user.id;
  try {
    const result = await getAllPublicHabits(user);
    res.status(200).json(result);
  } catch (error) {
    next();
  }
};

// @desc Get One habits of a user
// @route GET /api/v1/habits/:id
// @acess Private
const getHabit = async (req, res, next) => {
  const userId = req.user.id;
  const habitId = req.params.id;
  try {
    const result = await getOneHabit(userId, habitId);
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

// @desc Like a habit
// @route PUT /api/v1/habits/:id/like
// @acess Private

const likeHabit = async (req, res, next) => {
  const userId = req.user.id;

  const habitId = req.params.id;

  try {
    const result = await likeOneHabit(userId, habitId);
    res.status(200).send(result);
  } catch (error) {
    if (error.message === "habitNotFound") {
      next({ status: 404, message: "Habit not found" });
    } else if (error.message === "userNotFound") {
      next({ status: 404, message: "User not found" });
    } else if (error.message === "userExistsInLikes") {
      next({ status: 400, message: "User has liked the habit" });
    } else {
      next();
    }
  }
};

// @desc Unlike a habit
// @route PUT /api/v1/habits/:id/unlike
// @acess Private

const unlikeHabit = async (req, res, next) => {
  const userId = req.user.id;
  const habitId = req.params.id;

  try {
    const result = await unlikeOneHabit(userId, habitId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "habitNotFound") {
      next({ status: 404, message: "Habit not found" });
    } else if (error.message === "userNotFound") {
      next({ status: 404, message: "User not found" });
    } else if (error.message === "userNotFoundInLikes") {
      next({ status: 400, message: "User has not liked the habit yet" });
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
  getHabit,
  getPublicHabits,
  likeHabit,
  unlikeHabit,
};
