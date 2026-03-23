import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://f63812b4c75510eff4c41ca7ab13d1a2@o4510968911626240.ingest.us.sentry.io/4510968940396544";

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
