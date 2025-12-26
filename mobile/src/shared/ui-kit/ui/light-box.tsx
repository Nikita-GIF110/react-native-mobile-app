import React from "react";
import {
  View,
  Image,
  Dimensions,
  FlatList as ReactNativeFlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../models/theme.model";
import type { FlatListProps } from "@/src/shared/ui-kit";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

const styles = StyleSheet.create({
  pagination: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  dot: {
    borderRadius: "50%",
    width: 10,
    height: 10,
    opacity: 0.6,
  },
  activeDot: {
    opacity: 1,
  },
});

export const LightBox = ({
  visible,
  onClose,
  data,
  activeImageIndex: index = 0,
  onChangeImageIndex,
  ...sliderProps
}: {
  visible: boolean;
  activeImageIndex: number;
  onClose: () => void;
  onChangeImageIndex: (index: number) => void;
} & Omit<FlatListProps<string>, "renderItem">) => {
  const translateY = useSharedValue(0);
  const { colors } = useAppTheme();
  const activeImageIndex = index ?? 0;
  const dots = Array(data?.length ?? 0).fill(null);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (Math.abs(e.translationY) > Math.abs(e.translationX)) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > SCREEN_HEIGHT * 0.05) {
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={gesture}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: "black",
              paddingVertical: 16,
            },
          ]}
        >
          <Animated.View
            style={[{ flex: 1, justifyContent: "center" }, animatedStyle]}
          >
            <ReactNativeFlatList
              {...sliderProps}
              data={data}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={activeImageIndex}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    width: SCREEN_WIDTH,
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              )}
              getItemLayout={(_data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              onScroll={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffsetX / SCREEN_WIDTH);
                onChangeImageIndex(index);
              }}
            />
          </Animated.View>

          <View style={[styles.pagination]}>
            {dots.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: colors.surface,
                  },
                  index === activeImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
    </Modal>
  );
};
