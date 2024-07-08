const mongoose = require("mongoose");

const contectSchema = new mongoose.Schema({
    name:String,
    email:String,
    description:String
});

module.exports = mongoose.model("contect",contectSchema);