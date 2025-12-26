import { dialogs } from "@/src/shared/api/dialogs";
import type { DialogOverviewEntity } from "@/src/shared/api/dialogs";
import { formatDate } from "@/src/shared/lib/date-formatter";
import { handelErrorDetail } from "@/src/shared/lib/catch-errors";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Message = DialogOverviewEntity["messages"][0];

const createMessagesMapWithDateSeparator = (messages: Message[]) => {
  if (!messages.length) {
    return [];
  }

  const map: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = formatDate(message.creationTime);
    if (!map[date]) {
      map[date] = [message];
    } else {
      map[date].push(message);
    }
  });

  const result = Object.keys(map).map((key) => ({
    title: key,
    data: map[key],
  }));

  return result;
};

export const useFetchChatById = (chatId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat-overview", chatId],
    queryFn: () => dialogs.getDialogById(chatId).catch(handelErrorDetail),
    staleTime: 1000 * 60 * 5, // 5 минут
    enabled: Boolean(chatId),
  });

  return {
    messages: createMessagesMapWithDateSeparator(
      query.data?.data.messages ?? []
    ),
    dialog: query.data?.data.dialog_info ?? null,
    isLoaded: query.isFetched,
    isError: query.isError,
    refreshControlState: {
      onRefresh: () =>
        queryClient.resetQueries({ queryKey: ["chat-overview", chatId] }),
      refreshing: query.isFetching,
    },
  };
};
