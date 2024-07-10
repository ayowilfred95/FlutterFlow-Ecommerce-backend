import { PrismaClient } from "@prisma/client";
import { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from 'validator';
// import redisClient from '../config/redis';
import dotenv from "dotenv";
import { adminDto } from "../dto/create-admin.dto";

const JWT_SECRET = process.env.JWT_SECRET as string;



const prisma = new PrismaClient();

/**
 * @dev an interface was defined to defined a custom type for user
 */

declare global {
    namespace Express {
      interface Request {
        user?: any
      }
    }
  }

export const registerAdmin = async(req:Request, res:Response, next:NextFunction) => {
    try{
        const {fullName, email,password} = <adminDto>req.body

         // Check if the user already exists with the provided email
    const existingUser = await prisma.admin.findUnique({
        where: { email },
      });
        if(!validator.isEmail(email)){
           return res.status(409).json({ message: "Invalid email" });
        }

        if (existingUser) {
          return  res.status(409).json({ message: "email already exists" });
        }else {
            const hashedPassword = await bcrypt.hash(password,10);

        const admin = await prisma.admin.create({
            data: {
                fullName:fullName,
                email: email,
                password:hashedPassword,
                isAdmin:true,
            },
        });
        res.status(201).json({
            message: "Admin created successfully",
            data:admin,        
        });
        }

    }catch(error) {
        res.status(400).json({
            status: "failed",
            data: error,
        })
    }
}



export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return res.status(400).json({
        status: "failed",
        message: "Admin not found",
      });
    }

    const decryptedPassword = await bcrypt.compare(password, admin.password);
    if (decryptedPassword) {
      const accessToken = jwt.sign(
        {
          isAdmin: admin.isAdmin,
          id: admin.id,
          email: admin.email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

   
        // // Cache the admin data in Redis (using the admin ID as a string)
        // await redisClient.set(admin.id.toString(), JSON.stringify(admin));

      return res.status(201).json({
        status: "success",
        data: admin,
        token: accessToken,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Password incorrect",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      data: error,
    });
  }
};



export const resetAdminPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (admin) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password,10)

      // update the password
      await prisma.admin.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Password successfully changed',
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: 'Admin not found. Please check the email address.',
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 'failed',
      data: error,
    });
  }
};



  export const verifyToken = (req:Request, res:Response, next:NextFunction) =>  {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];

      if(!token) {
        return res.status(401).json({ status:'failed',message:'unathorized'});

    }
  
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err)
          return res.status(401).json({
            status: 'failed',
            message: 'Invalid token',
            error: err,
          });
        req.user = user;
        next();
      });
    } else {
      res.status(403).json({
        status: 'failed',
        message: 'Not an authorized user',
      });
    }
  };


  export const authorizedAdmin =  (req:Request, res:Response, next:NextFunction) =>  {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
       return res.status(403).json({
          status: 'failed',
          message: 'Authorization failed',
        });
      }
    });
  };
  