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
exports.isSuperAdmin = exports.authenticateJwt = void 0;
const jose_1 = require("jose");
const authenticateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res
            .status(401)
            .json({ success: false, error: "Access token not found" });
    }
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(accessToken, new TextEncoder().encode(process.env.JWT_SECRET));
        const typedPayload = payload;
        req.user = {
            userId: typedPayload.userId,
            email: typedPayload.email,
            role: typedPayload.role,
        };
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        return res
            .status(401)
            .json({ success: false, error: "Invalid or expired access token" });
    }
});
exports.authenticateJwt = authenticateJwt;
const isSuperAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "superadmin") {
        next();
    }
    else {
        return res
            .status(403)
            .json({ success: false, error: "Access denied" });
    }
};
exports.isSuperAdmin = isSuperAdmin;
