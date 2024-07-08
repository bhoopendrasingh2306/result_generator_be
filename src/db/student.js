const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:String,
    roll_no:Number,
    email:String,
    address:String,
    institute_name:String,
    institute_code:Number,
    password:String,
    img_url:{
        require:false,
        type:String,
    },
});

module.exports = mongoose.model("student",studentSchema);