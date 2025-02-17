import { Request, Response, NextFunction } from 'express';

export const extractUserInfo = (req: Request, res: Response, next: NextFunction): void => {
    const userInfoHeader = req.header('User-Info');

    if (!userInfoHeader) {
        res.status(401).json({ error: 'User-Info header is missing' });
        return; // Ensure middleware stops here
    }

    try {
        const userInfo = JSON.parse(userInfoHeader);
        req.user = userInfo;
        next(); // Continue to next middleware or route handler
    } catch (error) {
        res.status(400).json({ error: 'Invalid User-Info header format' });
        return; // Ensure middleware stops here
    }
};
