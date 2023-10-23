import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";

const JWT_SECRET = process.env.JWT_SECRET as string;

const prisma = new PrismaClient();

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
    } = req.body;
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
          country: country
        },
      });
      res.status(201).json({
        message: "Vendor created successfully",
        data: vendor,
      });
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
    if (!vendor) {
      return res.status(400).json({
        status: "Failed",
        message: "Vendor not found",
      });
    }
    const decryptedPassword = await bcrypt.compare(password, vendor.password);
    if (decryptedPassword) {
      const accessToken = await jwt.sign(
        {
          id: vendor.id,
          email: vendor.email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(201).json({
        status: "success",
        data: vendor,
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

export const resetPassword = async (req: Request, res: Response) => {
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

export const vendorByProduct = async (req: Request, res: Response) => {
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
