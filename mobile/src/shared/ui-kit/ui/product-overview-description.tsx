import React from "react";
import { Text } from "react-native-paper";
import { useAppTheme } from "../models/theme.model";
import { View } from "react-native";

export const ProductOverviewDescription = ({
  price,
  condition,
  description,
  creationTime,
}: {
  price: string;
  condition: string;
  description: string;
  creationTime: string;
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Text
          variant="headlineMedium"
          style={{ fontWeight: 600, color: colors.onBackground }}
        >
          {price}
        </Text>
        <Text
          variant="bodyLarge"
          style={{ opacity: 0.8, color: colors.onBackground }}
        >
          {condition}
        </Text>
      </View>

      <Text
        variant="bodyLarge"
        style={{ color: colors.onBackground, opacity: 0.8 }}
      >
        {description}
      </Text>

      <Text
        variant="bodyMedium"
        style={{ color: colors.onBackground, opacity: 0.8 }}
      >
        {creationTime}
      </Text>
    </View>
  );
};
