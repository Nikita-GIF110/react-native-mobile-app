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
import { TouchableOpacity, View, Image } from "react-native";
import { useForm, useFormState, withTypes } from "react-final-form";
import type {
  RecoverPasswordFormFields,
  RegistrationFormFields,
} from "@/src/shared/api/auth";
import { recoverPasswordSchema } from "@/src/shared/api/auth";
import { useTimer, useValidationSchema } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";
import {
  useRequestChangePassword,
  useSendNewPassword,
} from "../model/recover-password.model";

const { Form } = withTypes<RecoverPasswordFormFields>();
const TIMER_COUNT = 899; // 899 -> 14:59 min

const logoUri = Image.resolveAssetSource(
  require("@/assets/images/logo-big.png")
).uri;

const RequestChangePasswordStep = () => {
  const { values, errors, touched } = useFormState<RecoverPasswordFormFields>();
  const { onNext } = useStepper();
  const { t } = useTranslation(["buttons", "forms"]);
  const { onSendRequestChangePassword, isPending } = useRequestChangePassword();
  const { colors } = useAppTheme();

  const onPressButton = async () => {
    await onSendRequestChangePassword(values);
    onNext();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ gap: 8, paddingHorizontal: 16, flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: logoUri }}
            width={34}
            height={34}
            resizeMode="cover"
          />
          <Text
            variant="titleMedium"
            style={{ fontWeight: 700, color: colors.tertiary }}
            numberOfLines={2}
          >
            {t("common.our_company_name", { ns: "common" })}
          </Text>
        </View>

        <FormTextInput
          name="email"
          placeholder={t("forms.input_email", { ns: "forms" })}
          autoCapitalize="none"
          textContentType="emailAddress"
          autoComplete="email"
          keyboardType="email-address"
          style={{ flex: 0 }}
        />

        <Button
          onPress={onPressButton}
          disabled={isPending || (errors?.email && touched?.email)}
          title={t("buttons.submit", { ns: "buttons" })}
          variant="secondary"
        />
      </View>
    </KeyboardAvoidingView>
  );
};
const ValidateEmailStep = () => {
  const { errors, touched, values } = useFormState<RecoverPasswordFormFields>();
  const { onNext } = useStepper();
  const { t } = useTranslation(["forms", "buttons"]);
  const { colors, borderRadius } = useAppTheme();
  const { onSendRequestChangePassword, isPending } = useRequestChangePassword();
  const timer = useTimer(TIMER_COUNT);

  React.useEffect(() => {
    timer.startTimer();
  }, []);

  const onPressButton = async () => {
    timer.resetTimer();
    await onSendRequestChangePassword(values);
    timer.startTimer();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ gap: 8, paddingHorizontal: 16, flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: logoUri }}
            width={34}
            height={34}
            resizeMode="cover"
          />
          <Text
            variant="titleMedium"
            style={{ fontWeight: 700, color: colors.tertiary }}
            numberOfLines={2}
          >
            {t("common.our_company_name", { ns: "common" })}
          </Text>
        </View>

        <FormTextInput
          name="code"
          placeholder={t("forms.input_code", { ns: "forms" })}
          autoCapitalize="none"
          inputMode="numeric"
          style={{ flex: 0 }}
        />

        <Button
          onPress={onNext}
          disabled={touched?.code && errors?.code}
          title={t("buttons.submit", { ns: "buttons" })}
          variant="secondary"
          style={{ flex: 0 }}
        />

        <TouchableOpacity
          onPress={onPressButton}
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
              email: values.email,
              time: timer.getFormatTimeLeft(),
              ns: "common",
            })}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const SendNewPasswordStep = () => {
  const { invalid } = useFormState<RegistrationFormFields>();
  const { submit } = useForm<RegistrationFormFields>();
  const { t } = useTranslation("common");

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
          title={t("buttons.submit", { ns: "buttons" })}
          variant="secondary"
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
    name: "userData",
    component: <RequestChangePasswordStep />,
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

export const RecoverPasswordStepper = () => {
  const { onSendNewPassword } = useSendNewPassword();
  const validate = useValidationSchema(recoverPasswordSchema);

  return (
    <Form onSubmit={onSendNewPassword} validate={validate}>
      {() => (
        <StepperProvider stepsLength={steps.length}>
          <StepsComponent />
        </StepperProvider>
      )}
    </Form>
  );
};
