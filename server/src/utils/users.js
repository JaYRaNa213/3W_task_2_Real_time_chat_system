import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const REDIS_URL = process.env.REDIS_URL;
const redis = new Redis(REDIS_URL, {
  retryStrategy(times) {
    console.error(`Redis retry attempt #${times}`);
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => console.log("✅ Redis connected (users util)"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

const USER_PREFIX = "chat:user:";
const ROOM_PREFIX = "chat:room:";

async function saveUser(user) {
  try {
    await redis.set(`${USER_PREFIX}${user.id}`, JSON.stringify(user));
    await redis.sadd(`${ROOM_PREFIX}${user.room}`, user.id);
  } catch (err) {
    console.error("❌ Redis saveUser error:", err);
  }
}

async function removeUser(id) {
  try {
    const userData = await redis.get(`${USER_PREFIX}${id}`);
    if (!userData) return null;
    const user = JSON.parse(userData);
    await redis.del(`${USER_PREFIX}${id}`);
    await redis.srem(`${ROOM_PREFIX}${user.room}`, id);
    return user;
  } catch (err) {
    console.error("❌ Redis removeUser error:", err);
    return null;
  }
}

async function getUsersInRoom(room) {
  try {
    const ids = await redis.smembers(`${ROOM_PREFIX}${room}`);
    if (!ids.length) return [];
    const pipeline = redis.pipeline();
    ids.forEach((id) => pipeline.get(`${USER_PREFIX}${id}`));
    const results = await pipeline.exec();
    return results
      .map(([err, userJSON]) => (userJSON ? JSON.parse(userJSON) : null))
      .filter(Boolean);
  } catch (err) {
    console.error("❌ Redis getUsersInRoom error:", err);
    return [];
  }
}

export async function joinUser(id, username, room) {
  const user = { id, username, room };
  await saveUser(user);
  return user;
}

export async function leaveUser(id) {
  return await removeUser(id);
}

export async function getRoomUsers(room) {
  return await getUsersInRoom(room);
}

export { redis };
