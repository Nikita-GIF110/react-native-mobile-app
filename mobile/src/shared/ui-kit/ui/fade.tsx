import React from "react";
import { Animated } from "react-native";

interface FadeProps extends React.ComponentProps<typeof Animated.View> {
  visible: boolean;
}

export const Fade = ({ visible, children, style }: FadeProps) => {
  const opacity = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
};
