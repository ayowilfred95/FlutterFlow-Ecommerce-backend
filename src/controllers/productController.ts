import { PrismaClient } from "@prisma/client";
import { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from 'validator';


const prisma = new PrismaClient();

export const createProduct = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {name,description,category,price,imageUrl} = req.body
        const vendorId = req.user.id;
        if(!vendorId){
            return res.status(400).json({
                status:"failed",
                message:"Please provide a token"
            })
        }
        const product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                category: category,
                price: price,
                imageUrl: imageUrl,
                sold: false,
                vendorId:vendorId,
              },
        });
        res.status(200).json({
            "status":"Success",
            message: "Product created successfully",
            data:product
        });
    }catch(error){
       return res.status(401).json({
            "message":"failed",
            data:error
        })
    }
}

export const getAllProductByCategory = async(req:Request,res:Response)=>{
   try{
    const category = req.params.category;

    const products = await prisma.product.findMany({
        where:{
            category: category,
            sold:false
        },
    });
    res.status(200).json({
        status: "Success",
        data: products
    });

   }catch (error) {
    // debugging
    console.error("Error fetching products by category:", error);

    res.status(500).json({
        status: "Error",
        message: "Failed to fetch products by category",
        data: error
    });
}
}


export const getAllProducts=async(req:Request,res:Response)=>{
    try{
        const products = await prisma.product.findMany()

        res.status(200).json({
            status: "Success",
            data: products
        });

    }catch(error){
        res.status(500).json({
            status: "Error",
            message: "Failed to fetch all products",
            data: error
        });
    }
}


export const getProductsByVendor = async (req: Request, res: Response) => {
    try {
      const vendorId = req.user.id; // Extract the vendor ID from the token
  
      if (!vendorId) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide a token",
        });
      }
  
      const products = await prisma.product.findMany({
        where: {
          vendorId: vendorId,
          sold: false, // Add other conditions as needed
        },
      });
  
      res.status(200).json({
        status: "Success",
        data: products,
      });
    } catch (error) {
  
      res.status(500).json({
        status: "Error",
        message: "Failed to fetch products by vendor",
        data: error,
      });
    }
  };
  
