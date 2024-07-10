import express, { Express } from "express";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import router from "./routes/index";
import logger from "morgan";
import { PrismaClient } from "@prisma/client";
import path from "path";

const app: Express = express();
const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("[Database]: Connected to database successfully");

    // Middleware
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.use('/images',express.static(path.join(__dirname,'images')))

    // Import and use the router for your routes
    app.use(router);

    const port = process.env.PORT || 5000;

    // Start the server
    app.listen(port, () => {
      console.log(`[Server]: I am running at http://localhost:${port}`);
    });

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);

  } catch (error) {
    console.error("[Database]: Error connecting to database", error);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();

export { app, prisma };
