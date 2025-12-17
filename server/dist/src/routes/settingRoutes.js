"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsControllers_1 = require("../controllers/settingsControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
router.post("/banners", authMiddleware_1.authenticateJwt, authMiddleware_1.isSuperAdmin, uploadMiddleware_1.upload.array("images", 5), settingsControllers_1.addFeatureBanners);
router.get("/get-banners", authMiddleware_1.authenticateJwt, settingsControllers_1.getFeaturedBanner);
router.post("/update-feature-products", authMiddleware_1.authenticateJwt, authMiddleware_1.isSuperAdmin, settingsControllers_1.updateFeatureProducts);
router.get("/fetch-feature-products", authMiddleware_1.authenticateJwt, settingsControllers_1.getFetaureProducts);
exports.default = router;
