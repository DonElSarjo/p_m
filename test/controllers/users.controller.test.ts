import request from 'supertest';
import express from 'express';
import { getAllUsers } from '@/controller/users.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/users', getAllUsers);

describe('GET /users', () => {
    it('should return all users from the database', async () => {
        // Query users from the database directly to compare results
        const usersInDB = await prisma.users.findMany({ 
            where: { d_flag: 0 },
            select: {
                user_id: true,
                username: true,
                email: true
            }
        });

        const response = await request(app).get('/users').expect(201);

        expect(response.body).toEqual(usersInDB);
    });
});
