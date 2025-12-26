import GorhomBottomSheet, {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetModal as GorhomBottomSheetModal,
} from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "../models/theme.model";

export const BottomSheetHandle = ({ onClose }: { onClose?: () => void }) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        borderTopStartRadius: borderRadius.primary,
        borderTopEndRadius: borderRadius.primary,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative",
        backgroundColor: colors.background,
        height: 40,
      }}
    >
      <View
        style={{
          width: 60,
          height: 6,
          backgroundColor: colors.onBackground,
          borderRadius: 20,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
          opacity: 0.6,
        }}
      />
    </View>
  );
};
export const BottomSheetScrollView = ({
  style,
  ...rest
}: React.ComponentProps<typeof GorhomBottomSheetScrollView>) => {
  const { colors } = useAppTheme();

  return (
    <GorhomBottomSheetScrollView
      style={[
        {
          // paddingBottom: 16,
          backgroundColor: colors.background,
        },
        style,
      ]}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
};
export const BottomSheetView = ({
  style,
  ...rest
}: React.ComponentProps<typeof GorhomBottomSheetView>) => {
  const { colors } = useAppTheme();

  return (
    <GorhomBottomSheetView
      style={[
        {
          flex: 1,
          // paddingBottom: 16,
          backgroundColor: colors.background,
        },
        style,
      ]}
      {...rest}
    />
  );
};
export const BottomSheet = React.forwardRef<
  GorhomBottomSheet,
  React.ComponentProps<typeof GorhomBottomSheet>
>(function BottomSheet(
  {
    enablePanDownToClose = true,
    enableHandlePanningGesture = true,
    snapPoints = ["95%"],
    ...rest
  }: React.ComponentProps<typeof GorhomBottomSheet>,
  ref
) {
  const { colors } = useAppTheme();

  return (
    <GorhomBottomSheet
      ref={ref}
      index={-1}
      detached={false}
      // Для того чтобы убрать возможность закрыть свайпом должно быть
      // enablePanDownToClose = false | enableHandlePanningGesture = false
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={enableHandlePanningGesture}
      topInset={16}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleComponent={() => (
        <BottomSheetHandle
          // onClose={
          //   !enablePanDownToClose && !enableHandlePanningGesture
          //     ? undefined
          //     : ref?.current?.close
          // }
        />
      )}
      backdropComponent={(props) => (
        <GorhomBottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1} // когда index -1 (закрыто) — скрыть backdrop
          appearsOnIndex={0} // начиная с 0 — показывать backdrop
          pressBehavior="close" // при нажатии по backdrop закрыть
          opacity={0.3}
        />
      )}
      snapPoints={snapPoints}
      {...rest}
    />
  );
});
export const BottomSheetModal = React.forwardRef<
  GorhomBottomSheetModal,
  React.ComponentProps<typeof GorhomBottomSheetModal>
>(function BottomSheetModal(
  {
    enablePanDownToClose = true,
    enableHandlePanningGesture = true,
    snapPoints = ["95%"],
    ...rest
  }: React.ComponentProps<typeof GorhomBottomSheetModal>,
  ref
) {
  const { colors } = useAppTheme();

  return (
    <GorhomBottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={enableHandlePanningGesture}
      topInset={16}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleComponent={() => (
        <BottomSheetHandle onClose={ref?.current?.close} />
      )}
      backdropComponent={(props) => (
        <GorhomBottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1} // когда index -1 (закрыто) — скрыть backdrop
          appearsOnIndex={0} // начиная с 0 — показывать backdrop
          pressBehavior="close" // при нажатии по backdrop закрыть
          opacity={0.3}
        />
      )}
      {...rest}
    />
  );
});

export const useBottomSheetRef = () => {
  const sheetRef = React.useRef<GorhomBottomSheet>(null);
  return sheetRef;
};
export const useBottomSheetModalRef = () => {
  const sheetRef = React.useRef<GorhomBottomSheetModal>(null);
  return sheetRef;
};
