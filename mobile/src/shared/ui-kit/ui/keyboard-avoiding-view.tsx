import React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView as ReactNativeKeyboardAvoidingView,
} from "react-native";

export const KeyboardAvoidingView = ({
  children,
  style,
  ...rest
}: React.ComponentProps<typeof ReactNativeKeyboardAvoidingView>) => {
  return (
    <ReactNativeKeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{ width: "100%" }, style]}
      {...rest}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
      </TouchableWithoutFeedback>
    </ReactNativeKeyboardAvoidingView>
  );
};
