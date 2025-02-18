# Project Installation Guide

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MariaDB](https://mariadb.org//) (ensure it is running and accessible)

## Installation Steps

### 1. Clone the Repository

```sh
git clone https://github.com/DonElSarjo/p_m.git
cd p_m
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```
DATABASE_URL=mysql://user:password@localhost:3306/project_management
```

Modify the values accordingly for your MySQL setup.

### 4. Set Up Database

Execute init_db.sql to initialize the database:

To populate the database with opulate_db.sql:

### 5. Start the Server

```sh
npm start
```

The API will be available at `http://localhost:3000/`.

### 6. Run Tests

To run unit and integration tests:

```sh
npm test
```

## API Endpoints

### User Routes

- `GET /users/list` - Fetch all users
- `POST /users/create` - Create a new user

### Project Routes

- `GET /projects/list` - Get all projects
- `POST /projects/create` - Create a new project
- `GET /projects/fetch` - Get project details
- `PUT /projects/update` - Update a project
- `DELETE /projects/delete` - Soft delete a project

## Troubleshooting

### Common Issues

#### Database Connection Issues

- Ensure MySQL is running and accessible.
- Verify your `DATABASE_URL` in `.env`.

#### Server Fails to Start

- Run `npm install` to check for missing dependencies.
- Ensure your `.env` file is correctly configured.

#### Tests Failing

- Try running `npx jest --clearCache && npm test`.
- Ensure the database is reset before testing.

For further assistance, refer to the project documentation or contact the maintainers.

#### Disclaimer

This document has been reviewed for clarity and accuracy. AI-based tools were utilized to assist in checking formulations and ensuring consistency, but all final decisions and validations were made by human reviewers
