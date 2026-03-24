const mongoose = require('mongoose');

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
    
    
  } catch (error) {
    console.log('Error',error);
    
  }
}

module.exports = connectToDb;