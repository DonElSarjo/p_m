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
exports.softDeleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getAllProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.projects.findMany({
        where: { d_flag: 0 },
        select: {
            project_id: true,
            project_owner_id: true,
            project_desc: true,
            project_status: true,
        }
    });
});
exports.getAllProjects = getAllProjects;
const createProject = (project_desc, project_owner_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.projects.create({
        data: { project_desc, project_owner_id },
    });
});
exports.createProject = createProject;
const getProjectById = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.projects.findUnique({
        where: { project_id: projectId, d_flag: 0 },
        select: {
            project_id: true,
            project_owner_id: true,
            project_desc: true,
            project_status: true,
        }
    });
});
exports.getProjectById = getProjectById;
const updateProject = (projectId, project_desc, project_status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.projects.update({
        where: { project_id: projectId, d_flag: 0 },
        data: { project_desc, project_status: project_status },
    });
});
exports.updateProject = updateProject;
const softDeleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.projects.update({
        where: { project_id: projectId },
        data: { d_flag: 1 },
    });
});
exports.softDeleteProject = softDeleteProject;
