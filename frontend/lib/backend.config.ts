const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;

export const BACKEND_URL = env?.VITE_BACKEND_URL;
