const mongoose = require('mongoose');

async function connectDB() {
    try {
        console.log('MONGO_URI being used:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB connection success');
    } catch (err) {
        console.error(' Error in DB connection:', err);
        process.exit(1);
    }
};

module.exports = connectDB;

