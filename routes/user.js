/**
 * users routes
 * http://localhost:4050/api/v1/user
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");

/**
 * register a user
 */
router.post("/signup", async (req, res) => {
  try {
    let user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role,
      organisation: req.body.organisation,
    });
    const userSave = await user.save();
    if (!userSave) {
      return res.status(400).json({ message: "cannot signup user" });
    } else {
      return res.send(userSave);
    }
  } catch (error) {
    return res.status(500).json({ success: "fail", message: error.message });
  }
});

/** get all the users */
router.get("/", async (req, res) => {
  try {
    const userList = await User.find();
    if (!userList) {
      return res.status(404).json({ message: "No users found" });
    } else {
      return res.send(userList);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/** get user by id */
router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "the user does not exist" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * get a user by role
 * http://localhost:4050/api/v1/user/get/role?access=admin
 */
router.get(`/get/role`, async (req, res) => {
  try {
    const user = await User.find({ role: req.query.access });
    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * delete a user
 */
router.delete(`/:id`, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  try {
    if (user) {
      return res.status(200).json({ message: "user deleted" });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * update an existing user
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "invalid id" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  try {
    if (!user) {
      return res.status(400).json({ message: "user cannot be updated" });
    } else {
      return res.send(user);
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * count all the users
 */
router.get(`/get/count`, async (req, res) => {
  const usercount = await User.countDocuments();

  if (!usercount) {
    return res.send({ TotalUsers: 0 });
  } else {
    return res.send({ TotalUsers: usercount });
  }
});

/**
 * count users by role
 * http://localhost:4050/api/v1/user/get/count/role?role=admin
 */
router.get(`/get/count/role`, async (req, res) => {
  const usercount = await User.find({
    role: req.query.role,
  }).countDocuments();

  if (!usercount) {
    return res.send({ TotalUsers: 0 });
  } else {
    return res.send({ TotalUsers: usercount });
  }
});

/**
 * user log in
 */
router.post(`/login`, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const secret = process.env.secret;

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ userid: user.id }, secret, {
          expiresIn: "1d",
        });
        return res.status(200).json({
          userid: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          organisation: user.organisation,
          token: token,
        });
      } else {
        return res.status(400).json({ message: "password/email is incorrect" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
