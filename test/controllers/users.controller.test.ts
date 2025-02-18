import request from 'supertest';
import express from 'express';
import { getAllUsers, createUser } from '@/controller/users.controller';
import * as userRepository from '@/repository/users.repository';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/users', getAllUsers);
app.post('/users', createUser);

jest.mock('@/repository/users.repository', () => {
    return {
        createUser: jest.fn(),
        getAllUsers: jest.fn(),
    };
});


describe('GET /users', () => {
    it('should return all users from the database', async () => {
        const usersInDB = await prisma.users.findMany({
            where: { d_flag: 0 },
            select: {
                user_id: true,
                username: true,
                email: true
            }
        });

        (userRepository.getAllUsers as jest.Mock).mockResolvedValue(usersInDB);

        const response = await request(app).get('/users').expect(200);

        expect(response.body).toEqual(usersInDB);
    });
});

describe('POST /users', () => {  
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user successfully', async () => {
        const validUsers = [
            { username: 'Alice', email: 'alice@xmpl.com' },
            { username: 'Bob', email: 'bob@xmpl.com' },
            { username: 'Charlie', email: 'charlie@xmpl.com' }
        ];
        
        for (const userData of validUsers) {

            const response = await request(app)
                .post('/users')
                .send(userData)
                .expect(201);
        }
    });

    it('should return 403 for duplicate entry', async () => {
        const duplicateUser = { username: 'Alice', email: 'alice@xmpl.com' };
        (userRepository.createUser as jest.Mock).mockRejectedValue(new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed', { code: 'P2002', clientVersion: '4.0.0', meta: { field: 'email' } }
        ));

        const response = await request(app)
            .post('/users')
            .send(duplicateUser)
            .expect(403);

        expect(response.body).toEqual({ message: 'Unique constraint failed', fields: { field: 'email' } });
    });

    it('should return 403 invalid name or email', async () => {
        const invalidUser = { username: ' 733P07', email: 'invalidexample.com' };

        const response = await request(app)
            .post('/users')
            .send(invalidUser)
            .expect(403);
    });
});
