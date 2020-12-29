const mongoose = require('mongoose');
const config = require("./config/config");

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        throw new Error(`unable to connect to database: ${config.mongoUri}`);
    }
};

module.exports = connectDatabase;