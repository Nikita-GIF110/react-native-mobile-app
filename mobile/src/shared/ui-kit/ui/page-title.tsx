import React from "react";
import { useAppTheme } from "../models/theme.model";
import { Text } from "react-native-paper";

export const PageTitle = ({
  children,
  style,
  ...rest
}: { children: string } & React.ComponentProps<typeof Text>) => {
  const { colors } = useAppTheme();

  return (
    <Text
      {...rest}
      variant="headlineMedium"
      style={[{ color: colors.onSurface, fontWeight: 600 }, style]}
    >
      {children}
    </Text>
  );
};
