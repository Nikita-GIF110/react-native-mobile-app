import { useRouter } from "expo-router";
import { auth } from "@/src/shared/api/auth";
import type { RegistrationFormFields } from "@/src/shared/api/auth";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useRegisterUser = () => {
  const registUserEmailMutation = useMutation({
    mutationFn: auth.registration,
  });

  const onRegistration = async (fields: RegistrationFormFields) => {
    try {
      const { email, password, capcha_token, name } = fields;
      await registUserEmailMutation.mutateAsync({
        email,
        password,
        capcha_token,
        name,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during registration",
      });
    }
  };

  return {
    onRegistration,
    isPending: registUserEmailMutation.isPending,
  };
};

export const useValidateUserEmail = () => {
  const router = useRouter();

  const validateUserEmailMutation = useMutation({
    mutationFn: auth.validateUserEmail,
    onSuccess: () => {
      router.replace("/(auth)/sign-in");
    },
  });

  const onValidateUserEmail = async (fields: RegistrationFormFields) => {
    try {
      const { email, password, code, capcha_token } = fields;
      validateUserEmailMutation.mutate({
        email,
        password,
        code,
        capcha_token,
      });
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during email validation",
      });
    }
  };

  return {
    onValidateUserEmail,
    isPending: validateUserEmailMutation.isPending,
  };
};
