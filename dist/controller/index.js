"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksController = exports.projectsController = exports.usersController = void 0;
const users_controller_1 = __importDefault(require("./users.controller"));
exports.usersController = users_controller_1.default;
const projects_controller_1 = __importDefault(require("./projects.controller"));
exports.projectsController = projects_controller_1.default;
const tasks_controller_1 = __importDefault(require("./tasks.controller"));
exports.tasksController = tasks_controller_1.default;
