import {
  Appbar,
  PageTitle,
  SafeAreaView,
  BackActionButton,
} from "@/src/shared/ui-kit";
import { ChangeProfilePasswordStepper } from "@/src/widgets/change-profile-password-stepper";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export const ChangeProfilePassword = () => {
  const { t } = useTranslation("pages");

  return (
    <SafeAreaView>
      <Appbar style={{ justifyContent: "flex-start" }}>
        <BackActionButton />
        <PageTitle>
          {t("settings_change_password_page.title", { ns: "pages" })}
        </PageTitle>
      </Appbar>

      <View style={{ flex: 1 }}>
        <ChangeProfilePasswordStepper />
      </View>
    </SafeAreaView>
  );
};
