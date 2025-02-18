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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDatabase = resetDatabase;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function executeSQLFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = fs_1.default.readFileSync(filePath, 'utf8');
        yield prisma.$executeRawUnsafe(sql);
    });
}
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Resetting database...');
            // Drop and recreate the schema
            yield executeSQLFile(path_1.default.join(__dirname, '../db/script1.sql'));
            // Insert test data
            yield executeSQLFile(path_1.default.join(__dirname, '../db/script2.sql'));
            console.log('Database reset complete.');
        }
        catch (error) {
            console.error('Error resetting database:', error);
        }
    });
}
