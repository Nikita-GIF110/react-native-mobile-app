import { useSafeAreaInsets as useBaseSafeAreaInsets } from "react-native-safe-area-context";
import type { EdgeInsets } from "react-native-safe-area-context";

export const useSafeAreaInsets = (): EdgeInsets => {
  const i = useBaseSafeAreaInsets();
  return {
    top: i.top,
    right: i.right,
    bottom: i.bottom > 0 ? i.bottom : 16,
    left: i.left,
  };
};
