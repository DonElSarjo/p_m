import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function executeSQLFile(filePath: string) {
    const sqlFileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL file content at "#NQ", trims, filters out empty and executes
    const queries = sqlFileContent.split('#NQ').map(q => q.trim()).filter(q => q.length > 0);

    for (const query of queries) {
        try {
            //console.log(`Executing query: ${query}`);
            await prisma.$executeRawUnsafe(query);
        } catch (error) {
            console.error('Error executing query:', query, error);
        }
    }
}

export async function resetDatabase() {
    try {
        //console.log('Resetting database...');
        
        // Create database, tables and triggers
        await executeSQLFile(path.join(__dirname, '../db/init_db.sql'));

        // Insert test data
        await executeSQLFile(path.join(__dirname, '../db/populate_db.sql'));

        //console.log('Database reset complete.');
    } catch (error) {
        console.error('Error resetting database:', error);
    }
}