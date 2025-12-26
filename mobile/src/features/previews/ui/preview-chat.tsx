import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useShimmerAnimation } from "@/src/shared/lib";
import { ProductAvatarImage, useAppTheme } from "@/src/shared/ui-kit";
import { useFetchChatById } from "@/src/entities/dialog";

const Skeleton = () => {
  const shimmerStyle = useShimmerAnimation();

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Animated.View
        style={[styles.skeleton, styles.textSkeleton, shimmerStyle]}
      />
      <Animated.View
        style={[styles.skeleton, styles.titleSkeleton, shimmerStyle]}
      />
    </View>
  );
};

export const PreviewChat = ({
  userName,
  productName,
  productImageUri,
  isLoading,
}: {
  userName: string;
  productName: string;
  productImageUri: string;
  isLoading: boolean;
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        width: "100%",
      }}
    >
      <ProductAvatarImage source={productImageUri} isLoading={isLoading} />

      {isLoading ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyLarge"
            numberOfLines={1}
            style={{ color: colors.onSurface, fontWeight: 700 }}
          >
            {userName}
          </Text>

          <Text
            variant="bodyLarge"
            numberOfLines={1}
            style={{ color: colors.onSurface, maxWidth: "100%", opacity: 0.8 }}
          >
            {productName}
          </Text>
        </View>
      )}
    </View>
  );
};

export const PreviewChatById = ({ chatId }: { chatId: string }) => {
  const { dialog, isLoaded } = useFetchChatById(chatId);

  return (
    <PreviewChat
      isLoading={!isLoaded}
      userName={dialog?.user_name}
      productName={dialog?.product_name}
      productImageUri={dialog?.product_preview_image}
    />
  );
};

const styles = StyleSheet.create({
  image: { height: 50, width: 50 },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  textSkeleton: { width: "90%", height: 10 },
  titleSkeleton: { width: "60%", height: 20 },
});
