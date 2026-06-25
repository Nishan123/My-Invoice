const Product = require('../models/product');
const { AppError } = require('../middlewares/ErrorHandler');
const { z } = require('zod');
const { uploadSingle, deleteFile } = require('../utils/multer');

// Validation schemas
const productSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string(),
    price: z.coerce.number().positive(),
    quantity: z.coerce.number().int().min(0),
    category: z.enum(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other']),
    imageUrl: z.string().url().optional()
});

// Create Product
exports.createProduct = [
    uploadSingle('productImage'),
    async (req, res, next) => {
        try {
            // Multipart fields arrive as strings; the schema coerces price/quantity.
            const validatedData = productSchema.parse(req.body);
            if (req.file) {
                validatedData.imageUrl = `/uploads/${req.file.filename}`;
            }
            const product = await Product.create({ ...validatedData, user: req.user._id });
            res.status(201).json({
                status: 'success',
                data: product
            });
        } catch (error) {
            // Don't leave the just-uploaded file orphaned if validation/save fails.
            if (req.file) deleteFile(`/uploads/${req.file.filename}`);
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
];

// Get All Products with Pagination
exports.getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = Product.find({ user: req.user._id })
            .skip(skip)
            .limit(limit)
            .sort('-createdAt');

        const [products, total] = await Promise.all([
            query.exec(),
            Product.countDocuments({ user: req.user._id })
        ]);

        res.status(200).json({
            status: 'success',
            results: products.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Product (scoped to the owner)
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return next(new AppError('Product not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Update Product (scoped to the owner)
exports.updateProduct = [
    uploadSingle('productImage'),
    async (req, res, next) => {
        try {
            const validatedData = productSchema.partial().parse(req.body);

            const existing = await Product.findOne({ _id: req.params.id, user: req.user._id });
            if (!existing) {
                if (req.file) deleteFile(`/uploads/${req.file.filename}`);
                return next(new AppError('Product not found', 404));
            }

            const previousImageUrl = existing.imageUrl;
            if (req.file) {
                validatedData.imageUrl = `/uploads/${req.file.filename}`;
            }

            const product = await Product.findOneAndUpdate(
                { _id: req.params.id, user: req.user._id },
                validatedData,
                { new: true, runValidators: true }
            );

            // Remove the previous image only after a successful replacement.
            if (req.file && previousImageUrl && previousImageUrl !== product.imageUrl) {
                deleteFile(previousImageUrl);
            }

            res.status(200).json({
                status: 'success',
                data: product
            });
        } catch (error) {
            if (req.file) deleteFile(`/uploads/${req.file.filename}`);
            if (error instanceof z.ZodError) {
                return next(new AppError(error.errors[0].message, 400));
            }
            next(error);
        }
    }
];

// Delete Product (scoped to the owner)
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Delete the image file if it exists
        if (product.imageUrl) {
            deleteFile(product.imageUrl);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Search Products (scoped to the owner)
exports.searchProducts = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query || !query.trim()) {
            return next(new AppError('Search query is required', 400));
        }
        // Escape regex metacharacters so user input can't inject a pattern (ReDoS).
        const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const products = await Product.find({
            user: req.user._id,
            $or: [
                { name: { $regex: safe, $options: 'i' } },
                { description: { $regex: safe, $options: 'i' } },
                { category: { $regex: safe, $options: 'i' } }
            ]
        });

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};
