import express from 'express';
import userController from './controller/users.controller';
import projectController from './controller/projects.controller';
import taskController from './controller/tasks.controller';

const app = express();
app.use(express.json());

// User Endpunkte
app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.delete('/users/:id', userController.softDeleteUser);

// Project Endpunkte
app.get('/projects', projectController.getAllProjects);
app.post('/projects', projectController.createProject);
app.get('/projects/:id', projectController.getProjectById);
app.put('/projects/:id', projectController.updateProject);
app.delete('/projects/:id', projectController.softDeleteProject);

// Task Endpunkte
app.get('/projects/:projectId/tasks', taskController.getTasksByProject);
app.post('/projects/:projectId/tasks', taskController.createTask);
app.put('/projects/:projectId/tasks/:taskId', taskController.updateTask);
app.delete('/projects/:projectId/tasks/:taskId', taskController.softDeleteTask);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});