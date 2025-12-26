import React from "react";
import { TouchableOpacity } from "react-native";
import { Chip as PaperChip } from "react-native-paper";
import { Field } from "react-final-form";
import { useAppTheme } from "../models/theme.model";

type ChipSize = "sm" | "md" | "lg";

interface ChipProps
  extends Omit<React.ComponentProps<typeof PaperChip>, "children"> {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  showCloseIcon?: boolean;
  size?: ChipSize;
}

interface FormChipProps
  extends Omit<ChipProps, "onChange" | "onBlur" | "onFocus"> {
  name: string;
}
const CHIP_CONTAINER_SIZE_MAP: Record<ChipSize, ChipProps["style"]> = {
  sm: { padding: 0 },
  md: { padding: 2 },
  lg: { padding: 4 },
};
const CHIP_TEXT_SIZE_MAP: Record<ChipSize, ChipProps["textStyle"]> = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 18 },
};

export const Chip = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  showCloseIcon,
  selected,
  mode = "outlined",
  style,
  size = "md",
  textStyle,
  ...chipProps
}: ChipProps) => {
  const { colors } = useAppTheme();

  const onPress = () => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.6}>
      <PaperChip
        onPress={onPress}
        onPressOut={onBlur}
        onPressIn={onFocus}
        showSelectedCheck={false}
        onClose={showCloseIcon ? onPress : undefined}
        selectedColor={selected ? colors.onPrimary : colors.onSurface}
        ellipsizeMode="head"
        style={[
          {
            backgroundColor: selected ? colors.primary : "transparent",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: selected ? colors.primary : colors.backdrop,
          },
          CHIP_CONTAINER_SIZE_MAP[size],
          style,
        ]}
        textStyle={[CHIP_TEXT_SIZE_MAP[size], textStyle]}
        {...chipProps}
      >
        {label}
      </PaperChip>
    </TouchableOpacity>
  );
};

export const FormChip = ({ name, selected, ...chipProps }: FormChipProps) => (
  <Field name={name}>
    {({ input }) => (
      <Chip
        {...input}
        onChange={(value) => {
          if (selected) {
            input.onChange(undefined);
            return;
          }
          input.onChange(value);
        }}
        {...chipProps}
        selected={selected}
      />
    )}
  </Field>
);
