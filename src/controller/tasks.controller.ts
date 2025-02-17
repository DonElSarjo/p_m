import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express';
import * as taskRepository from '../repository/tasks.repository';
import { NewTask } from '../types/tasks.types';

const prisma = new PrismaClient();

// Gets all tasks of a given project ID
const getTasksByProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const tasks = await taskRepository.getTasksByProject(parseInt(projectId))
        if (!tasks) {
            res.status(404).json({ error: 'No task for ID' })
        } else {
            res.status(201).json(tasks)
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Aufgaben' });
    }
};

// Created new task for given project ID
const createTask = async (req: Request, res: Response) => {
    try {
        const { task_desc, project_id } = req.body;
        const { user_id, username, email } = req.user!
        const task = await taskRepository.createTask(task_desc, user_id, parseInt(project_id))
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // task_desc, project_id, task_owner not unique
            if (error.code === 'P2002') {
            res.status(403).json({message: 'Unique constraint failed', fields: error.meta})
            }
            console.log(error.code)
        }
        // trigger for poject and task ownership fired
        else if (error instanceof Prisma.PrismaClientUnknownRequestError) {       
            res.status(403).json({message: error.message})
        }
        // so client gets any response
        else {
            res.status(500).json({message: error})
        }
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
        await taskRepository.softDeleteTask(parseInt(taskId))
        res.json({ message: 'Aufgabe als gelöscht markiert' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen der Aufgabe' });
    }
};

export default { getTasksByProject, createTask, updateTask, softDeleteTask };