import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as userRepository from '../repository/tasks.repository';
import { NewTask } from '../types/tasks.types';

const prisma = new PrismaClient();

// Gets all tasks of a given project ID
const getTasksByProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const tasks = await prisma.tasks.findMany({
            where: { project_id: parseInt(projectId), d_flag: 0 }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Aufgaben' });
    }
};

// Created new task for given project ID
const createTask = async (req: Request, res: Response) => {
    try {
        const newTask: NewTask = req.body;
        const task = await prisma.tasks.create({
            data: newTask
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen der Aufgabe' });
    }
};

// Updates Task
// Cascades to project if not started by trigger
const updateTask = async (req: Request, res: Response) => {
    try {
        const { projectId, taskId } = req.params;
        const { task_desc, task_status } = req.body;
        const task = await prisma.tasks.update({
            where: { task_id: parseInt(taskId), project_id: parseInt(projectId) },
            data: { task_desc, task_status }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren der Aufgabe' });
    }
};

// Marks task as deleted by ID
const softDeleteTask = async (req: Request, res: Response) => {
    try {
        const { projectId, taskId } = req.params;
        await prisma.tasks.update({
            where: { task_id: parseInt(taskId), project_id: parseInt(projectId) },
            data: { d_flag: 1 }
        });
        res.json({ message: 'Aufgabe als gelöscht markiert' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen der Aufgabe' });
    }
};

export default { getTasksByProject, createTask, updateTask, softDeleteTask };