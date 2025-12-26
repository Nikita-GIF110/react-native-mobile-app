import React from "react";
import { SectionList, View } from "react-native";
import { Text } from "react-native-paper";
import { ChatMessage } from "@/src/features/chat-message";
import {
  ContentPlaceholder,
  KeyboardAvoidingView,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { DialogForm } from "@/src/features/dialog-form";
import { useFetchChatById } from "@/src/entities/dialog";
import { useChatWebSocket } from "../model/dialog.model";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

export const ChatOverviewDialog = ({ chatId }: { chatId?: string }) => {
  const { t } = useTranslation("common");
  const { messages, dialog, isError, isLoaded } = useFetchChatById(chatId);
  const { onSubmit } = useChatWebSocket(chatId);
  const i = useSafeAreaInsets();
  const isUserBlocked = dialog?.user_is_blocked ?? false;

  return (
    <KeyboardAvoidingView style={{ flex: 1, position: "relative" }}>
      <>
        <SectionList
          sections={messages}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          inverted
          keyExtractor={(m) => m.creationTime}
          ListEmptyComponent={
            isUserBlocked ? (
              <ContentPlaceholder subHeader="Is blocked text" />
            ) : (
              <ContentPlaceholder subHeader={t("empty_product_list")} />
            )
          }
          renderItem={({ item }) => (
            <ChatMessage
              text={item.text}
              creationTime={item.creationTime}
              isSelf={item.isSelf}
              messageStatus={item.hasSeen ? 2 : 1}
            />
          )}
          renderSectionFooter={({ section }) => (
            <View style={{ alignItems: "center" }}>
              <Text>{section.title}</Text>
            </View>
          )}
        />

        <View
          style={{
            paddingHorizontal: 16,
            position: "relative",
            paddingBottom: i.bottom,
            paddingTop: 16,
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -16,
              height: 16,
            }}
          />
          <DialogForm
            disabled={isError || !isLoaded}
            onSubmit={onSubmit}
            initialValues={{
              product_id: dialog?.product_id,
              dialog_id: dialog?.dialog_id,
            }}
          />
        </View>
      </>
    </KeyboardAvoidingView>
  );
};
