import type { SignInFormFields } from "@/src/shared/api/auth";
import { auth } from "@/src/shared/api/auth";
import { OnSubmitForm } from "@/src/shared/types";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/src/entities/auth";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { CONFIG } from "@/src/shared/config";

export const useSignIn = () => {
  const { setUserData } = useAuthContext();

  const router = useRouter();
  const queryClient = useQueryClient();

  const onSignIn: OnSubmitForm<SignInFormFields> = async (fields, form) => {
    try {
      const response = await auth.signIn(fields);

      SecureStore.setItem(CONFIG.EMAIL_KEY, response.data.tokenedUser);
      SecureStore.setItem(CONFIG.TOKEN_KEY, response.data.token?.access_token);

      setUserData({
        email: response.data.tokenedUser,
        token: response.data.token?.access_token,
      });

      queryClient.clear();
      router.replace("/(tabs)/(home)");
    } catch (error) {
      Toast.show({
        text1: "Error during sign in",
        type: "error",
      });
    }
  };

  return {
    onSignIn,
  };
};
