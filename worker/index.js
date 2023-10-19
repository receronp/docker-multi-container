import keys from "./keys.js";
import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

const sub = redisClient.duplicate();
sub.on("error", (err) => console.error(err));
await sub.connect();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

await sub.subscribe("insert", async (message) => {
  await redisClient.hSet("values", message, fib(parseInt(message)));
});
