import React from "react";
import type { ComponentProps } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { TextInput as ReactNativeTextInput } from "react-native";
import { View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { useAppTheme } from "../../models/theme.model";
import { BottomSheetTextInput as GorhomBottomSheetTextInput } from "@gorhom/bottom-sheet";

type TextInputSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<TextInputSize, StyleProp<TextStyle>> = {
  sm: { height: 35, fontSize: 14, paddingHorizontal: 16 },
  md: { height: 40, fontSize: 16, paddingHorizontal: 16 },
  lg: { height: 50, fontSize: 18, paddingHorizontal: 16 },
};

interface TextInputProps extends React.ComponentProps<typeof PaperTextInput> {
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textarea?: boolean;
  size?: TextInputSize;
}

export const TextInput = ({
  mode = "outlined",
  helperText,
  error,
  style,
  multiline,
  containerStyle,
  textarea,
  size = "lg",
  ...rest
}: TextInputProps) => {
  const sizeStyle = SIZE_MAP[size];
  const { colors, borderRadius } = useAppTheme();

  const textInputProps = {
    value: rest.value,
    defaultValue: rest.defaultValue,
    onChangeText: rest.onChangeText,
    onChange: rest.onChange,
    onFocus: rest.onFocus,
    onBlur: rest.onBlur,
    onSubmitEditing: rest.onSubmitEditing,
    secureTextEntry: rest.secureTextEntry,
    keyboardType: rest.keyboardType,
    autoCapitalize: rest.autoCapitalize,
    autoCorrect: rest.autoCorrect,
    editable: rest.editable,
    maxLength: rest.maxLength,
    inputMode: rest.inputMode,
    disabled: rest.disabled,
    placeholder: rest.placeholder,
  };

  return (
    <View style={[containerStyle, textarea && { height: 120 }]}>
      <ReactNativeTextInput
        multiline={multiline || textarea}
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.secondary,
            color: colors.onSurface,
            flex: 1,
          },
          sizeStyle,
          style,
        ]}
        placeholderTextColor={colors.onSurface}
        {...textInputProps}
      />
      {/* <HelperText type="error" visible={error} style={{ paddingHorizontal: 0 }}>
        {helperText}
      </HelperText> */}
    </View>
  );
};

export const PasswordTextInput = (
  inputProps: ComponentProps<typeof TextInput>
) => {
  const [secureTextEntry, setSecureTextEntry] = React.useState<boolean>(true);

  const onToggleShow = () => {
    setSecureTextEntry((prevState) => !prevState);
  };

  return (
    <TextInput
      {...inputProps}
      secureTextEntry={secureTextEntry}
      right={
        <PaperTextInput.Icon
          icon={secureTextEntry ? "eye" : "eye-off"}
          onPress={onToggleShow}
          size={22}
        />
      }
    />
  );
};

export const BottomSheetTextInput = ({
  containerStyle,
  style,
  size = "lg",
  ...props
}: {
  containerStyle?: StyleProp<ViewStyle>;
  size?: TextInputSize;
} & React.ComponentProps<typeof GorhomBottomSheetTextInput>) => {
  const sizeStyle = SIZE_MAP[size];
  const { colors, borderRadius } = useAppTheme();

  return (
    <View style={containerStyle}>
      <GorhomBottomSheetTextInput
        style={[
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.secondary,
            color: colors.onSurface,
          },
          sizeStyle,
          style,
        ]}
        placeholderTextColor={colors.onSurface}
        {...props}
      />
      {/* <HelperText type="error" visible={error} style={{ paddingHorizontal: 0 }}>
        {helperText}
      </HelperText> */}
    </View>
  );
};
