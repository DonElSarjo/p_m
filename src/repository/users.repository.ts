import { PrismaClient } from '@prisma/client';
import { NewUser } from '../types/users.types';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
    return await prisma.users.findMany({ 
        where: { d_flag: 0 },
        select: {
            user_id: true,
            username: true,
            email: true
        }
    });
};

export const createUser = async (userData: NewUser) => {
    return await prisma.users.create({
        data: userData,
    });
};

export const softDeleteUser = async (userId: number) => {
    return await prisma.users.update({
        where: { user_id: userId },
        data: { d_flag: 1 },
    });
};
