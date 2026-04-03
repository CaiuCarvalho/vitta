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
      "https://www.agonimports.com",
    ],
    credentials: true,
  })
);

// ── Body Parser with Size Limit ──────────────────────────────
app.use(
  express.json({
    limit: "10kb",
    // Captura o raw body para validação de assinaturas HMAC em webhooks
    verify: (req: any, _res, buf) => {
      if (req.originalUrl?.includes("/api/webhooks")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// ── Rate Limiting ─────────────────────────────────────────────
// Item 21: Rate limit aplicado nas rotas críticas: login e checkout

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    status: "fail",
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: {
    status: "fail",
    message: "Muitas requisições de checkout. Aguarde 1 minuto e tente novamente.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limit nas rotas críticas
app.use("/api/auth/login", loginLimiter);
app.use("/api/payment/checkout", checkoutLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use(router);

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
