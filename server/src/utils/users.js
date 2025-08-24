// utils/users.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

// Local fallback storage (in-memory)
const localUsers = [];

// Redis connection (production)
let redis;
if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    retryStrategy(times) {
      console.error(`Redis retry attempt #${times}`);
      return Math.min(times * 50, 2000);
    },
  });

  redis.on("connect", () => console.log("✅ Redis connected (users util)"));
  redis.on("error", (err) => console.error("❌ Redis error:", err));
}

// Prefixes for keys
const USER_PREFIX = "chat:user:";
const ROOM_PREFIX = "chat:room:";

// Save user to Redis or fallback
async function saveUser(user) {
  if (redis) {
    await redis.set(`${USER_PREFIX}${user.id}`, JSON.stringify(user));
    await redis.sadd(`${ROOM_PREFIX}${user.room}`, user.id);
  } else {
    localUsers.push(user);
  }
}

// Remove user
async function removeUser(id) {
  if (redis) {
    const userData = await redis.get(`${USER_PREFIX}${id}`);
    if (!userData) return null;

    const user = JSON.parse(userData);

    await redis.del(`${USER_PREFIX}${id}`);
    await redis.srem(`${ROOM_PREFIX}${user.room}`, id);

    return user;
  } else {
    const index = localUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;
    return localUsers.splice(index, 1)[0];
  }
}

// Get all users in a room
async function getUsersInRoom(room) {
  if (redis) {
    const ids = await redis.smembers(`${ROOM_PREFIX}${room}`);
    if (!ids.length) return [];

    const pipeline = redis.pipeline();
    ids.forEach((id) => pipeline.get(`${USER_PREFIX}${id}`));
    const results = await pipeline.exec();

    return results
      .map(([err, userJSON]) => (userJSON ? JSON.parse(userJSON) : null))
      .filter(Boolean);
  } else {
    return localUsers.filter((u) => u.room === room);
  }
}

// Public API
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
