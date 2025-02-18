import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express';
import * as taskRepository from '../repository/tasks.repository';
import { NewTask } from '../types/tasks.types';

const prisma = new PrismaClient();

// Gets all tasks of a given project ID
const getTasksByProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        const tasks = await taskRepository.getTasksByProject(parseInt(projectId))
        if (!tasks || tasks.length === 0) {
            res.status(404).json({ error: 'No task for ID' })
        } else {
            res.status(200).json(tasks)
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Created new task for given project ID
const createTask = async (req: Request, res: Response) => {
    try {
        const { task_desc, project_id } = req.body;
        const { user_id } = req.user!
        const task = await taskRepository.createTask(task_desc, user_id, parseInt(project_id))
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // task_desc, project_id, task_owner not unique
            if (error.code === 'P2002') {
            res.status(403).json({message: 'Unique constraint failed', fields: error.meta})
            }
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
// Cascades to project status if not started
// Only updates with user_id
const updateTask = async (req: Request, res: Response) => {
    try {
        const { taskId, taskStatus } = req.body;
        const { user_id } = req.user!
        const task = await taskRepository.updateTask(parseInt(taskId), taskStatus, user_id)
        res.json(task);
    } catch (error) {
        res.status(403).json({ error: "Insufficent rights"});
    }
};

// Marks task as deleted by ID
const softDeleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.body;
        const { user_id } = req.user!
        await taskRepository.softDeleteTask(parseInt(taskId), user_id)
        res.json({ message: "Task was marked deleted" });
    } catch (error) {
        res.status(403).json({ error: 'Insufficent right' });
    }
};

export default { getTasksByProject, createTask, updateTask, softDeleteTask };