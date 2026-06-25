// logger.js
const pino = require('pino');

// Only persist logs to MongoDB when a connection string is actually configured.
const MONGODB_URI = process.env.MONGODB_URI;

const targets = [];

// MongoDB transport — guarded so a missing or unreachable Mongo can't leave the
// async transport worker unable to drain, which crashes the process on exit.
if (MONGODB_URI) {
    targets.push({
        target: 'pino-mongodb',
        options: {
            uri: MONGODB_URI,
            collection: 'logs',
            timestamp: true
        }
    });
}

// Pretty console output outside production.
if (process.env.NODE_ENV !== 'production') {
    targets.push({
        target: 'pino-pretty',
        options: { colorize: true }
    });
}

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(targets.length ? { transport: { targets } } : {}),
    redact: {
        paths: ['password', 'secret', 'token', 'user.password', 'user.firstName', 'user.lastName', 'user.businessInfo.name', 'user.businessInfo.address', 'user.businessInfo.city', 'user.businessInfo.country', 'user.businessInfo.phone', 'user.businessInfo.email', 'cookie'],
        censor: '**REDACTED**'
    },
});

module.exports = logger;
