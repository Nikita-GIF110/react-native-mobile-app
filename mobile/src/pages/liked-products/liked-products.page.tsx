import { RouteGuard } from "@/src/features/route-guard";
import { CONFIG } from "@/src/shared/config";
import { PageTitle, Appbar, useSafeAreaInsets } from "@/src/shared/ui-kit";

import { LikedProductsInfiniteList } from "@/src/widgets/product-list";
import React from "react";
import { useTranslation } from "react-i18next";

export const LikedProducts = () => {
  const { t } = useTranslation("pages");
  const i = useSafeAreaInsets();

  return (
    <RouteGuard routeName="/(tabs)/liked-products">
      <Appbar style={{ marginBottom: 8, marginTop: i.top }}>
        <PageTitle>{t("liked_products_page.title", { ns: "pages" })}</PageTitle>
      </Appbar>

      <LikedProductsInfiniteList
        contentContainerStyle={{
          paddingBottom: i.bottom + CONFIG.TAB_LIST_HEIGHT + 16,
        }}
      />
    </RouteGuard>
  );
};
