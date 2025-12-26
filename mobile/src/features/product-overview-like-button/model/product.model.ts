import type {
  ProductEntity,
  ProductOverviewEntity,
} from "@/src/shared/api/products";
import { products } from "@/src/shared/api/products";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

export const useLikeOverviewProduct = () => {
  const queryClient = useQueryClient();

  const productLikeMutation = useMutation({
    mutationFn: products.likeIt,
    onError: () => Toast.show({ text1: "Couldn't like it", type: "error" }),
    onSuccess: (data, productId) => {
      const updatedProduct = data.data;
      queryClient.setQueryData<AxiosResponse<ProductOverviewEntity>>(
        ["product-overview", productId],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              product: {
                ...oldData.data.product,
                isLiked: updatedProduct.isLiked,
                likes: updatedProduct.likes,
              },
            },
          };
        }
      );

      // Это чтобы после того как поставил/убрал лайк с товара
      // На главной/поиске/категории обновить список без перезагрузки данных чтобы не сбивать порядок товаров
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
    onSettled: () => {
      queryClient.resetQueries({ queryKey: ["liked-products"] });
    },
  });

  return {
    onLikeIt: productLikeMutation.mutate,
    isPending: productLikeMutation.isPending,
  };
};
