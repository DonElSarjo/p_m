import { tasks_task_status } from '@prisma/client';

export type TaskStatus = tasks_task_status;
export type NewTask = {
  task_desc: string;
  task_owner_id: number;
  project_id: number;
}