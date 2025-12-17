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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.fetchAllCoupons = exports.createCoupon = void 0;
const server_1 = require("../server");
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, discountPercentage, startDate, endDate, usageLimit } = req.body;
        const newCoupon = yield server_1.prisma.coupon.create({
            data: {
                code,
                discountPercentage: parseInt(discountPercentage, 10),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                usageLimit: parseInt(usageLimit, 10),
                usageCount: 0
            }
        });
        res.status(201).json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
    }
    catch (error) {
        console.error("Create coupon error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.createCoupon = createCoupon;
const fetchAllCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield server_1.prisma.coupon.findMany({
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json({ success: true, couponList: coupons });
    }
    catch (error) {
        console.error("Fetch all coupons error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.fetchAllCoupons = fetchAllCoupons;
const deleteCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield server_1.prisma.coupon.delete({
            where: { id }
        });
        res.status(200).json({ success: true, message: "Coupon deleted successfully", id });
    }
    catch (error) {
        console.error("Delete coupon error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.deleteCoupon = deleteCoupon;
