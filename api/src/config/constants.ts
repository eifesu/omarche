export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
