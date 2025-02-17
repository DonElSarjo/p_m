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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Gets all tasks of a given project ID
const getTasksByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const tasks = yield prisma.tasks.findMany({
            where: { project_id: parseInt(projectId), d_flag: 0 }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Aufgaben' });
    }
});
// Created new task for given project ID
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTask = req.body;
        const task = yield prisma.tasks.create({
            data: newTask
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen der Aufgabe' });
    }
});
// Updates Task
// Cascades to project if not started by trigger
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, taskId } = req.params;
        const { task_desc, task_status } = req.body;
        const task = yield prisma.tasks.update({
            where: { task_id: parseInt(taskId), project_id: parseInt(projectId) },
            data: { task_desc, task_status }
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren der Aufgabe' });
    }
});
// Marks task as deleted by ID
const softDeleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, taskId } = req.params;
        yield prisma.tasks.update({
            where: { task_id: parseInt(taskId), project_id: parseInt(projectId) },
            data: { d_flag: 1 }
        });
        res.json({ message: 'Aufgabe als gelöscht markiert' });
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen der Aufgabe' });
    }
});
exports.default = { getTasksByProject, createTask, updateTask, softDeleteTask };
