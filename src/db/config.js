// const path = require('path');
// require("dotenv").config({ path: path.resolve(".env") });
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/result_generator_db');
// mongoose.connect(`mongodb+srv://bhoopendrasingh2306:bhoopendra@workmanagement.6gzxm1u.mongodb.net/?retryWrites=true&w=majority&appName=workmanagement`);
// const uri =process.env.CONNECTION_URI;
mongoose.connect(process.env.CONNECTION_URI) ;
mongoose.connection.once('open', () => {
    console.log('mongodb connected successfully',);
});