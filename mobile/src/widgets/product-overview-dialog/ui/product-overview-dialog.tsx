import React from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { ChatMessage } from "@/src/features/chat-message";
import { useFetchProductById } from "@/src/entities/products";
import { useFetchUserById } from "@/src/entities/user";
import {
  KeyboardAvoidingView,
  Button,
  BottomSheetModal,
  useBottomSheetModalRef,
  Chip,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { useTranslation } from "react-i18next";
import { useStartNewDialog } from "../model/new-dialog.model";
import { useQuery } from "@tanstack/react-query";
import { DialogForm } from "@/src/features/dialog-form";
import { useForm, useFormState } from "react-final-form";
import { useAuthContext } from "@/src/entities/auth";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { dialogs } from "@/src/shared/api";
import { PreviewUserById } from "@/src/features/previews";

const SHORT_MESSAGE_LIST = [
  "forms.short_message_template_1",
  "forms.short_message_template_2",
  "forms.short_message_template_3",
];

const ShortMessagesListField = () => {
  const form = useForm();
  const formState = useFormState();
  const { t } = useTranslation("forms");

  return (
    <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
      {SHORT_MESSAGE_LIST.map((shortMessageText) => (
        <Chip
          key={shortMessageText}
          label={t(shortMessageText, { ns: "forms" })}
          value={shortMessageText}
          selected={formState.values.text === shortMessageText}
          onChange={(value) => form.change("text", value)}
        />
      ))}
    </View>
  );
};

export const ProductOverviewDialog = ({
  productId,
}: {
  productId?: string;
}) => {
  const router = useRouter();
  const sheetRef = useBottomSheetModalRef();
  const { isAuthorized, redirectToSignIn } = useAuthContext();
  const insets = useSafeAreaInsets();

  const { item: product, dialog_id } = useFetchProductById(productId);
  const { messages, onSendMessage } = useStartNewDialog();

  const productOwnerId = product?.user_id;
  const { user: productOwner } = useFetchUserById(productOwnerId);
  const { t } = useTranslation("buttons");
  const [isNewDialog, setIsNewDialog] = React.useState(false);

  const newDialogQuery = useQuery({
    queryKey: ["predialog-by-product-id", productId],
    queryFn: () => dialogs.getProductPreDialog(productId),
    staleTime: 1000 * 60 * 5, // 5 минут
    enabled: !!productId && isNewDialog,
  });

  const isProductOwnerBlocked =
    productOwner?.options.blocked_by_system ||
    productOwner?.options.blocked_by_you ||
    productOwner?.options.blocked_you;

  const navigateToChat = (dialogId: number) =>
    router.push({ pathname: "/(no-tabs)/chat/[id]", params: { id: dialogId } });

  const openNewDialogModal = () => {
    sheetRef.current?.present();
    setIsNewDialog(true);
  };

  const onPress = async () => {
    if (isProductOwnerBlocked) {
      return;
    }
    if (dialog_id) {
      navigateToChat(dialog_id);
      return;
    }
    openNewDialogModal();
  };

  return (
    <>
      <Button
        onPress={() => {
          if (!isAuthorized) {
            redirectToSignIn({ from: "/(no-tabs)/product-overview/[id]" });
            return;
          }
          onPress();
        }}
        title={t("buttons.message_to_seller", { ns: "buttons" })}
        style={{ flex: 1, width: "auto" }}
        disabled={isProductOwnerBlocked}
      />

      <BottomSheetModal ref={sheetRef} snapPoints={["100%"]}>
        <KeyboardAvoidingView keyboardVerticalOffset={16} style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 8,
              flex: 1,
              gap: 8,
              paddingBottom: insets.bottom,
            }}
          >
            <PreviewUserById userId={productOwnerId} />

            <BottomSheetFlatList
              data={messages}
              inverted
              contentContainerStyle={{ gap: 8 }}
              keyExtractor={(item) => item.dialog_id.toString()}
              renderItem={({ item }) => (
                <ChatMessage
                  text={item.text}
                  creationTime={item.creationTime}
                  isSelf={item.isSelf}
                />
              )}
            />

            <DialogForm
              onSubmit={(fields, form) => {
                onSendMessage(fields, form, (error) => {
                  if (error) {
                    return error;
                  }
                  form.restart();
                  sheetRef.current?.close();
                  router.push({
                    pathname: "/(no-tabs)/chat/[id]",
                    params: { id: fields.dialog_id },
                  });
                });
              }}
              initialValues={{
                product_id: newDialogQuery?.data?.data.dialog_info.product_id,
                dialog_id: newDialogQuery?.data?.data.dialog_info.dialog_id,
              }}
              // TODO: slot - нагрузка JS в перф мониторе
              slot={!messages.length ? <ShortMessagesListField /> : null}
            />
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    </>
  );
};
