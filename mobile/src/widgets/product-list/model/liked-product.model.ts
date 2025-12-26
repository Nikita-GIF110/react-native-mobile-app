import type { ProductEntity } from "@/src/shared/api/products";
import { products } from "@/src/shared/api/products";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handelErrorDetail } from "@/src/shared/lib/catch-errors";
import { AxiosResponse } from "axios";
import { useIsFocused } from "@react-navigation/native";

export const useLikeProduct = () => {
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: products.likeIt,
    onError: handelErrorDetail,
    onSettled: async (_, likedProductId) => {
      queryClient.resetQueries({
        queryKey: ["product-overview", likedProductId],
      });
      queryClient.resetQueries({ queryKey: ["products"] });
    },
    onSuccess: (_, likedProductId) => {
      queryClient.setQueryData<InfiniteData<AxiosResponse<ProductEntity[]>>>(
        ["liked-products"],
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                ({ id }) => id.toString() !== likedProductId
              ),
            })),
          };
        }
      );
    },
  });

  return {
    onLikeIt: likeProductMutation.mutate,
    getIsPending: (id: string) =>
      likeProductMutation.isPending && likeProductMutation.variables === id,
  };
};

export const useInfiniteFetchLikedProducts = () => {
  const qieryClient = useQueryClient();
  const isFocused = useIsFocused();

  const query = useInfiniteQuery({
    queryKey: ["liked-products"],
    queryFn: ({ pageParam = 1, signal }) =>
      products.getLikedProductsList({ page: pageParam }, { signal }).catch(() =>
        Toast.show({
          type: "error",
          text1: "Erron during fetch liked products list",
        })
      ),
    staleTime: 1000 * 60 * 5, // 5 минут
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const hasMore = lastPage?.data && lastPage?.data.length > 0;
      return hasMore ? lastPageParam + 1 : null;
    },
    select: (result) =>
      result.pages.flatMap((page) => page?.data || []).filter(Boolean),
    enabled: isFocused,
  });

  return {
    products: query.data ?? [],
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isPending: query.isPending,
    listLoaded: query.isFetched,
    refreshControlState: {
      onRefresh: () => {
        qieryClient.refetchQueries({ queryKey: ["liked-products"] });
      },
      refreshing: query.isFetching,
    },
  };
};
