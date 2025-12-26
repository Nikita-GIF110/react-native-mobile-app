import { useFetchProductById } from "@/src/entities/products";
import {
  Appbar,
  BackActionButton,
  PageTitle,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { EditProductForm } from "@/src/widgets/edit-product-form";
import { useLocalSearchParams } from "expo-router";

export const ProfileEditProduct = () => {
  const i = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const productId = id.toString();
  const { item } = useFetchProductById(productId);

  return (
    <>
      <Appbar style={{ marginTop: i.top, justifyContent: "flex-start" }}>
        <BackActionButton />
        <PageTitle style={{ flex: 1 }} numberOfLines={1}>
          {item?.name ?? ""}
        </PageTitle>
      </Appbar>

      <EditProductForm productId={productId} />
    </>
  );
};
