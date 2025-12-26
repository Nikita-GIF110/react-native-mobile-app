import { RouteGuard } from "@/src/features/route-guard";
import { CONFIG } from "@/src/shared/config";
import {
  Appbar,
  Button,
  PageTitle,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { ProfileProductsInfiniteList } from "@/src/widgets/product-list";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export const CreateProductIntro = () => {
  const i = useSafeAreaInsets();
  const { t } = useTranslation("pages");
  const router = useRouter();

  return (
    <RouteGuard routeName="/(tabs)/create-product">
      <Appbar style={{ marginTop: i.top }}>
        <PageTitle>
          {t("profile_products_page.title", { ns: "pages" })}
        </PageTitle>
      </Appbar>

      <ProfileProductsInfiniteList productStatus={1} />

      <View
        style={{
          paddingBottom: i.bottom + CONFIG.TAB_LIST_HEIGHT + 16,
          paddingHorizontal: 16,
        }}
      >
        <Button
          title={t("buttons.make_listing", { ns: "buttons" })}
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/(no-tabs)/create-product",
            })
          }
        />
      </View>
    </RouteGuard>
  );
};
