import { Animated, Dimensions } from "react-native";
import { Portal } from "react-native-paper";
import { useAppTheme } from "../models/theme.model";
import React, { ReactNode } from "react";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width;
const DRAWER_HEIGHT = height;
// const styles = StyleSheet.create({
//   drawer: {},
//   drawerStep: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     paddingHorizontal: 8,
//     gap: 8,
//   },
// });

export const Drawer = ({
  visible = false,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) => {
  const { colors } = useAppTheme();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (!visible) {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Portal>
      <Animated.View
        style={[
          {
            transform: [{ translateX }],
            flex: 1,
            backgroundColor: colors.background,
            position: "relative",
            width: DRAWER_WIDTH,
            height: DRAWER_HEIGHT,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Portal>
  );
};
export const useDrawer = () => {
  const [visible, setVisible] = React.useState(false);

  const onToggle = () => setVisible((v) => !v);

  return { visible, onToggle };
};
