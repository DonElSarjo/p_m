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
        const project = await prisma.projects.create({
            data: { project_desc, project_owner_id }
        });     
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

        // Check for correct user id
       

        // Update if all went well
        const updatedProject = await projectRepository.updateProject(parseInt(id), project_desc, project_status);
        res.json(updatedProject);
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Projekts:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Projekts' });
    }
}

// Marks project as deleted by ID.
// Error message, if open tasks for project ID
const softDeleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.projects.update({
            where: { project_id: parseInt(id) },
            data: { d_flag: 1 }
        });
        res.json({ message: 'Projekt als gelöscht markiert' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen des Projekts' });
    }
};

export default { getAllProjects, createProject, getProjectById, updateProject, softDeleteProject };
