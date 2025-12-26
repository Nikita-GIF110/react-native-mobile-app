import { object, string, ObjectSchema, ref } from "yup";
import type {
  SignInFormFields,
  RegistrationFormFields,
  RecoverPasswordFormFields,
} from "./entities";

export const signInSchema: ObjectSchema<SignInFormFields> = object({
  email: string().email("Enter correct email").required("Required field"),
  password: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field"),
});

export const registrationSchema: ObjectSchema<RegistrationFormFields> = object({
  email: string().email("Enter correct email").required("Required field"),
  password: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field"),
  confirmPassword: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field")
    .oneOf([ref("password")], "Passwords must match"),
  name: string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters")
    .required("Name is required"),
  code: string().length(4, "Required 4 symbols").required("Required field"),
  capcha_token: string().required(""),
});

export const recoverPasswordSchema: ObjectSchema<
  Pick<RecoverPasswordFormFields, "email">
> = object({
  email: string().email("Enter correct email").required("Required field"),
  code: string().length(4, "Required 4 symbols").required("Required field"),
  password: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field"),
  confirmPassword: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field")
    .oneOf([ref("password")], "Passwords must match"),
});

export const changeProfilePasswordSchema: ObjectSchema<
  Pick<RecoverPasswordFormFields, "password" | "confirmPassword" | "code">
> = object({
  code: string().length(4, "Required 4 symbols").required("Required field"),
  password: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field"),
  confirmPassword: string()
    .min(9, "Required minumum 9 symbols")
    .required("Required field")
    .oneOf([ref("password")], "Passwords must match"),
});
