import express, { Express } from 'express';
import adminRouter from './adminRoute';
import vendorRouter from './vendorRoute';
import productRouter from './productRoute'

const app: Express = express();


app.use('/api/admin', adminRouter);
app.use('/api/vendor',vendorRouter);
app.use('/api/product',productRouter)

export default app;

