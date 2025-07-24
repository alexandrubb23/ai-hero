import { google } from "@ai-sdk/google";

// OK!
export const model = google("gemini-2.0-flash-001", {
  cachedContent: "todo",
});

// Error!
export const model2 = google("gemini-2.0-flash-001", {});