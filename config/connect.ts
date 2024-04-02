import { createClient } from 'redis';

const client = createClient({
    password: 'mrFE4v61AnFcIuZO5SdPP08A4RmUjGYU',
    socket: {
        host: 'redis-12311.c13.us-east-1-3.ec2.cloud.redislabs.com',
        port: 12311
    }
});

client.on('connect', () => {
    console.log('Redis client connected');
});
client.on('error', (err) => {
    console.error('Redis connection error:', err);
});
client.on('ready', () => {
    console.log('Redis connection established successfully');
});

export { client };
