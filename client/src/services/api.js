import axios from "axios";

const RAW_URL = import.meta.env.VITE_API_URL || "https://elegant-home-decor.onrender.com/api";

const ensureApiSuffix = (url) => {
  const trimmed = url.replace(/\/+$/, "");
  if (!trimmed.endsWith("/api")) return `${trimmed}/api`;
  return trimmed;
};

const baseURL = ensureApiSuffix(RAW_URL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("ehd_user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  const fullUrl = [config.baseURL, config.url].filter(Boolean).join("");
  console.log(`[api] ${config.method?.toUpperCase()} ${fullUrl}`);

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const fullUrl = [err.config?.baseURL, err.config?.url].filter(Boolean).join("");
    console.error(`[api] FAILED ${err.config?.method?.toUpperCase()} ${fullUrl} → ${err.response?.status}`, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
