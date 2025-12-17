"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("../controllers/productControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
router.post('/create-new-product', authMiddleware_1.authenticateJwt, authMiddleware_1.isSuperAdmin, uploadMiddleware_1.upload.array('images', 5), productControllers_1.createProduct);
router.get('/fetch-admin-products', productControllers_1.fetchAllProductsForAdmin);
router.get("/fetch-client-products", productControllers_1.fetchClientFilterProduct);
router.delete('/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.isSuperAdmin, productControllers_1.deleteProduct);
router.get('/:id', productControllers_1.getProductById);
router.put('/:id', authMiddleware_1.authenticateJwt, authMiddleware_1.isSuperAdmin, uploadMiddleware_1.upload.array('images', 5), productControllers_1.updateProducts);
exports.default = router;
