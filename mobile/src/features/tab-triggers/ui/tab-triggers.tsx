import { useAppTheme } from "@/src/shared/ui-kit";
import { TabTriggerSlotProps } from "expo-router/ui";
import React from "react";
import { Pressable, View, Dimensions, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCreateProductLink } from "../model/create-product-link.model";
import { useRouter } from "expo-router";
import { CONFIG } from "@/src/shared/config";

const { width } = Dimensions.get("window");

const WINDOW_WIDTH = width - 32;

const TAB_ICON_SIZE = 32;
const TAB_ITEM_WIDTH = (WINDOW_WIDTH - 32) / 5;
const TABS_BACKGROUND_WIDTH = TAB_ITEM_WIDTH * 4 + 32;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TabTrigger = React.forwardRef<
  View,
  TabTriggerSlotProps & { icon: unknown }
>(function TabTrigger({ isFocused, icon, children, ...props }, ref) {
  const { colors } = useAppTheme();
  const type = isFocused ? "focus" : "unfocus";

  const animationProgressValue = isFocused ? 1 : 0;
  const animationProgress = useSharedValue(animationProgressValue);

  React.useEffect(() => {
    animationProgress.value = withTiming(animationProgressValue, {
      duration: 200,
    });
  }, [isFocused]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animationProgress.value,
        [0, 1], // от unfocus к focus
        [colors.transparent, colors.surface]
      ),
    };
  });

  const iconColorsMap = {
    focus: { color: colors.onSurface },
    unfocus: { color: colors.onPrimary },
  };

  return (
    <AnimatedPressable
      {...props}
      style={[
        [
          {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            // flex: 1,
            width: TAB_ITEM_WIDTH,
            height: CONFIG.TAB_LIST_HEIGHT,
          },
          animatedBackgroundStyle,
        ],
      ]}
    >
      <Icon
        source={icon}
        size={TAB_ICON_SIZE}
        color={iconColorsMap[type].color}
      />
    </AnimatedPressable>
  );
});

export const CreateProductTabTrigger = React.forwardRef<
  View,
  TabTriggerSlotProps
>(function CreateProductTabTrigger({ isFocused, children, ...props }, ref) {
  const { colors } = useAppTheme();
  const checkNumberCreationLimits = useCreateProductLink();
  const router = useRouter();

  const type = isFocused ? "focus" : "unfocus";
  const animationProgressValue = isFocused ? 1 : 0;
  const animationProgress = useSharedValue(animationProgressValue);

  React.useEffect(() => {
    animationProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
    });
  }, [isFocused]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animationProgress.value,
        [0, 1], // от unfocus к focus
        [colors.secondary, colors.secondary]
      ),
    };
  });

  const iconColorsMap = {
    focus: { color: colors.onSecondary },
    unfocus: { color: colors.onSecondary },
  };

  const handlePress = async () => {
    const allowedToCreate = await checkNumberCreationLimits();
    if (!allowedToCreate) {
      return;
    }
    router.push({ pathname: "/(tabs)/create-product" });
  };

  return (
    <AnimatedPressable
      {...props}
      onPress={handlePress}
      style={[
        [
          {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            // flex: 1,
            width: TAB_ITEM_WIDTH,
            height: CONFIG.TAB_LIST_HEIGHT,
          },
          animatedBackgroundStyle,
        ],
      ]}
    >
      <Icon
        source="plus"
        size={TAB_ICON_SIZE}
        color={iconColorsMap[type].color}
      />
    </AnimatedPressable>
  );
});

export const TabBarBackground = () => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.primary,
          width: TABS_BACKGROUND_WIDTH,
          height: CONFIG.TAB_LIST_HEIGHT + 4,
          borderRadius: 28,
          position: "absolute",
          top: 0,
          left: 12,
          opacity: 0.9,
        },
      ]}
    />
  );
};
