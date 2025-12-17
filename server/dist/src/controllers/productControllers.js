"use strict";
//create product
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchClientFilterProduct = exports.deleteProduct = exports.updateProducts = exports.getProductById = exports.fetchAllProductsForAdmin = exports.createProduct = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const server_1 = require("../server");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, brand, description, colors, sizes, gender, price, category, stock } = req.body;
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: "At least one image is required" });
            return;
        }
        //upload all images to cloudinary
        const uploadPromise = files.map(file => cloudinary_1.default.uploader.upload(file.path, {
            folder: "ecommerce"
        }));
        const uploadResults = yield Promise.all(uploadPromise);
        const imagesUrl = uploadResults.map(result => result.secure_url);
        const newlyCreatedProduct = yield server_1.prisma.product.create({
            data: {
                name,
                brand,
                category,
                description,
                gender,
                sizes: sizes.split(","),
                colors: colors.split(","),
                price: parseFloat(price),
                stock: parseInt(stock),
                soldCount: 0,
                rating: 0,
                images: imagesUrl,
            }
        });
        //after uploade image delete from local 
        files.forEach(file => {
            const fs = require("fs");
            fs.unlinkSync(file.path);
        });
        res.status(201).json({ success: true, newlyCreatedProduct });
    }
    catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.createProduct = createProduct;
const fetchAllProductsForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield server_1.prisma.product.findMany();
        res.status(200).json({ success: true, products });
    }
    catch (error) {
        console.error("Fetch all products error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.fetchAllProductsForAdmin = fetchAllProductsForAdmin;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield server_1.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            res.status(404).json({ success: false, error: "Product not found" });
            return;
        }
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        console.error("Get product by ID error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.getProductById = getProductById;
const updateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, brand, description, colors, sizes, gender, price, category, stock, images, soldCount, rating } = req.body;
        const files = req.files;
        let imagesUrl = undefined;
        if (files && files.length > 0) {
            //upload all images to cloudinary
            const uploadPromise = files.map(file => cloudinary_1.default.uploader.upload(file.path, {
                folder: "ecommerce"
            }));
            const uploadResults = yield Promise.all(uploadPromise);
            imagesUrl = uploadResults.map(result => result.secure_url);
        }
        const productToUpdate = yield server_1.prisma.product.findUnique({
            where: { id },
        });
        if (!productToUpdate) {
            res.status(404).json({ success: false, error: "Product not found" });
            return;
        }
        const updatedProduct = yield server_1.prisma.product.update({
            where: { id },
            data: {
                name,
                brand,
                description,
                colors: colors.split(","),
                sizes: sizes.split(","),
                gender,
                price: parseFloat(price),
                category,
                stock: parseInt(stock),
                images: imagesUrl ? imagesUrl : productToUpdate.images,
                soldCount: parseInt(soldCount),
                rating: parseInt(rating),
            }
        });
        //after uploade image delete from local
        if (files && files.length > 0) {
            files.forEach(file => {
                const fs = require("fs");
                fs.unlinkSync(file.path);
            });
        }
        res.status(200).json({ success: true, updatedProduct });
    }
    catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.updateProducts = updateProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productToDelete = yield server_1.prisma.product.findUnique({
            where: { id },
        });
        if (!productToDelete) {
            res.status(404).json({ success: false, error: "Product not found" });
            return;
        }
        yield server_1.prisma.product.delete({
            where: { id },
        });
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
const fetchClientFilterProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categories = (req.query.categories || "").split(",").filter(Boolean);
        const sizes = (req.query.sizes || "").split(",").filter(Boolean);
        const brands = (req.query.brands || "").split(",").filter(Boolean);
        const colors = (req.query.colors || "").split(",").filter(Boolean);
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const skip = (page - 1) * limit;
        // base where: price always applied
        const where = {
            price: { gte: minPrice, lte: maxPrice },
        };
        // Build OR conditions array (for categories OR brands)
        const orConditions = [];
        if (categories.length > 0) {
            // case-insensitive equals for each category
            orConditions.push(...categories.map(c => ({ category: { equals: c, mode: "insensitive" } })));
        }
        if (brands.length > 0) {
            // case-insensitive equals for each brand
            orConditions.push(...brands.map(b => ({ brand: { equals: b, mode: "insensitive" } })));
        }
        // If we have any OR conditions, combine them with other filters using AND
        // so price/colors/sizes are still applied.
        if (orConditions.length > 0) {
            where.AND = [{ OR: orConditions }];
        }
        // colors and sizes are array fields — keep hasSome (note: hasSome isn't case-insensitive)
        if (colors.length > 0) {
            where.colors = { hasSome: colors };
        }
        if (sizes.length > 0) {
            where.sizes = { hasSome: sizes };
        }
        console.log("Generated where:", JSON.stringify(where, null, 2));
        // fetch products + count
        const [products, totalProducts] = yield Promise.all([
            server_1.prisma.product.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            server_1.prisma.product.count({ where }),
        ]);
        // Send response (always successful 200 with products array even if empty)
        res.status(200).json({
            success: true,
            products,
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    }
    catch (error) {
        console.error("Fetch client filter products error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.fetchClientFilterProduct = fetchClientFilterProduct;
