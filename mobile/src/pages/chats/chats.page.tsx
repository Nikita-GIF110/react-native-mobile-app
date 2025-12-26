import { RouteGuard } from "@/src/features/route-guard";
import { CONFIG } from "@/src/shared/config";
import { Appbar, PageTitle, useSafeAreaInsets } from "@/src/shared/ui-kit";
import { ChatsList } from "@/src/widgets/chats-list";
import React from "react";
import { useTranslation } from "react-i18next";

export const Chats = () => {
  const { t } = useTranslation("pages");
  const i = useSafeAreaInsets();

  return (
    <RouteGuard routeName="/(tabs)/chats">
      <Appbar style={{ marginBottom: 8, marginTop: i.top }}>
        <PageTitle>{t("chats_page.title", { ns: "pages" })}</PageTitle>
      </Appbar>

      <ChatsList
        contentContainerStyle={{
          paddingBottom: i.bottom + CONFIG.TAB_LIST_HEIGHT + 16,
        }}
      />
    </RouteGuard>
  );
};
