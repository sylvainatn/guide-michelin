import rateLimit from "express-rate-limit";

// Brute-force protection sur l'authentification.
// Key par IP (derrière proxy : cf. `app.set("trust proxy", 1)` dans server.ts).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: {
      code: "too_many_requests",
      message: "Trop de tentatives. Réessaie dans quelques minutes.",
    },
  },
});

// Signup : protection plus agressive (fraud/farm d'accounts).
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: {
      code: "too_many_requests",
      message: "Trop d'inscriptions depuis cette adresse.",
    },
  },
});

// Rate limit global (soft) pour limiter les abus génériques sur l'API.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
