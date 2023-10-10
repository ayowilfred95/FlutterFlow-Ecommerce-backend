import express, { Express } from "express";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import { aunthenticateToken } from "./middlewares/userMiddleware";
import router from "./routes/index";

import logger from "morgan";

const app: Express = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import and use the router for your routes
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});

app.use(notFound);
app.use(errorHandler);

export { app };
