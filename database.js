// imports
const mongoose = require("mongoose");
const config = require("./config/config");

// connect database to mongo
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw new Error(`unable to connect to database: ${config.mongoUri}`);
  }
};

module.exports = connectDatabase;
