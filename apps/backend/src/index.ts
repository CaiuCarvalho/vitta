import "dotenv/config";
import app from "./app";
import { validateEnv } from "./utils/env.validate";

// Valida as variáveis de ambiente antes de subir a aplicação
validateEnv();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API is running on http://localhost:${PORT}`);
});
