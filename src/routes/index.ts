import express, { Express } from 'express';
import adminRouter from './adminRoute';

const app: Express = express();

app.use('/api/admin', adminRouter);

export default app;

