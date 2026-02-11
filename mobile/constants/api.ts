const DEV_API_BASE_URL = "http://192.168.3.6:3333/api";

const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = (envApiBaseUrl || DEV_API_BASE_URL).replace(
  /\/$/,
  "",
);

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
