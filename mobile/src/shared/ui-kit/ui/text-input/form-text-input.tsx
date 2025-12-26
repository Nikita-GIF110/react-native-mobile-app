import type { ComponentProps } from "react";
import { Field } from "react-final-form";
import { TextInput, PasswordTextInput, BottomSheetTextInput } from "./text-input";

interface FormTextInputProps
  extends Omit<ComponentProps<typeof TextInput>, "onChange" | "value"> {
  name: string;
}

export const FormTextInput = ({ name, ...inputProps }: FormTextInputProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <TextInput
          {...inputProps}
          onChange={input.onChange}
          onBlur={() => input.onBlur()}
          onFocus={() => input.onFocus()}
          value={input.value}
          error={meta.touched && meta.error}
          helperText={meta.error}
        />
      )}
    </Field>
  );
};

export const FormPasswordFormTextInput = ({
  name,
  ...inputProps
}: FormTextInputProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <PasswordTextInput
          {...inputProps}
          onChange={input.onChange}
          onBlur={() => input.onBlur()}
          onFocus={() => input.onFocus()}
          value={input.value}
          error={meta.touched && meta.error}
          helperText={meta.error}
        />
      )}
    </Field>
  );
};

export const BottomSheetFormTextInput = ({
  name,
  ...inputProps
}: FormTextInputProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <BottomSheetTextInput
          {...inputProps}
          onChange={input.onChange}
          onBlur={() => input.onBlur()}
          onFocus={() => input.onFocus()}
          value={input.value}
          // error={meta.touched && meta.error}
          // helperText={meta.error}
        />
      )}
    </Field>
  );
};
