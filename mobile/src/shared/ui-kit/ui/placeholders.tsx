import React from "react";
import { View, ViewProps } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "../models/theme.model";

export const ContentPlaceholder = ({
  header,
  subHeader,
  body,
  style,
}: ViewProps & {
  header?: string;
  subHeader?: string;
  body?: React.ReactNode;
}) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          gap: 8,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text variant="displaySmall" style={{ color: colors.onBackground }}>
        {header}
      </Text>
      <Text style={{ color: colors.onBackground, textAlign: "center" }}>
        {subHeader}
      </Text>

      {body}
    </View>
  );
};
export const LoadingPlaceholder = ({ style, ...rest }: ViewProps) => {
  return (
    <View
      style={[
        {
          gap: 8,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...rest}
    >
      <ActivityIndicator animating size={34} />
    </View>
  );
};
