import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API is running on http://localhost:${PORT}`);
});
