import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as projectRepository from '../repository/projects.repository';
import { ProjectStatus } from '../types';

const prisma = new PrismaClient();

// Gets all projects
const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectRepository.getAllProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Projekte' });
    }
};

// Creates project
const createProject = async (req: Request, res: Response) => {
    try {
        const { project_desc, project_owner_id } = req.body;
        const project = await projectRepository.createProject(project_desc, parseInt(project_owner_id))     
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Projekts' });
    }
};

// Gets project by ID
const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await projectRepository.getProjectById(parseInt(id))
        if (!project) {
            res.status(404).json({ error: 'No project found' })
        } else {
            res.json(project)
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Projekts' });
    }
};

// Updates state/description of project by ID
const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { project_desc, project_status } = req.body;
        const { user_id, username, email } = req.user!

        const updatedProject = await projectRepository.updateProject(parseInt(id), project_desc, project_status, user_id);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Projekts' });
    }
}

// Marks project as deleted by ID.
// Cascades deletion flag through tasks
const softDeleteProject = async (req: Request, res: Response) => {
    try {
        const { project_id } = req.params;
        const { user_id, username, email } = req.user!
        await projectRepository.softDeleteProject(parseInt(project_id), user_id)
        res.json({ message: 'Projekt als gelöscht markiert' });
    } catch (error) {
        res.status(403).json({ error: 'Error deleting project, does not exist or not owned by user' });
    }
};

export default { getAllProjects, createProject, getProjectById, updateProject, softDeleteProject };
