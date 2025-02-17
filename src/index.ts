import express from 'express';
import { extractUserInfo } from './middlewares/auth.middleware';
import userController from './controller/users.controller';
import projectController from './controller/projects.controller';
import taskController from './controller/tasks.controller';

const app = express();
app.use(express.json());
app.use(extractUserInfo);

// User Endpunkte
app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
//app.delete('/users/:id', userController.softDeleteUser);

// Project Endpunkte
app.get('/projects', projectController.getAllProjects); //ok
app.post('/projects', projectController.createProject); //ok
app.get('/projects/:id', projectController.getProjectById); //ok
app.put('/projects/:id', projectController.updateProject);
app.delete('/projects/:id', projectController.softDeleteProject); //ok

// Task Endpunkte
app.get('/projects/:projectId', taskController.getTasksByProject); //ok
app.post('/projects/tasks', taskController.createTask); 
app.put('/projects/tasks/:taskId', taskController.updateTask);
app.delete('/projects/:projectId/tasks/:taskId', taskController.softDeleteTask);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});