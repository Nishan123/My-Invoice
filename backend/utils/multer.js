const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const logger = require('./logger');
const { AppError } = require('../middlewares/ErrorHandler');

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Canonical mimetype -> extension map. The stored extension is ALWAYS derived
// from the validated mimetype, never from the client-supplied filename, so a
// file claiming to be an image can't be persisted with an executable extension
// (e.g. evil.html sent as image/png) and later served as active content.
const MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif']);

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeExt = MIME_TO_EXT[file.mimetype] || '.bin';
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, `${randomName}${safeExt}`);
    },
});

// Defence in depth: the declared mimetype AND the original extension must both
// be on the allowlist before the file is even written to disk.
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!MIME_TO_EXT[file.mimetype] || !ALLOWED_EXTENSIONS.has(ext)) {
        return cb(new AppError('Only JPG, PNG, and GIF images are allowed.', 400), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});

// Wrap multer.single so its errors become clean 400s instead of bubbling up as
// unhandled 500s. Handles size limits, rejected types, and unexpected fields.
const uploadSingle = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? 'Image must be 2MB or smaller.'
                : `Upload error: ${err.message}`;
            return next(new AppError(message, 400));
        }
        return next(err instanceof AppError ? err : new AppError(err.message, 400));
    });
};

// Delete an uploaded file by its public-relative path (e.g. "/uploads/abc.png").
// Guards against path traversal by confirming the resolved path stays inside the
// uploads directory before unlinking.
const deleteFile = (relativeFilePath) => {
    if (!relativeFilePath) return;
    const publicDir = path.join(__dirname, '..', 'public');
    const absolutePath = path.normalize(path.join(publicDir, relativeFilePath));
    if (!absolutePath.startsWith(uploadDir)) {
        logger.warn(`Refusing to delete file outside uploads dir: ${absolutePath}`);
        return;
    }
    fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            logger.error(`Error deleting file ${absolutePath}: ${err.message}`);
        }
    });
};

module.exports = { upload, uploadSingle, deleteFile };
