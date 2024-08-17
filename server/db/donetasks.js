const mongoose = require("mongoose");

const doneTaskSchema = new mongoose.Schema({
  task: String,
});

module.exports = mongoose.model("donetasks", doneTaskSchema);
