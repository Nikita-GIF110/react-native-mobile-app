import {
  CreateProductTabTrigger,
  TabBarBackground,
  TabTrigger,
} from "@/src/features/tab-triggers";
import { CONFIG } from "@/src/shared/config";
import { useSafeAreaInsets } from "@/src/shared/ui-kit";
import { LinearGradient } from "expo-linear-gradient";
import {
  Tabs,
  TabList,
  TabTrigger as ExpoRouterTabTrigger,
  TabSlot,
} from "expo-router/ui";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const TABS_MAP = [
  {
    name: "(home)",
    href: "/(tabs)/(home)",
    icon: "home",
    component: <TabTrigger icon="home" />,
  },
  {
    name: "liked-products",
    href: "liked-products",
    icon: "heart",
    component: <TabTrigger icon="heart" />,
  },
  {
    name: "chats",
    href: "/(tabs)/chats",
    icon: "message",
    component: <TabTrigger icon="message" />,
  },
  {
    name: "profile",
    href: "/(tabs)/profile",
    icon: "account",
    component: <TabTrigger icon="account" />,
  },
  {
    name: "create-product",
    href: "/(tabs)/create-product",
    icon: "account",
    component: <CreateProductTabTrigger />,
  },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />

      <TabList
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 1)", "transparent"]}
          start={{ x: 0, y: 0.9 }}
          end={{ x: 0, y: 0 }}
          style={[StyleSheet.absoluteFill]}
        />
        <TabBarBackground />

        {TABS_MAP.map((tab) => {
          return (
            <ExpoRouterTabTrigger
              key={tab.href}
              asChild
              name={tab.name}
              href={tab.href}
            >
              {tab.component}
            </ExpoRouterTabTrigger>
          );
        })}
      </TabList>
    </Tabs>
  );
}
