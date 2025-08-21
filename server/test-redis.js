import Redis from "ioredis";

const redis = new Redis("redis://default:m7tx77PBfE1AaO26VOxqXydJpHwyqJ1U@redis-17330.c61.us-east-1-3.ec2.redns.redis-cloud.com:17330");

redis.on("connect", () => console.log("✅ Connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

(async () => {
  try {
    const pong = await redis.ping();
    console.log("PING response:", pong);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
})();
