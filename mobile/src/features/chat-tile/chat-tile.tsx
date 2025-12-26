import {
  View,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { formatDate, useShimmerAnimation } from "@/src/shared/lib";
import { MessageStatus } from "@/src/shared/ui-kit";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/src/shared/ui-kit";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  title: {
    width: "60%",
    height: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    width: "90%",
    height: 15,
  },
});

export const ChatTile = ({
  profuctImageSrc,
  profuctPrice,
  profuctName,
  messagePreviewText,
  interlocutorInfoText,
  isSeen,
  creationTime,
  messageStatus,
  isProductBlocked,
  onPress,
}: {
  profuctImageSrc: string;
  profuctPrice?: string;
  profuctName?: string;
  isProductBlocked: boolean;
  isSeen: boolean;
  messagePreviewText: string;
  interlocutorInfoText: string;
  creationTime: string;
  messageStatus?: number;
  onPress: () => void;
}) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
      <View
        style={{
          borderRadius: borderRadius.secondary,
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          backgroundColor: colors.surface,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!isSeen && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.secondary,
              opacity: 0.2,
              top: 0,
              left: 0,
            }}
          />
        )}
        <Image
          source={{ uri: profuctImageSrc }}
          style={{
            width: 90,
            height: 90,
            borderRadius: borderRadius.secondary - 4,
            overflow: "hidden",
            margin: 4,
          }}
        />

        <View
          style={{ flex: 1, gap: 4, paddingVertical: 8, paddingHorizontal: 4 }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              variant="titleLarge"
              numberOfLines={1}
              style={{ color: colors.onSurface }}
            >
              {interlocutorInfoText}
            </Text>
            <Text
              variant="labelMedium"
              numberOfLines={1}
              style={{ color: colors.onSurface }}
            >
              {formatDate(creationTime)}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              opacity: 0.8,
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{ fontWeight: 400, color: colors.onSurface, flex: 1 }}
            >
              {profuctName}
            </Text>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{ fontWeight: 400, color: colors.onSurface }}
            >
              {profuctPrice}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{
                fontWeight: isSeen ? 400 : 600,
                color: colors.onSurface,
                flex: 1,
              }}
            >
              {messagePreviewText}
            </Text>

            <MessageStatus messageStatus={messageStatus} />
          </View>
        </View>

        {/* {isProductBlocked && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: Colors.light.background,
                height: "100%",
                width: "100%",
                opacity: 0.6,
              }}
            />
            <Icon size={34} source="lock-outline" />
          </View>
        )} */}

        {/* <View style={{ flex: 1, padding: 8 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{ fontWeight: 600, maxWidth: "70%" }}
            variant="bodyLarge"
            numberOfLines={1}
          >
            {interlocutorInfoText}
          </ThemedText>

          <ThemedText style={{ opacity: 0.6 }}>
            {formatDate(creationTime)}
          </ThemedText>
        </View>

        <ThemedText style={{ fontWeight: 500, marginBottom: 4 }}>
          {profuctInfo}
        </ThemedText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{ opacity: 0.6, flex: 1, maxWidth: "90%" }}
            variant="labelMedium"
            numberOfLines={4}
          >
            {messagePreviewText}
          </ThemedText>

          
        </View>
      </View> */}
      </View>
    </TouchableOpacity>
  );
};
const Skeleton = () => {
  const shimmerStyle = useShimmerAnimation();
  const { borderRadius } = useAppTheme();

  return (
    <View
      style={{
        width: "100%",
        height: 100,
        flexDirection: "row",
        borderRadius: borderRadius.secondary,
      }}
    >
      <Animated.View style={[styles.skeleton, styles.image, shimmerStyle]} />
      <View style={{ padding: 8, flex: 1, gap: 4 }}>
        <Animated.View style={[styles.skeleton, styles.title, shimmerStyle]} />
        <Animated.View style={[styles.skeleton, styles.text, shimmerStyle]} />
        <Animated.View style={[styles.skeleton, styles.text, shimmerStyle]} />
      </View>
    </View>
  );
};

ChatTile.Skeleton = Skeleton;
