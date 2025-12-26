import { products } from "@/src/shared/api/products";
import type { CreateProductFormFields } from "@/src/shared/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { CONFIG } from "@/src/shared/config";
import type { OnSubmitForm } from "@/src/shared/types";
import { useRouter } from "expo-router";

export const useCreateProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createProductMutation = useMutation({
    mutationFn: products.create,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["my-products"] });
      router.replace("/(no-tabs)/my-products");

      Toast.show({
        text1: "The product has been submitted for moderation",
        text2: "The application will be processed within 2 hours.",
        visibilityTime: CONFIG.SUBMIT_MESSAGE_VISIBILITY_TIME,
      });
    },
    onError: () =>
      Toast.show({
        type: "error",
        text1: "Erron during create product",
      }),
  });

  const onCreate: OnSubmitForm<CreateProductFormFields> = async (fields) => {
    const formData = new FormData();
    Object.keys(fields).forEach((key) => {
      if (key === "location") {
        formData.append(
          "location",
          JSON.stringify({ ...fields[key], country: "Serbia" })
        );
        return;
      }
      if (key === "images") {
        fields[key].forEach((image) => formData.append("images", image));
        return;
      }
      formData.append(key, fields[key]);
    });

    createProductMutation.mutate(formData);
  };

  return {
    onCreate,
    initialValues: {
      category: "1",
      subCategory: "100",
      promotionType: "1",
      name: "Lorem ipsum dolor sit amet",
      price: "1200",
      currency: "USDT",
      condition: "USED",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate dolorum ipsa neque mollitia natus consequuntur quod reiciendis perferendis dicta esse.",
      images: [],
      language_tag: "ru",
    },
  };
};
