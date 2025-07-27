import { Langfuse } from "langfuse";
import { env } from "~/env";

// Create a singleton Langfuse client
let langfuseInstance: Langfuse | null = null;

export function getLangfuse(): Langfuse | null {
  // Return null if Langfuse is not configured
  if (!env.LANGFUSE_SECRET_KEY || !env.LANGFUSE_PUBLIC_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.log("Langfuse not configured. Tracing disabled.");
    }
    return null;
  }

  if (!langfuseInstance) {
    langfuseInstance = new Langfuse({
      secretKey: env.LANGFUSE_SECRET_KEY,
      publicKey: env.LANGFUSE_PUBLIC_KEY,
      baseUrl: env.LANGFUSE_BASEURL || "https://cloud.langfuse.com",
    });
  }

  return langfuseInstance;
}

// Helper function to safely shut down Langfuse
export async function shutdownLangfuse() {
  if (langfuseInstance) {
    await langfuseInstance.shutdownAsync();
  }
}
