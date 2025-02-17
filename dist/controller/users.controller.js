"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const client_1 = require("@prisma/client");
const userRepository = __importStar(require("../repository/users.repository"));
const prisma = new client_1.PrismaClient();
// Gets all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userRepository.getAllUsers();
        if (!users) {
            res.status(404).json({ error: 'No user in database' });
        }
        else {
            res.status(201).json(users);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
// Creates a user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const user = yield userRepository.createUser(userData);
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            // duplicate entry
            if (error.code === 'P2002') {
                res.status(403).json({ message: 'Unique constraint failed', fields: error.meta });
            }
            console.log(error.code);
        }
        // CC__ constrains failed invalid username or email
        else if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
            res.status(403).json({ message: error.message });
        }
        // so client gets any response
        else {
            res.status(500).json({ message: error });
        }
    }
});
// Marks user as deleted by ID
// Error message if open projects or tasks
const softDeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.users.update({
            where: { user_id: parseInt(id) },
            data: { d_flag: 1 }
        });
        res.json({ message: 'Benutzer als gelöscht markiert' });
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen des Benutzers' });
    }
});
exports.default = { getAllUsers, createUser, softDeleteUser };
