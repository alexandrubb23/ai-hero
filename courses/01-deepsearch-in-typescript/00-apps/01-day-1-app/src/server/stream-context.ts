import Redis from "ioredis";
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream/ioredis";
import { env } from "~/env";

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      // Create separate Redis connections for publisher and subscriber
      // since Redis connections in subscriber mode can only use subscriber commands
      const subscriber = new Redis(env.REDIS_URL);
      const publisher = new Redis(env.REDIS_URL);

      globalStreamContext = createResumableStreamContext({
        keyPrefix: "resumable-stream",
        waitUntil: after,
        subscriber: subscriber,
        publisher: publisher,
      });
    } catch (error: any) {
      if (
        error.message.includes("REDIS_URL") ||
        error.message.includes("redisUrl")
      ) {
        console.log(
          " > Resumable streams are disabled due to missing/invalid REDIS_URL",
        );
      } else if (
        error.message.includes("already connecting") ||
        error.message.includes("already connected")
      ) {
        console.log(
          " > Resumable streams are disabled due to Redis connection conflict. Falling back to non-resumable streams.",
        );
        // Return null to disable resumable streams
        return null;
      } else if (error.message.includes("subscriber mode")) {
        console.log(
          " > Resumable streams are disabled due to Redis subscriber mode conflict. Falling back to non-resumable streams.",
        );
        return null;
      } else {
        console.error("Error creating resumable stream context:", error);
      }
      return null;
    }
  }

  return globalStreamContext;
}
