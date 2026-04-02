import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// ── Security Headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://agonimports.com",
      "https://www.agonimports.com"
    ],
    credentials: true,
  })
);

// ── Body Parser with Size Limit ──────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ── Rate Limiting on Login ───────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: "fail", message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", loginLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use(router);

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
