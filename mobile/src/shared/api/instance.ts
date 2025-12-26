import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { consoleTransport, logger } from "react-native-logs";
import { CONFIG } from "../config";

const log = logger.createLogger({
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
});

export const instance = () => {
  const deviceId = SecureStore.getItem(CONFIG.DEVICE_ID_KEY) ?? undefined;

  const axiosInstance = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Device-Id": deviceId,
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = SecureStore.getItem(CONFIG.TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      log.info({
        headers: config.headers,
        requestBody: {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          params: config.params,
        },
        data: config.method === "post" ? config.data : undefined,
      });
      return config;
    },
    (error) => {
      log.error(error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      log.error({
        status: error.response?.status,
        responseURL: error.response.request.responseURL,
      });

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await SecureStore.deleteItemAsync(CONFIG.TOKEN_KEY);

        delete axiosInstance.defaults.headers.common["Authorization"];
        if (originalRequest.headers) {
          delete originalRequest.headers["Authorization"];
        }
        return axiosInstance(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
