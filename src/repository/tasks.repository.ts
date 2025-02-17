import { PrismaClient } from '@prisma/client';
import { TaskStatus } from '../types/tasks.types';

const prisma = new PrismaClient();

export const getTasksByProject = async (projectId: number) => {
    return await prisma.tasks.findMany({ where: { project_id: projectId, d_flag: 0 } });
};

export const createTask = async (task_desc: string, task_owner_id: number, project_id: number) => {
    return await prisma.tasks.create({
        data: { task_desc, task_owner_id, project_id },
    });
};

export const updateTask = async (taskId: number, task_desc: string, task_status: TaskStatus) => {
    return await prisma.tasks.update({
        where: { task_id: taskId },
        data: { task_desc, task_status },
    });
};

export const softDeleteTask = async (taskId: number) => {
    return await prisma.tasks.update({
        where: { task_id: taskId },
        data: { d_flag: 1 },
    });
};
