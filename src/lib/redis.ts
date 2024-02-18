import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://eu2-topical-jackal-32597.upstash.io",
  token: process.env.REDIS_KEY!,
});
