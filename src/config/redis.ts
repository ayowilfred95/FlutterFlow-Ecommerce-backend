// import { createClient, RedisClientType } from 'redis';
// import dotenv from 'dotenv';

// dotenv.config();

// const redisClient: RedisClientType = createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: parseInt(process.env.REDIS_PORT as string, 10)
//     }
// });

// redisClient.on('error', (err) => {
//     console.error('Redis Client Error', err);
// });

// (async () => {
//     try {
//         await redisClient.connect();
//         console.log('Redis client connected successfully');
//     } catch (err) {
//         console.error('Error connecting to Redis:', err);
//     }
// })();

// export default redisClient;
