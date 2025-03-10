// Get API URL from environment variable, fallback to localhost if not set
export const API_URL =
  import.meta.env.ENV_MODE === "development"
    ? "https://api.omarcheivoire.ci"
    : "http://localhost:3000";
