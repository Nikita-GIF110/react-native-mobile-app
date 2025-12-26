import { products } from "@/src/shared/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useUserProducts = (userId?: string) => {
  const qieryClient = useQueryClient();
  const queryKey = ["products", "byUserId", userId];

  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) =>
      products.getUserProducts(userId, { signal }).catch(() =>
        Toast.show({
          type: "error",
          text1: "Error during fetch useer products",
        })
      ),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 минут
    enabled: Boolean(userId),
  });

  return {
    products: query.data?.data ?? [],
    isLoaded: query.isFetched,
    hasError: query.isLoadingError,
    refreshControlState: {
      onRefresh: () => qieryClient.refetchQueries({ queryKey }),
      refreshing: query.isRefetching,
    },
  };
};