import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../models/theme.model";

const logoUri = Image.resolveAssetSource(
  require("../../../../assets/images/logo-small.png")
).uri;

export const Logo = () => {
  const { t } = useTranslation("common");
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: logoUri }}
        width={34}
        height={34}
        resizeMode="contain"
      />
      <View style={{ width: 40 }}>
        <Text
          variant="labelLarge"
          style={{
            fontWeight: 700,
            color: colors.tertiary,
            lineHeight: 14,
            marginBottom: -4,
          }}
          numberOfLines={2}
        >
          {t("common.our_company_name")}
        </Text>
      </View>
    </View>
  );
};
