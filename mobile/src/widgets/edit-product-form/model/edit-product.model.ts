import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { products } from "@/src/shared/api/products";
import type {
  CreateProductFormFields,
  ProductEntity,
} from "@/src/shared/api/products";
import { OnSubmitForm } from "@/src/shared/types";
import { uniqueId } from "@/src/shared/lib";
import { CONFIG } from "@/src/shared/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const setFormInitialValues = (
  product?: ProductEntity
): Partial<CreateProductFormFields> => {
  if (!product) {
    return {};
  }

  return {
    ...product,
    category: product.category.toString(),
    subCategory: product.subCategory.toString(),
    description: product.description,
    promotionType: product.promotionType.toString(),
    price: product.price.toString(),
    images: product.image_urls.map(({ url }, index) => ({
      id: uniqueId(),
      name: `${product.name}_${index}`,
      uri: url,
      type: url.replace(/^.+\./, "image/"),
      status: "noChanges",
      isInit: true,
    })),
    location: {
      ...product.location,
      country: "Serbia",
      // city: "Belgrade", TODO: Не хвататет city в product
    },
  };
};

export const useEditProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const editProductMutation = useMutation({
    mutationFn: products.edit,
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error during edit product",
      });
    },
  });

  const onSubmit: OnSubmitForm<CreateProductFormFields> = async (
    fields,
    form
  ) => {
    const formData = new FormData();
    const { dirtyFields } = form.getState();
    formData.append("id", fields.id.toString());

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof typeof fields;

      if (!fields[fieldKey]) {
        return;
      }
      if (key === "images" && fields[key].length > 0) {
        fields[key].forEach((image) => {
          const { status, type, uri, name } = image;
          const uris = {
            new: name,
            deleted: "Deleted",
            noChanges: "NoChanges",
          };
          const selectedStatus = status as keyof typeof uris;
          const imageItem = {
            name: uris[selectedStatus],
            type,
            uri,
          };
          formData.append("images", imageItem);
        });
        return;
      }
      if (key === "location") {
        formData.append(key, JSON.stringify(fields[key]));
        return;
      }
      formData.append(key, fields[fieldKey]);
    });

    editProductMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-products"] });

        router.back();
        form.restart();

        Toast.show({
          text1: "The product has been submitted for moderation",
          text2: "The application will be processed within 2 hours.",
          visibilityTime: CONFIG.SUBMIT_MESSAGE_VISIBILITY_TIME,
        });
      },
    });
  };

  return {
    isLoaded: editProductMutation.isSuccess,
    isPending: editProductMutation.isPending,
    error: editProductMutation.isError,
    onSubmit,
  };
};
