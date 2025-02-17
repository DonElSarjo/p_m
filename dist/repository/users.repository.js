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
exports.softDeleteUser = exports.createUser = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.users.findMany({
        where: { d_flag: 0 },
        select: {
            user_id: true,
            username: true,
            email: true
        }
    });
});
exports.getAllUsers = getAllUsers;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.users.create({
        data: userData,
    });
});
exports.createUser = createUser;
const softDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.users.update({
        where: { user_id: userId },
        data: { d_flag: 1 },
    });
});
exports.softDeleteUser = softDeleteUser;
