import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express';
import * as userRepository from '../repository/users.repository';
import { NewUser } from '../types/users.types';

const prisma = new PrismaClient();

// Gets all users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.getAllUsers();     
        if (!users) {
            res.status(404).json({ error: 'No user in database' })
        } else {
            res.status(201).json(users)
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Creates a user
const createUser = async (req: Request, res: Response) => {
    try {
        const userData: NewUser = req.body;
        const user = await userRepository.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // duplicate entry
          if (error.code === 'P2002') {
            res.status(403).json({message: 'Unique constraint failed', fields: error.meta})
          }
          console.log(error.code)
        }
        // CC__ constrains failed invalid username or email
        else if (error instanceof Prisma.PrismaClientUnknownRequestError) {       
            res.status(403).json({message: error.message})
        }
        // so client gets any response
        else {
            res.status(500).json({message: error})
        }

      }
};

// Marks user as deleted by ID
// Error message if open projects or tasks
const softDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.users.update({
            where: { user_id: parseInt(id) },
            data: { d_flag: 1 }
        });
        res.json({ message: 'Benutzer als gelöscht markiert' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Soft-Löschen des Benutzers' });
    }
};

export default { getAllUsers, createUser, softDeleteUser };
