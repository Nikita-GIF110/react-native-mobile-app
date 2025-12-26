import { useChangeUserName, useFetchProfileData } from "@/src/entities/user";
import { UserChangeNameFormFields } from "@/src/shared/api/user";
import { changeUserNameSchema } from "@/src/shared/api/user";
import { useValidationSchema } from "@/src/shared/lib";
import {
  Appbar,
  PageTitle,
  SafeAreaView,
  BackActionButton,
  Button,
  KeyboardAvoidingView,
  FormTextInput,
} from "@/src/shared/ui-kit";
import { withTypes } from "react-final-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const { Form } = withTypes<UserChangeNameFormFields>();

export const ChangeProfileName = () => {
  const { t } = useTranslation(["pages", "forms", "buttons"]);
  const { onChangeUserName, isPending } = useChangeUserName();
  const { user } = useFetchProfileData();
  const validate = useValidationSchema(changeUserNameSchema);

  return (
    <SafeAreaView>
      <Appbar style={{ justifyContent: "flex-start" }}>
        <BackActionButton />
        <PageTitle>
          {t("settings_change_name_page.title", { ns: "pages" })}
        </PageTitle>
      </Appbar>

      <Form
        onSubmit={onChangeUserName}
        initialValues={{ new_name: user?.user_avatar.name }}
        validate={validate}
      >
        {({ handleSubmit, pristine, invalid }) => (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 16,
              justifyContent: "space-between",
            }}
          >
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <FormTextInput
                  name="new_name"
                  placeholder={t("forms.input_name", { ns: "forms" })}
                  style={{ flex: 0 }}
                />
              </View>
            </KeyboardAvoidingView>

            <Button
              disabled={isPending || pristine || invalid}
              loading={isPending}
              onPress={handleSubmit}
              title={t("buttons.submit", { ns: "buttons" })}
              variant="secondary"
            />
          </View>
        )}
      </Form>
    </SafeAreaView>
  );
};
