import { useRouter } from "expo-router";
import { auth } from "@/src/shared/api/auth";
import type { RecoverPasswordFormFields } from "@/src/shared/api/auth";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { FORM_ERROR } from "final-form";

export const useRequestChangePassword = () => {
  const requestChangePasswordMutation = useMutation({
    mutationFn: auth.requestChangePassword,
    onSuccess: (res) => {
      Toast.show({
        type: "success",
        text1: res.data.detail,
      });
    },
  });

  const onSendRequestChangePassword = async (
    fields: RecoverPasswordFormFields
  ) => {
    try {
      await requestChangePasswordMutation.mutateAsync({ email: fields.email });
      Toast.show({
        text1: "The code has been sent to mail",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during request tot change password",
      });
    }
  };

  return {
    onSendRequestChangePassword,
    isPending: requestChangePasswordMutation.isPending,
  };
};

export const useSendNewPassword = () => {
  const router = useRouter();
  const sendNewPasswordMutation = useMutation({
    mutationFn: auth.resetUserPassword,
    onSuccess: (res) => {
      Toast.show({
        type: "success",
        text1: res.data.detail,
      });
    },
  });

  const onSendNewPassword = async (fields: RecoverPasswordFormFields) => {
    try {
      await sendNewPasswordMutation.mutateAsync({
        code: fields.code,
        email: fields.email,
        password: fields.password,
      });
      return router.replace({ pathname: "/(auth)/sign-in" });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during reset password",
      });
    }
  };

  return {
    onSendNewPassword,
    isPending: sendNewPasswordMutation.isPending,
  };
};
