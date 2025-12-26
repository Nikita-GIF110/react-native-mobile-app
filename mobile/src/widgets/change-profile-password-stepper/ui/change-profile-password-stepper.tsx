import React from "react";
import {
  FormTextInput,
  useAppTheme,
  hexToRgba,
  FormPasswordFormTextInput,
} from "@/src/shared/ui-kit";
import {
  Button,
  KeyboardAvoidingView,
  StepperProvider,
  useStepper,
} from "@/src/shared/ui-kit";
import { Text } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import { useForm, useFormState, withTypes } from "react-final-form";
import type {
  RecoverPasswordFormFields,
  RegistrationFormFields,
} from "@/src/shared/api/auth";
import { changeProfilePasswordSchema } from "@/src/shared/api/auth";
import { useTimer, useValidationSchema } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";
import {
  useRequestChangePassword,
  useSendNewPassword,
} from "../model/change-profile-password.model";
import { useAuthContext } from "@/src/entities/auth";
import Toast from "react-native-toast-message";

const { Form } = withTypes<RecoverPasswordFormFields>();
const TIMER_COUNT = 899; // 899 -> 14:59 min

const SendCodeStep = () => {
  const { onNext } = useStepper();
  const { t } = useTranslation(["buttons", "pages"]);
  const { onSendRequestChangePassword, isPending } = useRequestChangePassword();
  const { values } = useFormState<RecoverPasswordFormFields>();
  const { userData } = useAuthContext();

  const onSendCod = async () => {
    if (!values.email) {
      Toast.show({ type: "error", text1: "Something wrong" });
      return;
    }
    await onSendRequestChangePassword(values.email);
    onNext();
  };

  return (
    <View style={{ gap: 8, paddingHorizontal: 16, flex: 1 }}>
      <Text
        variant="titleMedium"
        style={{ marginVertical: "auto", textAlign: "center" }}
      >
        {t("settings_change_password_page.code_message_text", {
          ns: "pages",
          userEmail: userData.email,
        })}
      </Text>

      <Button
        onPress={onSendCod}
        disabled={isPending}
        title={t("buttons.submit", { ns: "buttons" })}
        variant="secondary"
      />
    </View>
  );
};
const ValidateEmailStep = () => {
  const { errors, touched, values } = useFormState<RecoverPasswordFormFields>();
  const { onNext } = useStepper();
  const { t } = useTranslation(["forms", "buttons", "common"]);
  const timer = useTimer(TIMER_COUNT);
  const { colors, borderRadius } = useAppTheme();
  const { onSendRequestChangePassword, isPending } = useRequestChangePassword();
  const { userData } = useAuthContext();

  React.useEffect(() => {
    timer.startTimer();
  }, []);

  const onSendCodeAgain = async () => {
    timer.resetTimer();
    await onSendRequestChangePassword(values.email);
    timer.startTimer();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ gap: 8, paddingHorizontal: 16, flex: 1 }}>
        <FormTextInput
          name="code"
          placeholder={t("forms.input_code", { ns: "forms" })}
          autoCapitalize="none"
          inputMode="numeric"
          style={{ flex: 0 }}
        />

        <TouchableOpacity
          onPress={onSendCodeAgain}
          disabled={
            isPending ||
            timer.getFormatTimeLeft() !== timer.formatTime(TIMER_COUNT)
          }
          style={{
            backgroundColor: hexToRgba(colors.tertiary, 0.2),
            padding: 8,
            paddingHorizontal: 16,
            borderRadius: borderRadius.secondary,
          }}
        >
          <Text variant="bodyMedium">
            {t("common.code_was_sent_by_email", {
              email: userData.email,
              time: timer.getFormatTimeLeft(),
              ns: "common",
            })}
          </Text>
        </TouchableOpacity>

        <Button
          onPress={onNext}
          disabled={touched?.code && errors?.code}
          title={t("buttons.validate_email", { ns: "buttons" })}
          variant="secondary"
          style={{ marginTop: "auto" }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
const SendNewPasswordStep = () => {
  const { invalid } = useFormState<RegistrationFormFields>();
  const { submit } = useForm<RegistrationFormFields>();
  const { t } = useTranslation(["forms", "buttons"]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ gap: 8, paddingHorizontal: 16, flex: 1 }}>
        <FormPasswordFormTextInput
          name="password"
          placeholder={t("forms.input_password", { ns: "forms" })}
          autoCapitalize="none"
          style={{ flex: 0 }}
        />
        <FormPasswordFormTextInput
          name="confirmPassword"
          placeholder={t("forms.input_confirm_password", { ns: "forms" })}
          autoCapitalize="none"
          style={{ flex: 0 }}
        />

        <Button
          onPress={submit}
          disabled={invalid}
          title={t("buttons.validate_email", { ns: "buttons" })}
          variant="secondary"
          style={{ marginTop: "auto" }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export const steps: {
  name: string;
  component: React.ReactNode;
}[] = [
  {
    name: "sendCode",
    component: <SendCodeStep />,
  },
  {
    name: "validateEmail",
    component: <ValidateEmailStep />,
  },
  {
    name: "sendNewPassword",
    component: <SendNewPasswordStep />,
  },
];

const StepsComponent = () => {
  const { activeStepIndex } = useStepper();
  return steps[activeStepIndex].component;
};

export const ChangeProfilePasswordStepper = () => {
  const { onSendNewPassword } = useSendNewPassword();
  const validate = useValidationSchema(changeProfilePasswordSchema);
  const { userData } = useAuthContext();
  const useEmail = userData.email ?? "";

  return (
    <Form
      onSubmit={onSendNewPassword}
      validate={validate}
      initialValues={{ email: useEmail }}
    >
      {() => (
        <StepperProvider stepsLength={steps.length}>
          <StepsComponent />
        </StepperProvider>
      )}
    </Form>
  );
};
