import Toast from "react-native-toast-message";
import { products } from "@/src/shared/api/products";
import { useAuthContext } from "@/src/entities/auth";

export const useCreateProductLink = () => {
  const { isAuthorized, redirectToSignIn } = useAuthContext();

  const checkNumberCreationLimits = async () => {
    if (!isAuthorized) {
      redirectToSignIn({});
      return;
    }

    try {
      const { data } = await products.getProductCreationLimit();
      const { allowed_to_create } = data;

      if (!allowed_to_create) {
        Toast.show({
          type: "error",
          text1: "The creation limit has been reached",
        });
        return;
      }
      return allowed_to_create;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during create product",
      });
    }
  };

  return checkNumberCreationLimits;
};
