import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: {
            user_id: number;
            username: string;
            email: string;
        };
    }
}