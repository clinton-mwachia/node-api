const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "firstname is required"],
  },
  lastname: {
    type: String,
    required: [true, "lastname is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    index: { unique: true, dropDups: true },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: [/.+\@.+\..+/, "invalid email"],
    index: { unique: true, dropDups: true },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    index: { unique: true, dropDups: true },
  },
  role: {
    type: String,
    required: [true, "role is required"],
  },
  organisation: {
    type: String,
    required: [true, "organisation is required"],
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

User = mongoose.model("users", userSchema);

module.exports = User;
