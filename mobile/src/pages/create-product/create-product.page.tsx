import { useIsFocused } from "@react-navigation/native";
import { CreateProductStepper } from "@/src/widgets/create-product-stepper";
import { SafeAreaView } from "@/src/shared/ui-kit";
import React from "react";

export const CreateProduct = () => {
  const isFocused = useIsFocused();

  return (
    <SafeAreaView edges={["top"]}>
      {/* Хак для ререндера CreateProductStepper когда чел ушел с станицы создания */}
      <CreateProductStepper key={isFocused} />
    </SafeAreaView>
  );
};
