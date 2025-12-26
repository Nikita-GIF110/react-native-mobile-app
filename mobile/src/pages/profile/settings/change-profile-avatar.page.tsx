import { useChangeUserAvatar, useFetchProfileData } from "@/src/entities/user";
import {
  changeUserAvatarSchema,
  UserChangAvatarFormFields,
} from "@/src/shared/api/user";
import { useValidationSchema } from "@/src/shared/lib";
import {
  Appbar,
  PageTitle,
  SafeAreaView,
  BackActionButton,
  FormImagePicker,
  Button,
  hexToRgba,
  useAppTheme,
  UserAvatarImage,
} from "@/src/shared/ui-kit";
import { withTypes } from "react-final-form";
import { useTranslation } from "react-i18next";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

const { Form } = withTypes<UserChangAvatarFormFields>();

const defaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;

export const ChangeProfileAvatar = () => {
  const { t } = useTranslation(["buttons", "pages"]);
  const { user } = useFetchProfileData();
  const validate = useValidationSchema(changeUserAvatarSchema);
  const { onChangeUserAvatar, isPending } = useChangeUserAvatar();
  const { colors } = useAppTheme();

  const userName = user?.user_avatar.name ?? "";
  const avatarSourse = {
    uri: user?.user_avatar.profile_image ?? defaultAvatar,
    name: userName,
    type: "",
  };

  return (
    <SafeAreaView>
      <Appbar>
        <BackActionButton />
        <PageTitle>
          {t("settings_change_photo_page.title", { ns: "pages" })}
        </PageTitle>
      </Appbar>

      <Form
        onSubmit={onChangeUserAvatar}
        initialValues={{ picture: [avatarSourse] }}
        validate={validate}
      >
        {({ handleSubmit, pristine, invalid }) => {
          return (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 16,
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <FormImagePicker
                  name="picture"
                  pickerOptions={{
                    selectionLimit: 1,
                    allowsMultipleSelection: false,
                  }}
                >
                  {({ pickImage, images }) => (
                    <>
                      {images &&
                        images.map((image) => (
                          <TouchableOpacity
                            key={image.uri}
                            activeOpacity={0.8}
                            style={{ position: "relative" }}
                            onPress={pickImage}
                          >
                            <UserAvatarImage source={image.uri} size={240} />

                            <View
                              style={[
                                StyleSheet.absoluteFill,
                                {
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: hexToRgba("#000000", 0.6),
                                  borderRadius: "50%",
                                },
                              ]}
                            >
                              <Icon
                                size={60}
                                source="camera-outline"
                                color={colors.surface}
                              />
                            </View>
                          </TouchableOpacity>
                        ))}
                    </>
                  )}
                </FormImagePicker>
              </View>

              <Button
                disabled={isPending || pristine || invalid}
                loading={isPending}
                onPress={handleSubmit}
                title={t("buttons.submit", { ns: "buttons" })}
                variant="secondary"
              />
            </View>
          );
        }}
      </Form>
    </SafeAreaView>
  );
};
