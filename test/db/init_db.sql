DROP DATABASE IF EXISTS `project_management`;#NQ
CREATE DATABASE `project_management`;#NQ
USE `project_management`;#NQ
DROP TABLE IF EXISTS `users`;#NQ
CREATE TABLE `users` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`email` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_general_ci',
	`d_flag` TINYINT(4) NOT NULL DEFAULT '0',
	`c_date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`u_date` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	PRIMARY KEY (`user_id`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE,
	INDEX `d_flag` (`d_flag`) USING BTREE,
	CONSTRAINT `CC__valid_email` CHECK (`email` regexp '^[A-Za-z0-9\\._%+-]+@[A-Za-z0-9\\.-]+\\.[A-Za-z]{2,}$'),
	CONSTRAINT `CC__valid_username` CHECK (`username` regexp '^[A-Za-z0-9_]{3,20}$')
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;#NQ
DROP TABLE IF EXISTS `projects`;#NQ
CREATE TABLE `projects` (
	`project_id` INT(11) NOT NULL AUTO_INCREMENT,
	`project_desc` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`project_status` ENUM('CREATED','PROCESSING','PENDING','DONE') NOT NULL DEFAULT 'CREATED' COLLATE 'utf8mb4_general_ci',
	`project_owner_id` INT(11) NOT NULL,
	`d_flag` TINYINT(4) NOT NULL DEFAULT '0',
	`c_date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`u_date` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	PRIMARY KEY (`project_id`) USING BTREE,
	UNIQUE INDEX `project_desc` (`project_desc`, `project_owner_id`) USING BTREE,
	INDEX `FK__project_owner` (`project_owner_id`) USING BTREE,
	INDEX `d_flag` (`d_flag`) USING BTREE,
	CONSTRAINT `FK__project_owner` FOREIGN KEY (`project_owner_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;#NQ
DROP TABLE IF EXISTS `tasks`;#NQ
CREATE TABLE `tasks` (
	`task_id` INT(11) NOT NULL AUTO_INCREMENT,
	`task_desc` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`task_status` ENUM('CREATED','PROCESSING','DONE') NOT NULL DEFAULT 'CREATED' COLLATE 'utf8mb4_general_ci',
	`task_owner_id` INT(11) NOT NULL,
	`project_id` INT(11) NOT NULL,
	`d_flag` TINYINT(4) NOT NULL DEFAULT '0',
	`c_date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`u_date` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	PRIMARY KEY (`task_id`) USING BTREE,
	UNIQUE INDEX `desc_project_owner` (`task_desc`, `project_id`, `task_owner_id`) USING BTREE,
	INDEX `FK__task_owner` (`task_owner_id`) USING BTREE,
	INDEX `d_flag` (`d_flag`) USING BTREE,
	CONSTRAINT `FK__task_owner` FOREIGN KEY (`task_owner_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK__project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=INNODB;#NQ


CREATE TRIGGER `project_delete`
AFTER UPDATE ON `projects`
FOR EACH ROW
BEGIN
	-- Cascades d_flag = 1 to tasks
	IF NEW.d_flag = 1 THEN
		UPDATE tasks
		SET d_flag = 1 
		WHERE project_id = OLD.project_id;
	END IF;
END;
;#NQ

CREATE TRIGGER `project_done`
BEFORE UPDATE ON `projects`
FOR EACH ROW
BEGIN
	-- If status is set to 'DONE', all tasks must be 'DONE'
	DECLARE error_message VARCHAR(300);
	SET error_message = CONCAT('Not all tasks are set to DONE for this project: ', OLD.project_desc);
	IF NEW.project_status = 'DONE' THEN
		IF EXISTS (
			SELECT 1 
			FROM tasks 
			WHERE project_id = NEW.project_id
			AND task_status <> 'DONE'
		) THEN 
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = error_message;
		END IF;
	END IF;
END;#NQ


CREATE TRIGGER `project_start`
AFTER UPDATE ON `tasks`
FOR EACH ROW
BEGIN
	-- Sets the project to 'PROCESSING' if any task is 'PROCESSING'
	IF NEW.task_status = 'PROCESSING' THEN
		UPDATE projects
		SET project_status = 'PROCESSING'
		WHERE project_id = NEW.project_id
		AND project_status <> 'PROCESSING';
	END IF;
END;#NQ

CREATE DEFINER=`root`@`localhost` TRIGGER `user_delete` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
	-- Deleted user should not have pending tasks
	DECLARE error_message VARCHAR(300);
	SET error_message = CONCAT('User still has pending tasks/projects: ', OLD.username);
	IF NEW.d_flag = 1 THEN
		IF EXISTS (
			SELECT 1 
			FROM 
				users u 
				LEFT JOIN tasks t ON u.user_id = t.task_owner_id
				LEFT JOIN projects p ON u.user_id = p.project_id 
			WHERE 
				u.user_id = OLD.user_id
				AND (
					t.d_flag = 0
					OR p.d_flag = 0
				)
				AND (
					t.task_status <> 'DONE'
					OR p.project_status <> 'DONE'
				)
		) THEN 
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = error_message;
		END IF;
	END IF;
END
;#NQ
CREATE DEFINER=`root`@`localhost` TRIGGER `tasks_before_insert` BEFORE INSERT ON `tasks` FOR EACH ROW BEGIN
	DECLARE projects_of_user VARCHAR(50);

   SELECT GROUP_CONCAT(DISTINCT project_id) INTO projects_of_user
   FROM projects
   WHERE project_owner_id = NEW.task_owner_id;

   IF NOT FIND_IN_SET(NEW.project_id, projects_of_user) THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'You can only create tasks for your own projects';
   END IF;
END
