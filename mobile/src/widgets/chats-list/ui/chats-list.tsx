import React from "react";
import { ListRenderItem } from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteFetchChats } from "../model/chats.model";
import { ChatTile } from "@/src/features/chat-tile";
import { InfiniteQueryFlatList, ContentPlaceholder } from "@/src/shared/ui-kit";
import { DialogEntity } from "@/src/shared/api/dialogs";
import { useTranslation } from "react-i18next";
import { priceFormatter } from "@/src/shared/lib";
import * as Animatable from "react-native-animatable";

export const ChatsList = ({
  contentContainerStyle,
  ...props
}: Omit<
  React.ComponentProps<typeof InfiniteQueryFlatList>,
  | "data"
  | "keyExtractor"
  | "isLoadingMore"
  | "onLoadMore"
  | "isListLoaded"
  | "renderItem"
  | "getItemLayout"
>) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const {
    chats,
    listLoaded,
    refreshControlState,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFetchChats();

  const renderItem = React.useCallback<ListRenderItem<DialogEntity>>(
    ({ item, index }) => {
      const status = item.last_message_is_seen ? 2 : 1;

      return (
        <Animatable.View animation="fadeIn" duration={200} useNativeDriver>
          <ChatTile
            profuctImageSrc={item.product_preview_image}
            profuctPrice={`• ${priceFormatter(
              item.product_price,
              item.product_currency
            )}`}
            profuctName={item.product_name}
            messagePreviewText={item.last_message}
            isSeen={item.last_message_is_seen}
            interlocutorInfoText={item.user_name}
            creationTime={item.last_message_date}
            messageStatus={status}
            isProductBlocked={false}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.dialog_id },
              })
            }
          />
        </Animatable.View>
      );
    },
    []
  );

  return (
    <InfiniteQueryFlatList
      {...props}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      data={chats}
      keyExtractor={(i) => i.dialog_id.toString()}
      isListLoaded={listLoaded}
      contentContainerStyle={[
        { paddingBottom: 16, paddingHorizontal: 16 },
        contentContainerStyle,
      ]}
      ListEmptyComponent={
        <ContentPlaceholder subHeader={t("empty_product_list")} />
      }
      ListLoadingComponent={
        <>
          {Array(12)
            .fill(null)
            .map((_, index) => (
              <Animatable.View
                key={index}
                animation="fadeIn"
                duration={200}
                useNativeDriver
              >
                <ChatTile.Skeleton key={index} />
              </Animatable.View>
            ))}
        </>
      }
      {...refreshControlState}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({
        // 98 - ChatTile Height
        length: 98,
        offset: 98 * index,
        index,
      })}
    />
  );
};
