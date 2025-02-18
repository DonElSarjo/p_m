# Database Documentation: Project Management System

## Overview

This document provides an overview of the database structure for the `project_management` system. It includes tables for users, projects, and tasks, establishing relationships to facilitate project management operations.

## Database: `project_management`

The database is created with the name `project_management`.

## Tables

### 1. `users` Table

Stores user information including unique usernames and email addresses.

**Schema:**

- `user_id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique identifier for each user.
- `username` (VARCHAR(50), NOT NULL): Unique username, validated against a regex pattern (`^[A-Za-z0-9_]{3,20}$`).
- `email` (VARCHAR(100), NOT NULL, UNIQUE): Unique email address, validated with a regex pattern for email format.
- `d_flag` (TINYINT, NOT NULL, DEFAULT 0): Soft delete flag (0 = active, 1 = deleted).
- `c_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.
- `u_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): Last update timestamp.

**Indexes & Constraints:**

- `PRIMARY KEY` on `user_id`.
- `UNIQUE INDEX` on `email`.
- `INDEX` on `d_flag` for quick lookup.
- `CHECK` constraints for email and username format validation.

---

### 2. `projects` Table

Stores project details and associates projects with users (owners).

**Schema:**

- `project_id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique project identifier.
- `project_desc` (VARCHAR(255), NOT NULL): Description of the project.
- `project_status` (ENUM, NOT NULL, DEFAULT 'CREATED'): Status of the project (`CREATED`, `PROCESSING`, `PENDING`, `DONE`).
- `project_owner_id` (INT, NOT NULL, FOREIGN KEY): References `users.user_id`.
- `d_flag` (TINYINT, NOT NULL, DEFAULT 0): Soft delete flag.
- `c_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.
- `u_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): Last update timestamp.

**Indexes & Constraints:**

- `PRIMARY KEY` on `project_id`.
- `INDEX` on `project_owner_id` for relationship mapping.
- `INDEX` on `d_flag` for efficient filtering.
- `FOREIGN KEY` (`project_owner_id`) references `users.user_id` with `ON UPDATE CASCADE ON DELETE CASCADE`.

---

### 3. `tasks` Table

Stores task details and associates tasks with projects and users (owners).

**Schema:**

- `task_id` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique task identifier.
- `task_desc` (VARCHAR(255), NOT NULL): Description of the task.
- `task_status` (ENUM, NOT NULL, DEFAULT 'CREATED'): Status of the task (`CREATED`, `PROCESSING`, `DONE`).
- `task_owner_id` (INT, NOT NULL, FOREIGN KEY): References `users.user_id`.
- `project_id` (INT, NOT NULL, FOREIGN KEY): References `projects.project_id`.
- `d_flag` (TINYINT, NOT NULL, DEFAULT 0): Soft delete flag.
- `c_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp.
- `u_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): Last update timestamp.

**Indexes & Constraints:**

- `PRIMARY KEY` on `task_id`.
- `UNIQUE INDEX` on (`task_desc`, `project_id`, `task_owner_id`) to ensure task uniqueness within a project and owner.
- `INDEX` on `task_owner_id` for relationship mapping.
- `INDEX` on `d_flag` for quick filtering.
- `FOREIGN KEY` (`task_owner_id`) references `users.user_id` with `ON UPDATE CASCADE ON DELETE CASCADE`.
- `FOREIGN KEY` (`project_id`) references `projects.project_id` with `ON UPDATE CASCADE ON DELETE CASCADE`.

## Relationships

- **Users & Projects:** A user (`users.user_id`) can own multiple projects (`projects.project_owner_id`).
- **Users & Tasks:** A user (`users.user_id`) can own multiple tasks (`tasks.task_owner_id`).
- **Projects & Tasks:** A project (`projects.project_id`) can have multiple tasks (`tasks.project_id`).

## Triggers

### `project_delete`

- **Purpose:** Ensures that when a project is marked as deleted (`d_flag = 1`), all its associated tasks are also marked as deleted.
- **Trigger Type:** AFTER UPDATE on `projects`
- **Logic:** If `d_flag` of a project is updated to `1`, all tasks linked to the project are also updated to `d_flag = 1`.

### `project_done`

- **Purpose:** Prevents a project from being marked as `DONE` unless all its associated tasks are also `DONE`.
- **Trigger Type:** BEFORE UPDATE on `projects`
- **Logic:** Checks for any incomplete tasks before allowing a project’s status to change to `DONE`. If any task is not `DONE`, the update is prevented with an error message.

### `project_start`

- **Purpose:** Automatically updates a project’s status to `PROCESSING` when any of its tasks is marked as `PROCESSING`.
- **Trigger Type:** AFTER UPDATE on `tasks`
- **Logic:** If a task's status is updated to `PROCESSING`, the associated project is also updated to `PROCESSING`, unless it is already in that state.

### `user_delete`

- **Purpose:** Prevents a user from being deleted if they have unfinished tasks or projects.
- **Trigger Type:** BEFORE UPDATE on `users`
- **Logic:** Checks if a user has any non-deleted tasks or projects that are not `DONE`. If such records exist, the update is prevented with an error message.

### `tasks_before_insert`

- **Purpose:** Ensures that users can only create tasks for projects they own.
- **Trigger Type:** BEFORE INSERT on `tasks`
- **Logic:** Checks whether the `task_owner_id` is the owner of the referenced project. If not, the insertion is prevented with an error message.

## `Normalization Choice`

### `3N`

1. **Performance Efficiency:**

   - 3NF reduces redundancy while maintaining simpler joins for data retrieval.
   - 5NF would require additional decomposition, leading to a higher number of tables and complex queries.

2. **Practical Business Needs:**

   - The project management system does not require highly decomposed relationships.
   - One user owns a project, and tasks are assigned to single users, making 3NF sufficient for integrity.

3. **Simplicity and Maintainability:**

   - A 5NF structure would introduce extra bridge tables (e.g., `project_users`, `task_users`) for multiple owners and collaborators, complicating maintenance.
   - Keeping 3NF ensures a balance between normalization and usability.

4. **Avoiding Excessive Joins:**
   - 5NF could introduce excessive join operations, reducing query performance.
   - 3NF maintains reasonable data integrity without requiring excessive decomposition.

## `Disclaimer`

This document has been reviewed for clarity and accuracy. AI-based tools were utilized to assist in checking formulations and ensuring consistency, but all final decisions and validations were made by human reviewers
