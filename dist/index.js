"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const users_controller_1 = __importDefault(require("./controller/users.controller"));
const projects_controller_1 = __importDefault(require("./controller/projects.controller"));
const tasks_controller_1 = __importDefault(require("./controller/tasks.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(auth_middleware_1.extractUserInfo);
// User Endpunkte
app.get('/users', users_controller_1.default.getAllUsers);
app.post('/users', users_controller_1.default.createUser);
//app.delete('/users/:id', userController.softDeleteUser);
// Project Endpunkte
app.get('/projects', projects_controller_1.default.getAllProjects); //ok
app.post('/projects', projects_controller_1.default.createProject); //ok
app.get('/projects/:id', projects_controller_1.default.getProjectById); //ok
app.put('/projects/:id', projects_controller_1.default.updateProject);
app.delete('/projects/:id', projects_controller_1.default.softDeleteProject); //ok
// Task Endpunkte
app.get('/projects/:projectId/tasks', tasks_controller_1.default.getTasksByProject); //ok
app.post('/projects/tasks', tasks_controller_1.default.createTask);
app.put('/projects/tasks/:taskId', tasks_controller_1.default.updateTask);
app.delete('/projects/:projectId/tasks/:taskId', tasks_controller_1.default.softDeleteTask);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
