import { useAuthContext } from "@/src/entities/auth";
import { useFetchProfile } from "@/src/entities/user";
import {
  IconCounter,
  RatingCounter,
  UserAvatarImage,
} from "@/src/shared/ui-kit";
import { formatDate } from "@/src/shared/lib";
import { Appbar, PageTitle, SafeAreaView, Button } from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { RouteGuard } from "@/src/features/route-guard";

const defaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;

export const Profile = () => {
  const router = useRouter();
  const { logOut, isAuthorized } = useAuthContext();
  const { t } = useTranslation(["pages", "user", "buttons"]);
  const { user, isLoaded } = useFetchProfile(isAuthorized);

  return (
    <RouteGuard routeName="/(tabs)/profile">
      <SafeAreaView>
        <Appbar>
          <PageTitle>{t("profile_page.title", { ns: "pages" })}</PageTitle>
        </Appbar>

        <View style={{ gap: 8, paddingHorizontal: 16 }}>
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <UserAvatarImage
              source={user?.user_avatar?.profile_image ?? defaultAvatar}
              size={180}
              isLoading={!isLoaded}
            />

            <Text variant="headlineSmall" style={{ fontWeight: 700 }}>
              {user?.user_avatar.name}
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 400 }}>
              {t("user.account_created_at", {
                date: formatDate(user?.user.created_at),
                ns: "user",
              })}
            </Text>
          </View>

          <Button
            title={t("profile_products_page.title", { ns: "pages" })}
            onPress={() => router.push({ pathname: "/(no-tabs)/my-products" })}
            rightSlor={
              <IconCounter
                count={user?.user_avatar.rate ?? 0}
                icon="chevron-right"
              />
            }
            variant="surface"
            style={{ justifyContent: "space-between" }}
          />
          <Button
            title={t("user.rating", { ns: "user" })}
            variant="surface"
            style={{ justifyContent: "space-between" }}
            rightSlor={<RatingCounter count={user?.user_avatar.rate ?? 0} />}
          />
          <Button
            title={t("settings_page.title")}
            onPress={() => router.push({ pathname: "/(no-tabs)/settings" })}
            variant="surface"
            style={{ justifyContent: "space-between", marginBottom: 12 }}
            rightSlor="chevron-right"
          />
          <Button
            title={t("buttons.exit", { ns: "buttons" })}
            variant="error"
            onPress={logOut}
            style={{ justifyContent: "flex-start" }}
          />
        </View>
      </SafeAreaView>
    </RouteGuard>
  );
};
