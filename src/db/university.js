const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({

    institute_name:String,
    institute_email:String,
    institute_address:String,
    institute_code:Number,
    password:String,
    
});

module.exports = mongoose.model("university",universitySchema);