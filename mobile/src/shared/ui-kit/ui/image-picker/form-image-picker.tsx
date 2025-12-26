import React from "react";
import { Field } from "react-final-form";
import { ImagePicker } from "./image-picker";
import { HelperText } from "react-native-paper";

interface FormImagePickerProps
  extends Omit<
    React.ComponentProps<typeof ImagePicker>,
    "onChange" | "onFocus" | "onBlur" | "value"
  > {
  name: string;
}

export const FormImagePicker = ({
  name,
  ...imagePickerProps
}: FormImagePickerProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <>
          <ImagePicker {...imagePickerProps} {...input} />
          <HelperText type="error" visible={meta.touched && meta.error}>
            {meta.error}
          </HelperText>
        </>
      )}
    </Field>
  );
};

FormImagePicker.Image = ImagePicker.Image;
FormImagePicker.UploadButton = ImagePicker.UploadButton;
