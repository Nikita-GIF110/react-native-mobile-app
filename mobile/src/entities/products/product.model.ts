import { products } from "@/src/shared/api/products";
import type {
  ProductEntity,
  ProductFiltesFormField,
} from "@/src/shared/api/products";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export const useFetchProductById = (
  productId?: string,
  config?: {
    staleTime?: number;
  }
) => {
  const query = useQuery({
    queryKey: ["product-overview", productId],
    queryFn: () =>
      products.getProductById(productId).catch(() =>
        Toast.show({
          type: "error",
          text1: "Erron during fetch product overview",
        })
      ),
    staleTime: 1000 * 60 * 5, // 5 минут
    enabled: Boolean(productId),
    ...config,
  });

  return {
    item: query.data?.data.product,
    isLoaded: query.isFetched,
    error: query.isError,
    similarProducts: query.data?.data.similars ?? [],
    dialog_id: query.data?.data.dialog_id,
  };
};

export const useInfiniteFetchProducts = (
  filters: Partial<ProductFiltesFormField>
) => {
  const isFocused = useIsFocused();
  const qieryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["products", filters],
    staleTime: 1000 * 60 * 5, // 5 минут
    queryFn: ({ pageParam = 0, signal }) => {
      return products
        .getProductsList(
          {
            ...filters,
            page: pageParam,
          },
          { signal }
        )
        .catch(() =>
          Toast.show({
            type: "error",
            text1: "Erron during fetch products list",
          })
        );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const hasMore = lastPage?.data && lastPage?.data.length > 0;
      return hasMore ? lastPageParam + 1 : null;
    },
    select: (result) =>
      result.pages.flatMap((page) => page?.data || []).filter(Boolean),
    enabled: isFocused,
    placeholderData: keepPreviousData,
  });

  return {
    products: query.data ?? [],
    listLoaded: query.isFetched,
    refreshControlState: {
      onRefresh: () => {
        qieryClient.refetchQueries({ queryKey: ["products", filters] });
      },
      refreshing: query.isRefetching,
    },
    fetchNextPage: () => {
      query.fetchNextPage();
    },
    isPending: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export const useProductReport = () => {
  const queryClient = useQueryClient();

  const reportProductMutation = useMutation({
    mutationFn: products.reportProduct,
  });

  const onReport = async (productId: ProductEntity["id"]) => {
    reportProductMutation.mutate(productId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        // callback();
      },
      onError: (error) => {
        Toast.show({ type: "error", text1: "Error during report product" });
        // handelErrorDetail(error);
        // callback({ [FORM_ERROR]: "Error" });
      },
    });
  };

  return {
    onReport,
    isPending: reportProductMutation.isPending,
  };
};
