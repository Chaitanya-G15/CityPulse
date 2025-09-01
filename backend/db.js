// db.js
const mongoose = require('mongoose');
require("dotenv").config(); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Stop server if DB connection fails
  }
};

module.exports = connectDB;
