import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

export const IconCounter = ({
  icon,
  count,
}: {
  icon: React.ComponentProps<typeof Icon>["source"];
  count: number;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      opacity: 0.6,
    }}
  >
    <Icon source={icon} size={24} />
    <Text variant="bodyLarge">{count.toLocaleString("ru-RU")}</Text>
  </View>
);
