import { useIsFocused } from "@react-navigation/native";
import { dialogs } from "@/src/shared/api/dialogs";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useInfiniteFetchChats = () => {
  const isFocused = useIsFocused();
  const qieryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["chats"],
    staleTime: 1000 * 60 * 5, // 5 минут
    queryFn: ({ pageParam = 0, signal }) => {
      return dialogs
        .getDialogList({ page: pageParam }, { signal })
        .catch(() => {
          Toast.show({
            text1: "Error during fetch chats",
            type: "error",
          });
        });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const hasMore = lastPage?.data && lastPage?.data.length > 0;
      return hasMore ? lastPageParam + 1 : null;
    },
    enabled: isFocused,
    placeholderData: keepPreviousData,
  });

  const list = query.data?.pages;
  const flatList = list?.flatMap((page) => page?.data || []).filter(Boolean);

  return {
    chats: flatList ?? [],
    listLoaded: query.isFetched,
    refreshControlState: {
      onRefresh: () => {
        qieryClient.resetQueries({ queryKey: ["chats"] });
      },
      refreshing: query.isFetching,
    },
    fetchNextPage: () => {
      query.fetchNextPage();
    },
    isPending: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
