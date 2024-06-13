import {NextFunction, Response, Request} from "express";
import jwt, {Secret} from "jsonwebtoken";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const secretKey = process.env.SECRET_KEY;
    try {
        if(!secretKey){
            throw new Error("No secret key available");
        }
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("No bearer token available");
        }
        jwt.verify(token, secretKey);
        next();
    } catch (err) {
        res.status(401).send(`Please authenticate! ${err}`);
    }
}

export const checkIfUserAuthenticatedWithId = async (userId: number, req: Request, res: Response) : Promise<boolean> => {
    const secretKey = process.env.SECRET_KEY as string;
    const token = req.header("Authorization")?.replace("Bearer ", "") as string;
    const payload = jwt.verify(token, secretKey) as { user: number };
    if (payload.user !== userId){
        res.sendStatus(401);
        return false;
    }

    return true;
}