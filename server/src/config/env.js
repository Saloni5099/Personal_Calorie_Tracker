import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  clientUrl: (process.env.CLIENT_URL ?? "http://localhost:5173").trim(),
  isProd: (process.env.NODE_ENV ?? "development") === "production",
  geminiApiKey: (process.env.GEMINI_API_KEY ?? "").trim(),
  geminiModel: (process.env.GEMINI_MODEL ?? "gemini-2.5-flash").trim(),
};
