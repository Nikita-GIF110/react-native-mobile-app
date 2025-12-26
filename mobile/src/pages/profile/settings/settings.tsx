import { CONFIG } from "@/src/shared/config";
import {
  Appbar,
  PageTitle,
  SafeAreaView,
  BackActionButton,
  Button,
  useSafeAreaInsets,
  SwitchButton,
  useBottomSheetModalRef,
} from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { BottomSheetEula } from "@/src/features/user-agreement";

export const Settings = () => {
  const i = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation("pages");
  const sheetModalRef = useBottomSheetModalRef();

  return (
    <>
      <SafeAreaView edges={["top"]}>
        <Appbar style={{ justifyContent: "flex-start" }}>
          <BackActionButton />
          <PageTitle>{t("settings_page.title", { ns: "pages" })}</PageTitle>
        </Appbar>

        <ScrollView
          contentContainerStyle={{
            gap: 32,
            paddingHorizontal: 16,
            paddingBottom: i.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Account settings */}
          <View style={{ gap: 8 }}>
            <Text variant="headlineSmall" style={{ fontWeight: 600 }}>
              {t("settings_page.account", { ns: "pages" })}
            </Text>
            <Button
              title={t("settings_change_name_page.title", { ns: "pages" })}
              rightSlor="chevron-right"
              onPress={() =>
                router.push({ pathname: "/(no-tabs)/settings/change-name" })
              }
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
            <Button
              title={t("settings_change_photo_page.title", { ns: "pages" })}
              rightSlor="chevron-right"
              onPress={() =>
                router.push({ pathname: "/(no-tabs)/settings/change-photo" })
              }
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
            <Button
              title={t("settings_change_password_page.title", { ns: "pages" })}
              rightSlor="chevron-right"
              onPress={() =>
                router.push({ pathname: "/(no-tabs)/settings/change-password" })
              }
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
          </View>

          {/* Other settings */}
          <View style={{ gap: 8 }}>
            <Text variant="headlineSmall" style={{ fontWeight: 600 }}>
              {t("settings_page.other", { ns: "pages" })}
            </Text>

            <SwitchButton
              title={t("settings_page.push_notifications", { ns: "pages" })}
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
            <SwitchButton
              title={t("settings_page.email", { ns: "pages" })}
              style={{ justifyContent: "space-between" }}
              variant="surface"
              active
            />
            <Button
              title={t("settings_page.user_agreement", { ns: "pages" })}
              rightSlor="chevron-right"
              onPress={() => sheetModalRef.current?.present()}
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
            <BottomSheetEula ref={sheetModalRef} />
          </View>

          {/* Support */}
          <View style={{ gap: 8 }}>
            <Text variant="headlineSmall" style={{ fontWeight: 600 }}>
              {t("settings_page.support")}
            </Text>

            <Button
              title="system@voidmk.com"
              style={{ justifyContent: "space-between" }}
              variant="surface"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
