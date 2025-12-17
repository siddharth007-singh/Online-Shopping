"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartControllers_1 = require("../controllers/cartControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/fetch-cart", authMiddleware_1.authenticateJwt, cartControllers_1.getCartItem);
router.post("/add-to-cart", authMiddleware_1.authenticateJwt, cartControllers_1.addToCart);
router.delete("/remove/:id", authMiddleware_1.authenticateJwt, cartControllers_1.removeFromCart);
router.put("/update/:id", authMiddleware_1.authenticateJwt, cartControllers_1.updateCartItemQuantity);
router.post("/clear-cart", authMiddleware_1.authenticateJwt, cartControllers_1.clearEntireCart);
exports.default = router;
