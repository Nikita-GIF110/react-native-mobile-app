import {
  BottomSheetModal,
  Button,
  BottomSheetView,
  useSafeAreaInsets,
  FormTextInput,
  BottomSheetFormTextInput,
  KeyboardAvoidingView,
} from "@/src/shared/ui-kit";
import React from "react";
import { useTranslation } from "react-i18next";
import type { SellProductFormFields } from "@/src/shared/api/products";
import { withTypes } from "react-final-form";
import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { useSellProduct } from "../model/sell-product.model";
import { View } from "react-native";

const { Form } = withTypes<SellProductFormFields>();

export const BottomSheetSellProductForm = React.forwardRef<
  GorhomBottomSheet,
  {
    initialValues: Partial<SellProductFormFields>;
  }
>(function BottomSheetSellProductForm({ initialValues }, ref) {
  const { t } = useTranslation(["buttons", "forms"]);
  const i = useSafeAreaInsets();
  const { onSellProduct } = useSellProduct();

  return (
    <BottomSheetModal ref={ref} snapPoints={["40%"]}>
      <BottomSheetView
        style={{
          flexGrow: 1,
          paddingBottom: i.bottom,
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Form
          initialValues={initialValues}
          onSubmit={(fields, form) => {
            onSellProduct(fields);
            ref.current?.close();
            form.restart();
          }}
        >
          {({ handleSubmit, submitting, pristine }) => {
            return (
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                  }}
                >
                  <BottomSheetFormTextInput
                    name="sell_price"
                    placeholder={t("forms.label.price", { ns: "forms" })}
                    style={{ flex: 0 }}
                    inputMode="numeric"
                  />

                  <Button
                    title={t("buttons.submit", { ns: "buttons" })}
                    variant="secondary"
                    disabled={pristine || submitting}
                    onPress={handleSubmit}
                  />
                </View>
              </KeyboardAvoidingView>
            );
          }}
        </Form>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
