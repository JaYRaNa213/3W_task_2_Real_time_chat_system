// server/src/utils/users.js
import Redis from "ioredis";

// Use your Redis URL directly
const REDIS_URL = "redis://default:m7tx77PBfE1AaO26VOxqXydJpHwyqJ1U@redis-17330.c61.us-east-1-3.ec2.redns.redis-cloud.com:17330";

const redis = new Redis(REDIS_URL, {
  retryStrategy(times) {
    console.error(`Redis retry attempt #${times}`);
    return Math.min(times * 50, 2000); // 50ms, 100ms, 150ms… max 2s
  },
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

const USER_PREFIX = "chat:user:";
const ROOM_PREFIX = "chat:room:";

// Store user in Redis
async function saveUser(user) {
  try {
    await redis.set(`${USER_PREFIX}${user.id}`, JSON.stringify(user));
    await redis.sadd(`${ROOM_PREFIX}${user.room}`, user.id);
  } catch (err) {
    console.error("❌ Redis saveUser error:", err);
  }
}

// Remove user from Redis
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

// Get all users in a room
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

// -------------------------
// Exported Functions
// -------------------------
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

// Export Redis instance if needed elsewhere
export { redis };
