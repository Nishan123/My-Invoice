const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Write synchronously to stderr. Logging through pino here queues a record
        // in the async transport worker; if a transport (pino-mongodb) can't drain,
        // process.exit() trips thread-stream's flushSync and throws
        // "_flushSync took too long (10s)", which masks the real connection error.
        console.error(`[db] MongoDB connection failed: ${error.message}`);
        if (typeof logger.flush === 'function') logger.flush();
        setImmediate(() => process.exit(1));
    }
};
module.exports = connectDB;