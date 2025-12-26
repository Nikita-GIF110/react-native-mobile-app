import type { ProductStatus } from "@/src/shared/api/products";
import { products } from "@/src/shared/api/products";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export const useInfiniteFetchProfileProductsByType = (
  productStatus: ProductStatus,
  enabled: boolean
) => {
  const qieryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["my-products", productStatus],
    queryFn: ({ pageParam = 1, signal }) =>
      products
        .getSelfUserProducts(
          { type: productStatus, page: pageParam },
          { signal }
        )
        .catch(() => {}),
    staleTime: 1000 * 60 * 5, // 5 минут
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const hasMore = lastPage?.data && lastPage?.data.length > 0;
      return hasMore ? lastPageParam + 1 : null;
    },
    select: (result) =>
      result.pages.flatMap((page) => page?.data || []).filter(Boolean),
    // enabled,
  });

  return {
    data: query.data ?? [],
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isFetchingNextPage: query.isFetchingNextPage,
    isPending: query.isPending,
    isListLoaded: query.isFetched,
    refreshControlState: {
      onRefresh: () => {
        qieryClient.resetQueries({ queryKey: ["my-products", productStatus] });
      },
      refreshing: query.isFetching,
    },
  };
};

