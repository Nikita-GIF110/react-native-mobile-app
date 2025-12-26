import type {
  SignInFormFields,
  RegistrationFormFields,
  RecoverPasswordFormFields,
} from "./entities";
import { instance } from "../instance";

export const auth = {
  signIn: async (fields: SignInFormFields) => {
    return instance().post<{
      token: { access_token: string; token_type: string };
      tokenedUser: string;
    }>("/login/", fields);
  },
  registration: async (
    fields: Omit<
      RegistrationFormFields,
      "confirmPassword" | "code"
    >
  ) => {
    return instance().post<void>(`/register/`, fields);
  },
  validateUserEmail: async (
    fields: Omit<
      RegistrationFormFields,
      "confirmPassword" | "name"
    >
  ) => {
    return instance().post<{
      token: { access_token: string; token_type: string };
      userEmail: string;
    }>(`/register-verify/`, fields);
  },
  requestChangePassword: async (
    fields: Pick<RecoverPasswordFormFields, "email">
  ) => {
    return instance().post<{ isRequested: boolean; detail: string }>(
      "/user-request-reset-password/",
      fields
    );
  },
  resetUserPassword: async (
    fields: Omit<RecoverPasswordFormFields, "confirmPassword">
  ) => {
    return instance().post<{ isReset: boolean; detail: string }>(
      "/user-reset-password/",
      fields
    );
  },
};
