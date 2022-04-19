const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  creator: {
    type: String,
    required: [true, "creator is required"],
  },
  status: {
    type: String,
    default: "incomplete",
  },
  organisation: {
    type: String,
    required: [true, "organisation is required"],
  },
  dateCreated: {
    type: String,
    required: [true, "dateCreated is required"],
  },
  dateToComplete: {
    type: String,
    required: "date to complete is required",
  },
});

todoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

todoSchema.set("toJSON", {
  virtuals: true,
});

Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
