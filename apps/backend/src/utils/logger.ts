import winston from "winston";

// Configuração profissional de logs para produção/desenvolvimento
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "vitta-backend" },
  transports: [
    // Escreve erros no arquivo para persistência
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Escreve todos os logs no arquivo combinado
    new winston.transports.File({ filename: "logs/combined.log" }),
    // Em desenvolvimento, loga no console com cores
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;
