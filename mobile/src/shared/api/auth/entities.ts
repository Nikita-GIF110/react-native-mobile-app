export interface SignInFormFields {
  email: string;
  password: string;
}

export interface RegistrationFormFields {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  code: string;
  capcha_token: string;
}

export interface RecoverPasswordFormFields {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}
