"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressControllers_1 = require("../controllers/addressControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/add-address", authMiddleware_1.authenticateJwt, addressControllers_1.createAddress);
router.get("/get-address", authMiddleware_1.authenticateJwt, addressControllers_1.getAddresses);
router.delete("/delete-address/:id", authMiddleware_1.authenticateJwt, addressControllers_1.deleteAddress);
router.put("/update-address/:id", authMiddleware_1.authenticateJwt, addressControllers_1.updateAddress);
exports.default = router;
