import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function executeSQLFile(filePath: string) {
    const sql = fs.readFileSync(filePath, 'utf8');
    await prisma.$executeRawUnsafe(sql);
}

export async function resetDatabase() {
    try {
        console.log('Resetting database...');

        // Drop and recreate the schema
        await executeSQLFile(path.join(__dirname, '../db/script1.sql'));

        // Insert test data
        await executeSQLFile(path.join(__dirname, '../db/script2.sql'));

        console.log('Database reset complete.');
    } catch (error) {
        console.error('Error resetting database:', error);
    }
}