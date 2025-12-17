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
exports.deleteAddress = exports.updateAddress = exports.getAddresses = exports.createAddress = void 0;
const server_1 = require("../server");
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { name, address, city, country, postalCode, phone, isDefault } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (isDefault) {
            //set all other addresses to isDefault false || baceause at once time only one address can be default
            yield server_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        const newAddress = yield server_1.prisma.address.create({
            data: {
                userId,
                name,
                address,
                city,
                country,
                postalCode,
                phone,
                isDefault: isDefault || false
            }
        });
        res.status(201).json({ success: true, message: "Address created successfully", address: newAddress });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to create address", error });
    }
});
exports.createAddress = createAddress;
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const address = yield server_1.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, address });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get addresses", error });
    }
});
exports.getAddresses = getAddresses;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { addressId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existingAddress = yield server_1.prisma.address.findUnique({
            where: { id: addressId }
        });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found" });
        }
        const { name, address, city, country, postalCode, phone, isDefault } = req.body;
        if (isDefault) {
            //set all other addresses to isDefault false || baceause at once time only one address can be default
            yield server_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        const updatedAddress = yield server_1.prisma.address.update({
            where: { id: addressId },
            data: {
                name,
                address,
                city,
                country,
                postalCode,
                phone,
                isDefault: isDefault || false
            }
        });
        res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update address", error });
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { addressId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existingAddress = yield server_1.prisma.address.findUnique({
            where: { id: addressId }
        });
        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found" });
        }
        yield server_1.prisma.address.delete({
            where: { id: addressId }
        });
        res.status(200).json({ message: "Address deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete address", error });
    }
});
exports.deleteAddress = deleteAddress;
