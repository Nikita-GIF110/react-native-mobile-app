import { ChangeProductStatusFormField, products } from "@/src/shared/api";
import { OnSubmitForm } from "@/src/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useChangeProductStatus = () => {
  const queryClient = useQueryClient();

  const changeProductStatusMutation = useMutation({
    mutationFn: products.changeStatus,
  });

  const onChangeProductStatus: OnSubmitForm<
    ChangeProductStatusFormField
  > = async (fields, form) => {
    changeProductStatusMutation.mutate(fields, {
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ["my-products"] });
        form.restart();
        Toast.show({
          type: "success",
          text1: "The listing was successfully {{status}}",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Error during {{status}} product",
        });
      },
    });
  };

  return {
    onChangeProductStatus,
  };
};