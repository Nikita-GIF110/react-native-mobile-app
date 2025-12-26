import type { SignInFormFields } from "@/src/shared/api/auth";
import { signInSchema } from "@/src/shared/api/auth";
import { withTypes } from "react-final-form";
import { useSignIn } from "../model/sign-in.model";
import { useValidationSchema } from "@/src/shared/lib";
import {
  Button,
  FormPasswordFormTextInput,
  FormTextInput,
} from "@/src/shared/ui-kit";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const { Form } = withTypes<SignInFormFields>();
const INITIAL_VALUES = {
  email: "gungeranton@gmail.com",
  password: "123456789",
};

export const SignInForm = () => {
  const { onSignIn } = useSignIn();
  const schema = useValidationSchema(signInSchema);
  const { t } = useTranslation(["buttons", "forms"]);

  return (
    <Form onSubmit={onSignIn} initialValues={INITIAL_VALUES} validate={schema}>
      {({ handleSubmit, submitting, submitError, form }) => {
        const { invalid } = form.getState();
        const disabledSubmitButton = invalid || submitting;

        return (
          <View style={{ gap: 12, justifyContent: "center" }}>
            <FormTextInput
              name="email"
              placeholder={t("forms.input_email", { ns: "forms" })}
              autoCapitalize="none"
              textContentType="emailAddress"
              autoComplete="email"
              keyboardType="email-address"
              style={{ flex: 0 }}
            />
            <FormPasswordFormTextInput
              name="password"
              placeholder={t("forms.input_password", { ns: "forms" })}
              autoCapitalize="none"
              style={{ flex: 0 }}
            />

            {submitError && (
              <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                {submitError}
              </Text>
            )}

            <Button
              disabled={disabledSubmitButton}
              loading={submitting}
              onPress={handleSubmit}
              title={t("buttons.sign_in", { ns: "buttons" })}
              style={{ flex: 0 }}
              variant="secondary"
            />
          </View>
        );
      }}
    </Form>
  );
};
