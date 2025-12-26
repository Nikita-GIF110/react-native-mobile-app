import React from "react";
import { Field } from "react-final-form";
import { Checkbox } from "./checkbox";

interface FormCheckboxProps
  extends Omit<
    React.ComponentProps<typeof Checkbox>,
    "onChange" | "onFocus" | "onBlur" | "value"
  > {
  name: string;
}

export const FormCheckbox = ({ name, ...rest }: FormCheckboxProps) => (
  <Field name={name}>
    {({ input }) => {
      return <Checkbox {...input} {...rest} />;
    }}
  </Field>
);
