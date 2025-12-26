import React from "react";
import { useFetchProductById } from "@/src/entities/products";
import { useLikeOverviewProduct } from "../model/product.model";
import { IconButton, useAppTheme, LikeButton } from "@/src/shared/ui-kit";
import { useAuthContext } from "@/src/entities/auth";

export const ProductOverviewLikeButton = ({
  productId,
}: {
  productId?: string;
}) => {
  const { isAuthorized, redirectToSignIn } = useAuthContext();
  const { item } = useFetchProductById(productId);
  const { onLikeIt, isPending } = useLikeOverviewProduct();
  const { colors } = useAppTheme();

  const isLiked = item?.isLiked ?? false;

  return (
    <>
      <LikeButton
        isLiked //={isLiked}
        disabled={isPending}
        onPress={() => {
          if (!isAuthorized) {
            redirectToSignIn({ from: "/(no-tabs)/product-overview/[id]" });
            return;
          }
          onLikeIt(productId);
        }}
        style={{
          backgroundColor: isLiked ? colors.errorContainer : colors.primary,
        }}
        iconColor={isLiked ? colors.onErrorContainer : colors.onPrimary}
        icon={isLiked ? undefined : "heart-outline"}
      />
    </>
  );
};
