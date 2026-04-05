const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export const getAllowedOrigins = () => {
  const configuredOrigins = String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins.length ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS;
};

export const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(origin);
};
