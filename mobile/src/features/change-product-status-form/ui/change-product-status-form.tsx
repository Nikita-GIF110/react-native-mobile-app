import {
  BottomSheetModal,
  FormFieldButton,
  Button,
  BottomSheetView,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import React from "react";
import { useTranslation } from "react-i18next";
import type { ChangeProductStatusFormField } from "@/src/shared/api/products";
import { withTypes } from "react-final-form";
import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { useChangeProductStatus } from "../model/change-product-status.model";

const { Form } = withTypes<ChangeProductStatusFormField>();
// // TODO: вынести в костанту # 0 - Deleted, 1 - Opened, 2 - Hidden, 3 - Sold, 4 - Moderation
export const FORM_ACTIONS_BY_PRODUCT_STATUS: Record<
  ChangeProductStatusFormField["status"],
  { value: string; label: string }[]
> = {
  0: [],
  1: [
    {
      value: "hidden",
      label: "product.action_hide",
    },
  ],
  2: [
    {
      value: "opened",
      label: "product.action_open",
    },
  ],
  3: [],
  4: [],
};

export const BottomSheetChangeProductStatusForm = React.forwardRef<
  GorhomBottomSheet,
  {
    productStatus: ChangeProductStatusFormField["status"];
    initialValues?: Partial<ChangeProductStatusFormField>;
  }
>(function BottomSheetChangeProductStatusForm(
  { productStatus, initialValues },
  ref
) {
  const { t } = useTranslation(["product", "buttons"]);
  const i = useSafeAreaInsets();
  const formStatusesList = FORM_ACTIONS_BY_PRODUCT_STATUS[productStatus];
  const { onChangeProductStatus } = useChangeProductStatus();

  return (
    <BottomSheetModal ref={ref} snapPoints={["40%"]}>
      <BottomSheetView
        style={{
          flexGrow: 1,
          paddingBottom: i.bottom,
          paddingHorizontal: 16,
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Form
          initialValues={initialValues}
          onSubmit={(fields, form) => {
            onChangeProductStatus(fields, form);
            ref.current?.close();
          }}
        >
          {({ handleSubmit, submitting, pristine }) => {
            return (
              <>
                {formStatusesList.map(({ value, label }) => {
                  return (
                    <FormFieldButton
                      key={value}
                      name="status"
                      value={value}
                      title={t(label, { ns: "product" })}
                      leftSlor="eye-off"
                      style={{ justifyContent: "flex-start" }}
                    />
                  );
                })}

                <Button
                  title={t("buttons.submit", { ns: "buttons" })}
                  variant="secondary"
                  disabled={pristine || submitting}
                  onPress={handleSubmit}
                />
              </>
            );
          }}
        </Form>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
