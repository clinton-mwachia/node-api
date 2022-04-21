/**
 * todo routes
 * http://localhost:4050/api/v1/todo
 */
const express = require("express");
const mongoose = require("mongoose");

const Todo = require("../models/todo");
const router = express.Router();

/**
 * add a todo
 */
router.post("/register", async (req, res) => {
  try {
    let todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      creator: req.body.creator,
      status: req.body.status,
      dateCreated: req.body.dateCreated,
      dateToComplete: req.body.dateToComplete,
      organisation: req.body.organisation,
    });
    const todoSave = await todo.save();
    if (!todoSave) {
      return res.status(400).json({ message: "cannot register todo" });
    } else {
      return res.send(todoSave);
    }
  } catch (error) {
    return res.status(500).json({ success: "fail", message: error.message });
  }
});

/**
 * get all the todo
 */
router.get("/", async (req, res) => {
  try {
    const todoList = await Todo.find();
    if (!todoList) {
      return res.status(404).json({ message: "No tasks found" });
    } else {
      return res.send(todoList);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/** get todo by id */
router.get(`/:id`, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(400).json({ message: "the todo does not exist" });
    } else {
      return res.send(todo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * delete a todo
 */
router.delete(`/:id`, async (req, res) => {
  const todo = await Todo.findByIdAndRemove(req.params.id);
  try {
    if (todo) {
      return res.status(200).json({ message: "todo deleted" });
    } else {
      return res.status(404).json({ message: "todo not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * update an existing todo
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "invalid id" });
  }
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  try {
    if (!todo) {
      return res.status(400).json({ message: "todo cannot be updated" });
    } else {
      return res.send(todo);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * get a todo by organisation
 * http://localhost:4000/api/v1/todo/get/organisation?org=test
 */
router.get(`/get/organisation`, async (req, res) => {
  try {
    const todo = await Todo.find({ organisation: req.query.org });
    if (!todo) {
      return res.status(404).json({ message: "todo does not exist" });
    } else {
      return res.send(todo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * get a todo by creator
 * http://localhost:4000/api/v1/todo/get/creator?user=clinton
 */
router.get(`/get/creator`, async (req, res) => {
  try {
    const todo = await Todo.find({ creator: req.query.user });
    if (!todo) {
      return res.status(404).json({ message: "todo does not exist" });
    } else {
      return res.send(todo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * get a todo by organisation and status
 * http://localhost:4000/api/v1/todo/get/organisation/:org/status/:status
 */
router.get(`/get/organisation/:org/status/:status`, async (req, res) => {
  try {
    const todo = await Todo.find({
      organisation: req.params.org,
      status: req.params.status,
    });
    if (!todo) {
      return res.status(404).json({ message: "todo does not exist" });
    } else {
      return res.send(todo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * count all the tasks
 */
router.get(`/get/count`, async (req, res) => {
  const todocount = await Todo.countDocuments();

  if (!todocount) {
    return res.send({ TotalTodos: 0 });
  } else {
    return res.send({ TotalTodos: todocount });
  }
});

/**
 * count todos by organisation
 * http://localhost:4040/api/v1/user/get/count/organisation?org=test
 */
router.get(`/get/count/organisation`, async (req, res) => {
  const todocount = await Todo.find({
    organisation: req.query.org,
  }).countDocuments();

  if (!todocount) {
    return res.send({ TotalTodos: 0 });
  } else {
    return res.send({ TotalTodos: todocount });
  }
});

/**
 * count todos by creator
 * http://localhost:4040/api/v1/user/get/count/creator?user=test
 */
router.get(`/get/count/creator`, async (req, res) => {
  const todocount = await Todo.find({
    creator: req.query.user,
  }).countDocuments();

  if (!todocount) {
    return res.send({ TotalTodos: 0 });
  } else {
    return res.send({ TotalTodos: todocount });
  }
});

module.exports = router;
