import { TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import { CATEGORIES } from "@/src/shared/config";
import { FlatList, useAppTheme } from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

// const defaultCategoruImage = Image.resolveAssetSource(
//   // require("@/assets/images/category-placeholder.png")
// ).uri;

export const CategoriesList = () => {
  const router = useRouter();
  const { colors, borderRadius } = useAppTheme();
  const { t } = useTranslation("categories");

  return (
    <FlatList
      data={CATEGORIES}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      keyExtractor={(item) => item.value}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(home)/category/[id]",
              params: { id: item.value },
            })
          }
          style={{
            backgroundColor: colors.surface,
            paddingHorizontal: 12,
            paddingTop: 8,
            borderRadius: borderRadius.secondary,
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              color: colors.onSurface,
              marginBottom: 4,
              textAlign: "center",
              maxWidth: 120,
              opacity: 0.8,
            }}
            numberOfLines={1}
          >
            {t(item.label)}
          </Text>
          <Image
            source={{ uri: "item.image" }}
            resizeMode="cover"
            height={82}
            style={{ minWidth: 84 }}
          />
        </TouchableOpacity>
      )}
    />
  );
};
