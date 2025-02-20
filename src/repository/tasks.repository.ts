import { PrismaClient } from '@prisma/client';
import { TaskStatus } from '../types/tasks.types';

const prisma = new PrismaClient();

export const getTasksByProject = async (projectId: number) => {
    return await prisma.tasks.findMany({ 
        where: { project_id: projectId, d_flag: 0 },
        select: {
            project_id: true,
            task_id: true,
            task_desc: true,
            task_status: true,
        }
    });
};

export const createTask = async (task_desc: string, task_owner_id: number, project_id: number) => {
    return await prisma.tasks.create({
        data: { task_desc, task_owner_id, project_id },
    });
};

export const updateTask = async (taskId: number, taskStatus: TaskStatus, userId: number) => {
    return await prisma.tasks.update({
        where: { task_id: taskId , task_owner_id: userId},
        data: { task_status: taskStatus },
    });
};

export const softDeleteTask = async (taskId: number , userId: number) => {
    return await prisma.tasks.update({
        where: { task_id: taskId, task_owner_id: userId },
        data: { d_flag: 1 },
    });
};
