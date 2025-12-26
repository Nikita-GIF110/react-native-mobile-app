import {
  BaseToast,
  BaseToastProps,
  ToastConfig,
} from "react-native-toast-message";

const toastProps: BaseToastProps = {
  text1NumberOfLines: 100,
  text2NumberOfLines: 100,
  style: {
    height: "auto",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  text1Style: { fontSize: 15 },
  text2Style: { fontSize: 14 },
};
export const TOAST_CONFIG: ToastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[
        toastProps.style,
        {
          borderLeftColor: "#69C779",
        },
      ]}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[
        toastProps.style,
        {
          borderLeftColor: "#FE6301",
        },
      ]}
    />
  ),
  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      {...toastProps}
      style={[
        toastProps.style,
        {
          borderLeftColor: "#FFC107",
        },
      ]}
    />
  ),
};
