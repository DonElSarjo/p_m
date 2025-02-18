import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express';
import * as projectRepository from '../repository/projects.repository';
import { ProjectStatus } from '../types';

const prisma = new PrismaClient();

// Gets all projects
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectRepository.getAllProjects();
        if (!projects || projects.length === 0) {
            res.status(404).json({ error: 'No project found' })
        } else {
            res.status(200).json(projects)
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Projekte' });
    }
};

// Creates project
export const createProject = async (req: Request, res: Response) => {
    try {
        const { project_desc } = req.body;
        const { user_id } = req.user!
        const project = await projectRepository.createProject(project_desc, user_id) 
        if (project_desc.length < 4) {
            res.status(422).json({ error: 'To short description' });
        } else {
            res.status(201).json(project);
        }    
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // prject desc and owner not unique
            if (error.code === 'P2002') {
            res.status(403).json({message: 'Unique constraint failed', fields: error.meta})
            }
            console.log(error.code)
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

// Gets project by ID
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        const project = await projectRepository.getProjectById(parseInt(projectId))
        if (!project) {
            res.status(404).json({ error: 'No project found' })
        } else {
            res.json(project)
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Updates state/description of project by ID
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { projectId , projectStatus} = req.body;
        const { user_id} = req.user!

        const updatedProject = await projectRepository.updateProject(parseInt(projectId), projectStatus, user_id);
        res.json(updatedProject);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // no project
            if (error.code === 'P2002') {
            res.status(403).json({message: 'Unique constraint failed', fields: error.meta})
            }
            if (error.code === 'P2025') {
                res.status(404).json({message: "No such project for user"})
            }
        }
        // trigger for tasks still open for project
        else if (error instanceof Prisma.PrismaClientUnknownRequestError) {       
            res.status(403).json({message: "Project has open tasks"})
        }
        // so client gets any response
        else {
            res.status(500).json({message: error})
        }
    }
}

// Marks project as deleted by ID.
// Cascades deletion flag through tasks
export const softDeleteProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        const { user_id } = req.user!
        await projectRepository.softDeleteProject(parseInt(projectId), user_id)
        res.json({ message: 'Projekt als gelöscht markiert' });
    } catch (error) {
        res.status(403).json({ error: 'Error deleting project, does not exist or not owned by user' });
    }
};

export default { getAllProjects, createProject, getProjectById, updateProject, softDeleteProject };
