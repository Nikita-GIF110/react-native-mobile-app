import { products } from "@/src/shared/api/products";
import type { ProductEntity } from "@/src/shared/api/products";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useLikeProduct = () => {
  const queryClient = useQueryClient();

  const likeProductMutation = useMutation({
    mutationFn: products.likeIt,
    onError: () =>
      Toast.show({
        type: "error",
        text1: "Erron during like product",
      }),
    onSettled: (_, _error, productId) => {
      queryClient.resetQueries({ queryKey: ["liked-products"] });
      queryClient.resetQueries({ queryKey: ["product-overview", productId] });
    },
    onSuccess: (data) => {
      const updatedProduct = data.data;

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["products"], exact: false });

      for (const q of queries) {
        queryClient.setQueryData<InfiniteData<{ data: ProductEntity[] }>>(
          q.queryKey,
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((p) =>
                  p.id === updatedProduct.id ? updatedProduct : p
                ),
              })),
            };
          }
        );
      }
    },
  });

  return {
    onLikeIt: likeProductMutation.mutate,
    getIsPending: (id: string) =>
      likeProductMutation.isPending && likeProductMutation.variables === id,
  };
};
