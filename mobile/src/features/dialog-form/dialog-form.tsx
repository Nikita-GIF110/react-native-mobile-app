import React from "react";
import { withTypes } from "react-final-form";
import type { OnSubmitForm } from "@/src/shared/types";
import type { DialogFormField } from "@/src/shared/api/dialogs";
import { View } from "react-native";
import { FormTextInput, IconButton } from "@/src/shared/ui-kit";
import { dialogSchema } from "@/src/shared/api";
import { useValidationSchema } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";

const { Form } = withTypes<DialogFormField>();

export const DialogForm = ({
  onSubmit,
  initialValues,
  slot,
  disabled,
}: {
  onSubmit: OnSubmitForm<DialogFormField>;
  initialValues?: Partial<DialogFormField>;
  slot?: React.ReactNode;
  disabled?: boolean;
}) => {
  const { t } = useTranslation("forms");
  const validate = useValidationSchema(dialogSchema);

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} validate={validate}>
      {({ handleSubmit, submitting, invalid, pristine }) => {
        return (
          <View style={{ gap: 8 }}>
            {slot}

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <FormTextInput
                name="text"
                placeholder={t("forms.input_message", {ns: "forms"})}
                containerStyle={{ flex: 1 }}
                disabled={disabled}
              />

              <IconButton
                icon="arrow-up"
                onPress={handleSubmit}
                disabled={submitting || invalid || pristine || disabled}
                variant="secondary"
              />
            </View>
          </View>
        );
      }}
    </Form>
  );
};
