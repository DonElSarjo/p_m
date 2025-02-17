import { PrismaClient } from '@prisma/client';
import { ProjectStatus } from '../types/projects.types';

const prisma = new PrismaClient();

export const getAllProjects = async () => {
    return await prisma.projects.findMany({ 
        where: { d_flag: 0 },
        select: {
            project_id: true,
            project_owner_id: true,
            project_desc: true,
            project_status: true,
        }
    });
};

export const createProject = async (project_desc: string, project_owner_id: number) => {
    return await prisma.projects.create({
        data: { project_desc, project_owner_id },
    });
};

export const getProjectById = async (projectId: number) => {
    return await prisma.projects.findUnique({
        where: { project_id: projectId, d_flag: 0 },
        select: {
            project_id: true,
            project_owner_id: true,
            project_desc: true,
            project_status: true,
        }
    });
};

export const updateProject = async (projectId: number, project_desc: string, project_status: ProjectStatus, project_owner_id: number) => {
    return await prisma.projects.update({
        where: { project_id: projectId, d_flag: 0 , project_owner_id: project_owner_id},
        data: { project_desc, project_status: project_status as ProjectStatus},
    });
};

export const softDeleteProject = async (projectId: number, project_owner_id: number) => {
    return await prisma.projects.update({
        where: { project_id: projectId , project_owner_id: project_owner_id},
        data: { d_flag: 1 },
    });
};
