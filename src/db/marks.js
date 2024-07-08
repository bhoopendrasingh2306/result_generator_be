const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    hindi:Number,
    english:Number,
    math:Number,
    chemistry:Number,
    physics:Number,
    roll_no:Number,
    name:String,
    cgpa:Number,
    institute_name:String
});

module.exports = mongoose.model("marks",marksSchema);