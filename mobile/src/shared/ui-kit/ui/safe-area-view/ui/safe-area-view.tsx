import React from "react";
import { View } from "react-native";
import type { Edge, EdgeRecord } from "react-native-safe-area-context";
import { SafeAreaView as ReactNativeSafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "../model/safe-area-insets.model";

export const SafeAreaView = ({
  edges,
  style,
  children,
  ...rest
}: React.ComponentProps<typeof ReactNativeSafeAreaView>) => {
  const i = useSafeAreaInsets();

  const nativeEdges = React.useMemo(() => {
    if (edges == null) {
      return i;
    }

    const edgesObj = Array.isArray(edges)
      ? edges.reduce<EdgeRecord>((acc, edge: Edge) => {
          acc[edge] = "additive";
          return acc;
        }, {})
      : // ts has trouble with refining readonly arrays.
        (edges as EdgeRecord);

    // make sure that we always pass all edges, required for fabric
    const requiredEdges: Record<Edge, number> = {
      top: edgesObj.top ? i.top : 0,
      right: edgesObj.right ? i.right : 0,
      bottom: edgesObj.bottom ? i.bottom : 0,
      left: edgesObj.left ? i.left : 0,
    };

    return requiredEdges;
  }, [edges]);

  return (
    <View
      {...rest}
      style={[
        {
          flex: 1,
          paddingTop: nativeEdges.top,
          paddingRight: nativeEdges.right,
          paddingBottom: nativeEdges.bottom,
          paddingLeft: nativeEdges.left,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
