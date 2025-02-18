import express from 'express';
import { extractUserInfo } from './middlewares/auth.middleware';
import userController from './controller/users.controller';
import projectController from './controller/projects.controller';
import taskController from './controller/tasks.controller';

const app = express();
app.use(express.json());
app.use(extractUserInfo);

// User Endpunkte
app.get('/users', userController.getAllUsers); //ok + test
app.post('/users', userController.createUser); //ok + test
//app.delete('/users/:id', userController.softDeleteUser);

// Project Endpunkte
app.get('/projects/list', projectController.getAllProjects); //ok
app.post('/projects/create', projectController.createProject); //ok
app.get('/projects/fetch', projectController.getProjectById); //ok
app.put('/projects/update', projectController.updateProject); //ok
app.delete('/projects/delete', projectController.softDeleteProject); //ok

// Task Endpunkte
app.get('/projects/tasks/list', taskController.getTasksByProject); //ok
app.post('/projects/tasks/create', taskController.createTask); //ok
app.put('/projects/tasks/update', taskController.updateTask); //ok
app.delete('/projects/tasks/delete', taskController.softDeleteTask); //ok

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});