
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://bhoopendrasingh2306:bhoopendra@cluster0.cng1qah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
mongoose.connection.once('open', () => {
    console.log('mongodb connected successfully',);
});