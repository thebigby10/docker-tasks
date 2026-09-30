import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export async function initRedis() {
  await redisClient.connect();
}

export async function pushToQueue(queueName: string, data: any) {
  return redisClient.lPush(queueName, JSON.stringify(data));
}

export async function popFromQueue(queueName: string) {
  const data = await redisClient.rPop(queueName);
  return data ? JSON.parse(data) : null;
}

export async function getQueueLength(queueName: string) {
  return redisClient.lLen(queueName);
}

export async function cacheSet(key: string, value: any, ttl?: number) {
  if (ttl) {
    return redisClient.setEx(key, ttl, JSON.stringify(value));
  }
  return redisClient.set(key, JSON.stringify(value));
}

export async function cacheGet(key: string) {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheDel(key: string) {
  return redisClient.del(key);
}

export default redisClient;
