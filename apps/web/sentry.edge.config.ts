// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f63812b4c75510eff4c41ca7ab13d1a2@o4510968911626240.ingest.us.sentry.io/4510968940396544",

  // Sample rate should be lower in production (e.g., 0.1 for 10%)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Disable automatic PII collection for privacy compliance
  // Enable selectively if needed with proper data handling policies
  sendDefaultPii: false,
});
