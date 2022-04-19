/**
 * todo routes
 * http://localhost:4000/api/v1/todo
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

module.exports = router;
