import {Request, Response,NextFunction} from 'express'

import jwt , { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;


const aunthenticateToken = (req:Request, res:Response, next:NextFunction)=> {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({error:'unathorized'});

    }
    jwt.verify(token, JWT_SECRET,(err, user)=> {
        if(err) {
            return res.status(403).json({error: 'Invalid token'})
        }

        req.body.user = user;
        next();
    })
};

export {aunthenticateToken };
