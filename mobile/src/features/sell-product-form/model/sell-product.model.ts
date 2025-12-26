import { products, SellProductFormFields } from "@/src/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useSellProduct = () => {
  const queryClient = useQueryClient();

  const sellProductMutation = useMutation({
    mutationFn: products.sellProduct,
  });

  const onSellProduct = async (fields: SellProductFormFields) => {
    const { product_id, sell_price } = fields;
    sellProductMutation.mutate(
      {
        product_id,
        price: parseInt(sell_price, 10),
      },
      {
        onSuccess: () => {
          queryClient.resetQueries({ queryKey: ["my-products"] });
          Toast.show({
            type: "success",
            text1: "The product has been successfully sold",
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Error during sell product",
          });
        },
      }
    );
  };

  return {
    onSellProduct,
  };
};
