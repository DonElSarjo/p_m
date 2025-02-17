import { projects_project_status } from '@prisma/client';

export type ProjectStatus = projects_project_status;
export type NewProject = {
  project_desc: string;
  project_owner_id: number;
}
