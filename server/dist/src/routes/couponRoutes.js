"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponControllers_1 = require("../controllers/couponControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateJwt);
router.post('/create-coupons', authMiddleware_1.isSuperAdmin, couponControllers_1.createCoupon);
router.get('/fetch-all-coupons', couponControllers_1.fetchAllCoupons);
router.delete('/:id', authMiddleware_1.isSuperAdmin, couponControllers_1.deleteCoupon);
exports.default = router;
