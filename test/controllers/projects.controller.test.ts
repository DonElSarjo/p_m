import request from 'supertest';
import express from 'express';
import { getAllProjects, createProject, getProjectById, updateProject, softDeleteProject } from '@/controller/projects.controller';
import * as projectRepository from '@/repository/projects.repository';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/projects/list', getAllProjects);
app.post('/projects/create', createProject);

jest.mock('@/repository/projects.repository', () => {
  return {
    getAllProjects: jest.fn(),
    createProject: jest.fn()
  };
});
describe('GET /projects/list', () => {
    it('should return all projects from the database', async () => {
        const projectsInDB = await prisma.projects.findMany({
            where: { d_flag: 0 },
            select: {
              project_id: true,
              project_owner_id: true,
              project_desc: true,
              project_status: true
            }
        });

        (projectRepository.getAllProjects as jest.Mock).mockResolvedValue(projectsInDB);

        const response = await request(app).get('/projects/list').expect(200);

        expect(response.body).toEqual(projectsInDB);
    });
});

//describe('POST /projects/create', () => {
//  beforeEach(() => {
//      jest.clearAllMocks();
//  });
//
//  it('should create a project successfully', async () => {
//    const projectData = { project_desc: 'w0000v' };
//    const mockProject = { project_id: 21, project_desc: 'w0000v', project_owner_id: 2 };
//    (projectRepository.createProject as jest.Mock).mockResolvedValue(mockProject);
//
//    const response = await request(app)
//        .post('/projects/create')
//        .set({
//            'user-info': JSON.stringify({ user_id: 2, username: 'alice_dev', email: 'alice@example.com' }),
//            'content-type': 'application/json'
//        })
//        .send(projectData)
//        .expect(201);
//
//    expect(response.body).toEqual(mockProject);
//    expect(projectRepository.createProject).toHaveBeenCalledWith('w0000v', 2);
//  });
//
//  it('should return 422 for too short project description', async () => {
//      const shortProject = { project_desc: 'abc' };
//      const response = await request(app)
//          .post('/projects/create')
//          .set('user-info', JSON.stringify({ user_id: 1 }))
//          .send(shortProject)
//          .expect(422);
//
//      expect(response.body).toEqual({ error: 'To short description' });
//  });
//
//  it('should return 403 for duplicate project entry', async () => {
//      const duplicateProject = { project_desc: 'Duplicate Project' };
//      (projectRepository.createProject as jest.Mock).mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
//          'Unique constraint failed', { code: 'P2002', clientVersion: '4.0.0', meta: { field: 'project_desc' } }
//      ));
//
//      const response = await request(app)
//          .post('/projects/create')
//          .set('user-info', JSON.stringify({ user_id: 1 }))
//          .send(duplicateProject)
//          .expect(403);
//
//      expect(response.body).toEqual({ message: 'Unique constraint failed', fields: { field: 'project_desc' } });
//  });
//
//  it('should return 500 for internal server error', async () => {
//      const errorProject = { project_desc: 'Error Project' };
//      (projectRepository.createProject as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
//
//      const response = await request(app)
//          .post('/projects/create')
//          .set('user-info', JSON.stringify({ user_id: 1 }))
//          .send(errorProject)
//          .expect(500);
//
//      expect(response.body).toEqual({ error: 'Internal server error' });
//  });
//});
