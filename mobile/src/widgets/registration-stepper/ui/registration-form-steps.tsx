import React from "react";
import {
  FormTextInput,
  FormPasswordInput,
  useAppTheme,
  useBottomSheetModalRef,
  hexToRgba,
  FormPasswordFormTextInput,
} from "@/src/shared/ui-kit";
import {
  Button,
  CaptchaFormField,
  KeyboardAvoidingView,
  StepperProvider,
  useSafeAreaInsets,
  useStepper,
} from "@/src/shared/ui-kit";
// import { FormCheckbox } from "@/src/shared/ui/checkbox";
// import { useUserAgreementSheet } from "@/src/entities/user";
import { Text } from "react-native-paper";
import { TouchableOpacity, View, Image } from "react-native";
import { useForm, useFormState, withTypes } from "react-final-form";
import type { RegistrationFormFields } from "@/src/shared/api/auth";
import { registrationSchema } from "@/src/shared/api/auth";
import { sleep, useTimer, useValidationSchema } from "@/src/shared/lib";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { useTranslation, Trans } from "react-i18next";
import {
  useRegisterUser,
  useValidateUserEmail,
} from "../model/registration.model";
import { BottomSheetEula } from "@/src/features/user-agreement";
import { useRouter } from "expo-router";

const { Form } = withTypes<RegistrationFormFields>();
const INITIAL_VALUES: Partial<RegistrationFormFields> = {
  email: "gungeranton@gmail.com",
  password: "123456789",
  confirmPassword: "123456789",
  name: "Eba bot",
};
const TIMER_COUNT = 899; // 899 -> 14:59 min

const logoUri = Image.resolveAssetSource(
  require("@/assets/images/logo-big.png")
).uri;

const UserDataStep = () => {
  const { values } = useFormState<RegistrationFormFields>();
  const { onNext } = useStepper();
  const { t } = useTranslation(["buttons", "forms", "pages"]);
  const { onRegistration, isPending } = useRegisterUser();
  const { colors } = useAppTheme();
  const router = useRouter();

  const captchaRef = React.useRef<ConfirmHcaptcha | null>(null);
  const sheetModalRef = useBottomSheetModalRef();

  const onPressButton = async () => {
    if (!values.capcha_token) {
      captchaRef.current?.show();
      return;
    }
    await onRegistration(values);
    onNext();
  };

  React.useEffect(() => {
    if (values.capcha_token) {
      onNext();
    }
  }, [values]);

  return (
    <KeyboardAvoidingView>
      <View style={{ gap: 8, paddingHorizontal: 16 }}>
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

        <FormTextInput
          name="name"
          placeholder={t("forms.input_name", { ns: "forms" })}
          autoCapitalize="none"
          style={{ flex: 0 }}
        />

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

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => sheetModalRef.current?.present()}
        >
          <Text
            style={{
              color: hexToRgba(colors.primary, 0.6),
              paddingHorizontal: 8,
              marginBottom: 4,
              maxWidth: "85%",
            }}
            variant="titleSmall"
          >
            {t("auth_page.terms_of_service", { ns: "pages" })}
          </Text>
        </TouchableOpacity>
        <BottomSheetEula ref={sheetModalRef} />

        <Button
          disabled={isPending}
          onPress={onPressButton}
          title={t("buttons.registration", { ns: "buttons" })}
          style={{ flex: 0 }}
          variant="secondary"
        />
        <CaptchaFormField name="capcha_token" ref={captchaRef} />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: "30%",
              height: 2,
              backgroundColor: colors.primary,
              opacity: 0.1,
            }}
          />
          <Text>{t("auth_page.or", { ns: "pages" })}</Text>
          <View
            style={{
              width: "30%",
              height: 2,
              backgroundColor: colors.primary,
              opacity: 0.1,
            }}
          />
        </View>

        <Button
          onPress={router.back}
          title={t("buttons.sign_in", { ns: "buttons" })}
          style={{ flex: 0 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
const ValidateUserEmailStep = () => {
  const { invalid, values } = useFormState<RegistrationFormFields>();
  const { submit } = useForm<RegistrationFormFields>();
  const { t } = useTranslation(["forms", "buttons"]);
  const timer = useTimer(TIMER_COUNT);
  const { colors, borderRadius } = useAppTheme();
  const { onRegistration, isPending } = useRegisterUser();

  React.useEffect(() => {
    timer.startTimer();
  }, []);

  const onPressButton = async () => {
    timer.resetTimer();
    await onRegistration(values);
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

        <Button
          onPress={submit}
          disabled={invalid}
          title={t("buttons.validate_email", { ns: "buttons" })}
          variant="secondary"
          style={{ flex: 0, marginBottom: 8 }}
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

export const steps: {
  name: string;
  component: React.ReactNode;
}[] = [
  {
    name: "userData",
    component: <UserDataStep />,
  },
  {
    name: "validateEmail",
    component: <ValidateUserEmailStep />,
  },
];

const StepsComponent = () => {
  const { activeStepIndex } = useStepper();
  return steps[activeStepIndex].component;
};

export const RegistrationStepper = () => {
  const { onValidateUserEmail } = useValidateUserEmail();
  const validate = useValidationSchema(registrationSchema);

  return (
    <Form
      onSubmit={onValidateUserEmail}
      validate={validate}
      initialValues={INITIAL_VALUES}
    >
      {() => (
        <StepperProvider stepsLength={steps.length}>
          <StepsComponent />
        </StepperProvider>
      )}
    </Form>
  );
};
