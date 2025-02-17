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
exports.softDeleteTask = exports.updateTask = exports.createTask = exports.getTasksByProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTasksByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tasks.findMany({
        where: { project_id: projectId, d_flag: 0 },
        select: {
            project_id: true,
            task_id: true,
            task_desc: true,
            task_status: true,
        }
    });
});
exports.getTasksByProject = getTasksByProject;
const createTask = (task_desc, task_owner_id, project_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tasks.create({
        data: { task_desc, task_owner_id, project_id },
    });
});
exports.createTask = createTask;
const updateTask = (taskId, task_desc, task_status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tasks.update({
        where: { task_id: taskId },
        data: { task_desc, task_status },
    });
});
exports.updateTask = updateTask;
const softDeleteTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tasks.update({
        where: { task_id: taskId },
        data: { d_flag: 1 },
    });
});
exports.softDeleteTask = softDeleteTask;
