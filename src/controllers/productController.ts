import { PrismaClient } from "@prisma/client";
import { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from 'validator';

const prisma = new PrismaClient();

export const createProduct = async(req:Request, res:Response)=>{
    try{
        const {name,description,category,price,imageUrl} = req.body
        const product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                category: category,
                price: price,
                imageUrl: imageUrl
              },
        })
    }catch(error){

    }
}

