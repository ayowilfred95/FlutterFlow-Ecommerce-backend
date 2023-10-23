import express, { Express } from 'express';
import adminRouter from './adminRoute';
import vendorRouter from './vendorRoute';

const app: Express = express();


app.use('/api/admin', adminRouter);
app.use('/api/vendor',vendorRouter)

export default app;

