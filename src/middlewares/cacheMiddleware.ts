// import { Request, Response, NextFunction } from 'express';
// import redisClient from '../config/redis';

// const isCached = async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;

//     try {
//         const data = await redisClient.get(id);

//         if (data !== null) {
//             res.status(200).json({ message: 'Data is cached', data: JSON.parse(data) });
//         } else {
//             next();
//         }
//     } catch (err) {
//         console.error('Error accessing Redis:', err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// export default isCached;
