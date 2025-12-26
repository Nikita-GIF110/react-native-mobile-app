import { View, Animated, StyleSheet } from "react-native";
import React from "react";

export const Appbar = ({
  style,
  ...props
}: React.ComponentProps<typeof View>) => {
  return (
    <View
      style={[
        {
          // gap: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // paddingVertical: 8,
          paddingHorizontal: 16,
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
  },
  component: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    justifyContent: "center",
  },
});
export const AnimatedHeaderSwitcher = ({
  firstComponent,
  secondComponent,
  scrollY,
  threshold = 50,
  height,
}: {
  firstComponent: React.ReactNode;
  secondComponent: React.ReactNode;
  scrollY: Animated.Value;
  /** Порог скролла для начала анимации */
  threshold?: number;
  /** Высота шапки */
  height: number;
}) => {
  const firstOpacity = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const secondOpacity = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View
        style={[styles.component, { height }, { opacity: firstOpacity }]}
      >
        {firstComponent}
      </Animated.View>

      <Animated.View
        style={[styles.component, { height }, { opacity: secondOpacity }]}
      >
        {secondComponent}
      </Animated.View>
    </View>
  );
};
