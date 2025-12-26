import React from "react";
import { Animated, Easing } from "react-native";

export const useShimmerAnimation = () => {
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    shimmerLoop.start();

    return () => shimmerLoop.stop();
  }, []);

  const shimmerInterpolation = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const shimmerStyle = { opacity: shimmerInterpolation };

  return shimmerStyle;
};
