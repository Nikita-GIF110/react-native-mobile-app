import { PreviewChatById } from "@/src/features/previews";
import {
  Appbar,
  BackActionButton,
  BottomSheet,
  useBottomSheetRef,
  BottomSheetView,
  Button,
  useSafeAreaInsets,
  UserAvatarImage,
} from "@/src/shared/ui-kit";
import { ChatOverviewDialog } from "@/src/widgets/chat-overview-dialog";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { useFetchChatById } from "@/src/entities/dialog";
import { useTranslation } from "react-i18next";
import { useReportUser } from "@/src/entities/user";

const defaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;

export const Chat = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const chatId = id.toString();
  const sheetRef = useBottomSheetRef();
  const { dialog, isLoaded } = useFetchChatById(chatId);
  const { t } = useTranslation("buttons");
  const { onReportUser, isPending } = useReportUser();
  const i = useSafeAreaInsets();

  return (
    <>
      <Appbar style={{ marginTop: i.top }}>
        <BackActionButton />
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1 }}
          onPress={() => sheetRef.current?.expand()}
        >
          <PreviewChatById chatId={chatId} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/(no-tabs)/user/[id]",
              params: { id: dialog?.user_id },
            })
          }
        >
          <UserAvatarImage
            source={dialog?.user_image ?? defaultAvatar}
            isLoading={!isLoaded}
          />
        </TouchableOpacity>
      </Appbar>

      <ChatOverviewDialog chatId={chatId} />

      <BottomSheet ref={sheetRef} snapPoints={["40%"]}>
        <BottomSheetView style={{ paddingHorizontal: 16, gap: 8 }}>
          <Button
            title={dialog?.product_name}
            variant="surface"
            rightSlor="chevron-right"
            style={{ justifyContent: "space-between" }}
            onPress={() => {
              sheetRef.current?.close();
              router.push({
                pathname: dialog?.product_is_self
                  ? "/(no-tabs)/my-product-overview/[id]"
                  : "/(no-tabs)/product-overview/[id]",
                params: { id: dialog?.product_id ?? 0 },
              });
            }}
          />

          <Button
            title={t("buttons.report_user", { ns: "buttons" })}
            variant="error"
            leftSlor="alert-outline"
            disabled={isPending}
            onPress={() => onReportUser(dialog?.user_id)}
            style={{ justifyContent: "flex-start" }}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};
