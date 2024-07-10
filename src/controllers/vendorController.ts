import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "./adminController";
import { vendorDto } from "../dto/create-vendor.dto";
import { updateVendorDto } from "../dto/update-vendor.dto";
import isEmail from "validator/lib/isEmail";
// import redisClient from "../config/redis";


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

// register a vendor

export const registerVendor = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      state,
      country,
    } = <vendorDto>req.body;
    if(!isEmail(email)){
      return res.status(400).json({
        status:"failed",
        message:"Please Enter a valid email"
      })
    }
    const existingUser = await prisma.vendor.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const vendor = await prisma.vendor.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          address: address,
          phoneNumber: phoneNumber,
          state: state,
          country: country,
          isVendor:true,
        },
      });
      res.status(201).json({
        message: "Vendor created successfully",
        data: {
            id:vendor.id,
            email:vendor.email,
            firstName:vendor.firstName,
            lastName:vendor.lastName,
            address:vendor.address,
            phoneNumber:vendor.phoneNumber,
            state:vendor.state,
            country:vendor.country,
            isVendor:vendor.isVendor,
          }
        })
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      data: error,
    });
  }
};

// login vendor

export const loginVendor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: email,
      },
    });

    if (!vendor?.email && !vendor?.password) {
      return res.status(400).json({
        status: "Failed",
        message: "Incorrect Email or password",
      });
    }
    const decryptedPassword = await bcrypt.compare(password, vendor.password);
    if (decryptedPassword) {
      const accessToken = await jwt.sign(
        {
          id: vendor.id,
          email: vendor.email,
          isVendor: true,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(201).json({
        status: "success",
        data:{
          id:vendor.id,
          email:vendor.email,
          firstName:vendor.firstName,
          lastName:vendor.lastName,
          address:vendor.address,
          phoneNumber:vendor.phoneNumber,
          state:vendor.state,
          country:vendor.country,
          isVendor:vendor.isVendor,
        },
        token: accessToken,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Password incorrect",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      data: error,
    });
  }
};


// get all vendors
export const getAllVendors = async(req:Request, res:Response, next:NextFunction) => {
  try {

    // const cachedVendors = await redisClient.get('vendors');
    // console.log('Cached vendors:', cachedVendors);

    // if (cachedVendors) {
    //     return res.status(200).json({
    //         status: 'success',
    //         data: JSON.parse(cachedVendors)
    //     });
    // }

    const vendors = await prisma.vendor.findMany();

    if(!vendors){
      return res.status(404).json({
        status:"failed",
        message:"No vendors found"
      })
    }



    //  // Cache the vendor data in Redis (using the vendor ID as a string)
    //  await redisClient.set("vendors", JSON.stringify(vendors));

    res.status(200).json({
      status:"success",
      data:vendors.map((vendor) => {
        return {
          id:vendor.id,
          email:vendor.email,
          firstName:vendor.firstName,
          lastName:vendor.lastName,
          address:vendor.address,
          phoneNumber:vendor.phoneNumber,
          state:vendor.state,
          country:vendor.country,
        }
      })
    })
  } catch (error) {
    res.status(500).json({
      status:"Internal server error",
      error:error
    })
  }
}

// get vendor by id
export const getVendorById = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where:{
        id:parseInt(req.params.id)
      }
    })

    if(!vendor){
      return res.status(404).json({
        status:"failed",
        message:"Vendor not found"
      })
    }

    // // Cache the vendor data in Redis (using the vendor ID as a string)
    // await redisClient.set(vendor.id.toString(), JSON.stringify(vendor));

    res.status(200).json({
      status:"success",
      data:{
        id:vendor.id,
          email:vendor.email,
          firstName:vendor.firstName,
          lastName:vendor.lastName,
          address:vendor.address,
          phoneNumber:vendor.phoneNumber,
          state:vendor.state,
          country:vendor.country,
        }
      })
    } catch (error) {
      res.status(500).json({
      status:"Internal server error",
      error:error
    })
  }
}





export const resetVendorPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: email,
      },
    });

    if (vendor) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // update the password
      await prisma.vendor.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Password successfully changed",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Vendor not found. Please check the email address.",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "failed",
      error: error,
    });
  }
};

// find Vendor by product

export const vendorByProduct = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        products: true,
      },
    });
    if (!vendor) {
      return res.status(404).json({
        status: "failed",
        message: "Vendor not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: vendor,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      error: error,
    });
  }
};

// delete vendor by id
export const deleteVendorById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: id,
      },
    });
    if (vendor) {
      await prisma.vendor.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json({
        status: "Vendor deleted successfully success",
        data: null,
      });
    }else{
      res.status(400).json({
        message:"Vendor does not exist",
      })
    }
  } catch (error) {
    return res.status(200).json({
      status: "failed",
      error: error,
    });
  }
};

// update vendor by id
export const updateVendorById= async(req:Request, res:Response, next:NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where:{
        id:parseInt(req.params.id)
      }
    })
    if(!vendor){
      return res.status(404).json({
        status:"failed",
        message:"Vendor not found"
      })
    }
    const {firstName,lastName,address,phoneNumber,state,country} = <updateVendorDto>req.body
    const updatedVendor = await prisma.vendor.update({
      where:{
        id:parseInt(req.params.id)
      },
      data:{
        firstName:firstName,
        lastName:lastName,
        address:address,
        phoneNumber:phoneNumber,
        state:state,
        country:country
      }
    })
    res.status(200).json({
      status:"success",
      data:updatedVendor
    })
  } catch (error) {
    res.status(500).json({
      status:"Internal server error",
      error:error
    })
  }
}

// authorise vendor

export const authorizedVendor =  (req:Request, res:Response, next:NextFunction) =>  {
  verifyToken(req, res, () => {
    if (req.user.isVendor) {
      next();
    } else {
     return res.status(403).json({
        status: 'failed',
        message: 'Authorization failed',
      });
    }
  });
};
