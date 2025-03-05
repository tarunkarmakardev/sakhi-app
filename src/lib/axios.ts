import axios from "axios";
import { getEnv } from "./env";

const { NEXT_PUBLIC_API_BASE_URL } = getEnv();

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const { NEXT_PUBLIC_API_TOKEN } = getEnv();
  config.headers["API-KEY"] = NEXT_PUBLIC_API_TOKEN;
  return config;
});
