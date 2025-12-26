import { View, Animated, Image, TouchableOpacity } from "react-native";
import { Text, Icon } from "react-native-paper";
import {
  Appbar,
  BackActionButton,
  SafeAreaView,
  useAppTheme,
  AnimatedHeaderSwitcher,
  PageTitle,
  IconButton,
  useBottomSheetRef,
  BottomSheet,
  BottomSheetView,
  Button,
  useSafeAreaInsets,
  UserAvatarImage,
} from "@/src/shared/ui-kit";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { PreviewUserById } from "@/src/features/previews";
import { useTranslation } from "react-i18next";
import { UserProductsList } from "@/src/widgets/product-list";
import {
  useBlockUser,
  useFetchUserById,
  useReportUser,
  useUnblockUser,
} from "@/src/entities/user";
import { formatDate } from "@/src/shared/lib";
import { SetUserRatingForm } from "@/src/features/user-rating-form";

const defaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;

export const UserOverview = () => {
  const { colors, borderRadius } = useAppTheme();
  const { id } = useLocalSearchParams();
  const userId = id.toString();
  const prsedUserId = parseInt(userId, 10);
  const i = useSafeAreaInsets();
  const { t } = useTranslation(["user", "buttons"]);
  const { user, isLoaded } = useFetchUserById(prsedUserId);

  const sheetRef = useBottomSheetRef();
  const ratingSheetRef = useBottomSheetRef();

  const { onReportUser, isPending: isReportUserPending } = useReportUser();
  const { onUnblockUser, isPending: isUnblockUserPending } = useUnblockUser();
  const { onBlockUser, isPending: isBlockUserPending } = useBlockUser();

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const userName = user?.user_avatar?.name ?? "";
  const isUserBlocked = user?.options.blocked_by_you ?? false;
  const userRating = user?.user_avatar.rate ?? 0;

  const disabledReportButton =
    isReportUserPending || !user?.options.is_can_report;

  const userData = [
    {
      header: `${userRating}`,
      name: t("user.rating", { ns: "user" }),
      onPress: user?.options.is_can_rate
        ? () => {
            ratingSheetRef.current?.expand();
          }
        : undefined,
    },
    {
      header: `${user?.user_avatar.products_created ?? 0}`,
      name: t("user.listings", { ns: "user" }),
    },
    {
      header: formatDate(user?.user.created_at, "mm.yyyy"),
      name: t("user.registered", { ns: "user" }),
    },
  ];

  return (
    <>
      <SafeAreaView edges={["top"]}>
        <Appbar>
          <BackActionButton />

          <AnimatedHeaderSwitcher
            firstComponent={<PageTitle>{userName}</PageTitle>}
            secondComponent={<PreviewUserById userId={prsedUserId} />}
            scrollY={scrollY}
            threshold={150}
            height={50}
          />

          <IconButton
            icon="dots-horizontal"
            variant="transparent"
            onPress={() => sheetRef.current?.expand()}
          />
        </Appbar>

        <UserProductsList
          userId={userId}
          contentContainerStyle={{ paddingBottom: i.bottom }}
          ListHeaderComponent={
            <View style={{ alignItems: "center" }}>
              <UserAvatarImage
                source={user?.user_avatar.profile_image ?? defaultAvatar}
                size={180}
                isLoading={!isLoaded}
              />

              <Text
                variant="headlineSmall"
                style={{
                  color: colors.onBackground,
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                {userName}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  width: "100%",
                }}
              >
                {userData.map(({ onPress, name, header }) => {
                  const isFunction = typeof onPress === "function";
                  const activeOpacity = isFunction ? 0.8 : 1;
                  return (
                    <TouchableOpacity
                      activeOpacity={activeOpacity}
                      key={name}
                      onPress={onPress}
                      style={{
                        backgroundColor: colors.surface,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: borderRadius.secondary,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        flexDirection: "row",
                        gap: 4,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Text variant="titleMedium">{header}</Text>
                        <Text variant="titleMedium" style={{ opacity: 0.6 }}>
                          {name}
                        </Text>
                      </View>

                      {isFunction && <Icon size={24} source="chevron-right" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      </SafeAreaView>

      <BottomSheet ref={sheetRef} snapPoints={["60%"]}>
        <BottomSheetView style={{ paddingHorizontal: 16, gap: 8 }}>
          <Button
            variant="error"
            title={t("buttons.report_user", { ns: "buttons" })}
            disabled={disabledReportButton}
            onPress={() => onReportUser(prsedUserId)}
            leftSlor="alert-outline"
            style={{ justifyContent: "flex-start", flex: 0 }}
          />

          {isUserBlocked ? (
            <Button
              variant="surface"
              title={t("buttons.unblock_user", { ns: "buttons" })}
              leftSlor="lock-open-outline"
              onPress={() => onUnblockUser(prsedUserId)}
              disabled={isUnblockUserPending}
              style={{ justifyContent: "flex-start", flex: 0 }}
            />
          ) : (
            <Button
              variant="error"
              title={t("buttons.block_user", { ns: "buttons" })}
              leftSlor="lock-outline"
              onPress={() => onBlockUser(prsedUserId)}
              disabled={isBlockUserPending}
              style={{ justifyContent: "flex-start", flex: 0 }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet ref={ratingSheetRef} snapPoints={["40%"]}>
        <BottomSheetView style={{ paddingHorizontal: 16, gap: 8 }}>
          <SetUserRatingForm
            userId={prsedUserId}
            onSuccess={() => ratingSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};
