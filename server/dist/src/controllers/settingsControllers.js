"use strict";
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
exports.getFetaureProducts = exports.updateFeatureProducts = exports.getFeaturedBanner = exports.addFeatureBanners = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const server_1 = require("../server");
const fs_1 = __importDefault(require("fs"));
const addFeatureBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: "No files uploaded" });
            return;
        }
        const uploadeFiles = files.map(file => cloudinary_1.default.uploader.upload(file.path, {
            folder: "ecommerce-featureBanners"
        }));
        const uploadResults = yield Promise.all(uploadeFiles);
        const banners = yield Promise.all(uploadResults.map(res => server_1.prisma.featureBanner.create({
            data: {
                imageUrl: res.secure_url,
            }
        })));
        files.forEach(file => fs_1.default.unlinkSync(file.path));
        res.status(201).json({ message: "Feature banners added successfully", banners });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add feature banners" });
        console.error("Error adding feature banners:", error);
    }
});
exports.addFeatureBanners = addFeatureBanners;
const getFeaturedBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchBanner = yield server_1.prisma.featureBanner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ message: "Featured banners fetched successfully", banners: fetchBanner });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get featured banner" });
        console.error("Error getting featured banner:", error);
    }
});
exports.getFeaturedBanner = getFeaturedBanner;
const updateFeatureProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        if (!productId || !Array.isArray(productId) || productId.length > 8) {
            res.status(400).json({ success: false, message: "Invalid product IDs. Ensure it's an array with up to 8 items." });
            return;
        }
        yield server_1.prisma.$transaction([
            server_1.prisma.product.updateMany({ data: { isFeatured: false } }), //Sare ko phle false kiya 
            server_1.prisma.product.updateMany({
                where: { id: { in: productId } },
                data: { isFeatured: true },
            }),
        ]);
        res.status(200).json({ success: true, message: "Feature products updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update feature products" });
        console.error("Error updating feature products:", error);
    }
});
exports.updateFeatureProducts = updateFeatureProducts;
const getFetaureProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featureProducts = yield server_1.prisma.product.findMany({
            where: { isFeatured: true },
        });
        res.status(200).json({ success: true, message: "Feature products fetched successfully", products: featureProducts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get feature products" });
        console.error("Error getting feature products:", error);
    }
});
exports.getFetaureProducts = getFetaureProducts;
