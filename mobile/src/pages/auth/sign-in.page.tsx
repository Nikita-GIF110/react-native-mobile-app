import { SignInForm } from "@/src/features/sign-in-form";
import {
  Appbar,
  AuthLayout,
  AuthPageLogo,
  BackActionButton,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  useAppTheme,
} from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View, Image } from "react-native";
import { Text } from "react-native-paper";

const logoUri = Image.resolveAssetSource(
  require("@/assets/images/logo-big.png")
).uri;

export const SignIn = () => {
  const router = useRouter();
  const { t } = useTranslation(["buttons", "pages"]);
  const { colors } = useAppTheme();

  const onPressBackButton = () => {
    if (!router.canGoBack()) {
      router.replace("/");
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView>
      <Appbar>
        <BackActionButton onPress={onPressBackButton} />
      </Appbar>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={{ flex: 1, gap: 8, paddingHorizontal: 16 }}>
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

          <SignInForm />

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
            onPress={() => router.push("/(auth)/registration")}
            title={t("buttons.registration", { ns: "buttons" })}
          />
        </View>
      </KeyboardAvoidingView>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(auth)/recover-password")}
        >
          <Text style={{ marginTop: "auto", color: colors.secondary }}>
            {t("buttons.forgot_password", { ns: "buttons" })}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
