import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { TOAST_CONFIG } from "@/src/shared/config";
import { useSafeAreaInsets } from "@/src/shared/ui-kit";

export const ToastContainer = () => {
  const insets = useSafeAreaInsets();

  return (
    <Toast
      position="top"
      bottomOffset={insets.bottom * 4}
      topOffset={insets.top}
      config={TOAST_CONFIG}
    />
  );
};
