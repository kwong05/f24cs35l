const dotenv = require('dotenv');
dotenv.config(); // To use .env file in backend

const config = {
    port: process.env.PORT || 10000,
    mongoUri: process.env.MONGO_URI,
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;