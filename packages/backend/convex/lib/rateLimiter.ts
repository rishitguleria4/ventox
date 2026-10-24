import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "../_generated/api";

// Cast handles the window before `convex dev` regenerates `components.rateLimiter`
const rateLimiterComponent = (
  components as unknown as {
    rateLimiter: ConstructorParameters<typeof RateLimiter>[0];
  }
).rateLimiter;

export const rateLimiter = new RateLimiter(rateLimiterComponent, {
  // Per visitor session: bursts of 5, refills 20/min
  widgetMessage: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },
  // Per organization: new visitor sessions
  contactSessionCreate: {
    kind: "fixed window",
    rate: 300,
    period: HOUR,
  },
  // Per organization: dashboard file uploads and AI draft enhancements
  fileUpload: {
    kind: "fixed window",
    rate: 50,
    period: HOUR,
  },
  enhanceDraft: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 10,
  },
});

