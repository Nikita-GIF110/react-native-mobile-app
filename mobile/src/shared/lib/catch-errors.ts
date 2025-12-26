import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export const handelServerIssue = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status && status >= 400) {
      const detail = error.response?.data.detail;
      return Toast.show({type: "error", text1: detail });
    }
  }
};

export const handelErrorDetail = (error: unknown, message?: string) => {
  if (error instanceof AxiosError) {
    const detail = error.response?.data.detail || message;
    return Toast.show({ type: "error", text1: detail });
  }
};
