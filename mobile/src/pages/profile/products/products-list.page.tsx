import { SwipeableTabView } from "@/src/features/swipeable-tab-view";
import {
  Appbar,
  BackActionButton,
  Button,
  PageTitle,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { ProfileProductsInfiniteList } from "@/src/widgets/product-list";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const TABS: {
  label: string;
  component: React.ReactNode;
}[] = [
  {
    label: "profile_products_page.tab_opened",
    component: <ProfileProductsInfiniteList productStatus={1} />,
  },
  {
    label: "profile_products_page.tab_hidden",
    component: <ProfileProductsInfiniteList productStatus={2} />,
  },
  {
    label: "profile_products_page.tab_sold",
    component: <ProfileProductsInfiniteList productStatus={3} />,
  },
];

export const ProfileProducts = () => {
  const i = useSafeAreaInsets();
  const { t } = useTranslation("pages");

  return (
    <>
      <Appbar style={{ marginTop: i.top, justifyContent: "flex-start" }}>
        <BackActionButton />
        <PageTitle>
          {t("profile_products_page.title", { ns: "pages" })}
        </PageTitle>
      </Appbar>

      <SwipeableTabView
        tabslist={TABS}
        renderTab={(item, isActive, index, handleTabPress) => (
          <Button
            key={item.label}
            title={t(item.label, { ns: "pages" })}
            active={isActive}
            variant="surface"
            size="md"
            style={{ flex: 1 }}
            onPress={() => handleTabPress(index)}
          />
        )}
        renderTabContent={(activeTabIndex) => (
          <View style={{ width: WINDOW_WIDTH, height: "100%" }}>
            {TABS[activeTabIndex].component}
          </View>
        )}
      />
    </>
  );
};
