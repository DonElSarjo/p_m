import request from 'supertest';
import express from 'express';
import { getAllUsers } from '../../controllers/users.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/users', getAllUsers);

describe('GET /users', () => {
    it('should return all users from the database', async () => {
        // Query users from the database directly to compare results
        const usersInDB = await prisma.users.findMany();

        const response = await request(app).get('/users').expect(200);

        expect(response.body).toEqual(usersInDB);
    });
});
