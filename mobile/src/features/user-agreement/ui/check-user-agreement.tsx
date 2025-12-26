import React from "react";
import {
  BottomSheetScrollView,
  BottomSheetModal,
  Button,
  useSafeAreaInsets,
  useBottomSheetModalRef,
} from "@/src/shared/ui-kit";
import { Alert, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import {
  useAcceptNewEula,
  useCheckUserAgreement,
  useFetchEula,
} from "../model/user-agreement.model";
import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

export const Eula = () => {
  const { eulaList } = useFetchEula();

  return (
    <View style={{ paddingHorizontal: 12, gap: 20 }}>
      {eulaList.map(({ section, text }) => (
        <View key={section.ru} style={{ gap: 4 }}>
          <Text variant="headlineSmall" style={{ fontWeight: 600 }}>
            {section.ru}
          </Text>
          <Text>{text.ru}</Text>
        </View>
      ))}
    </View>
  );
};

export const BottomSheetEula = React.forwardRef<GorhomBottomSheet, unknown>(
  function BottomSheetEula(_props, ref) {
    const i = useSafeAreaInsets();

    return (
      <BottomSheetModal ref={ref} index={0}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: i.bottom }}
        >
          <Eula />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export const CheckUserAgreement = () => {
  const { hasNewEula } = useCheckUserAgreement();
  const sheetModalRef = useBottomSheetModalRef();
  const { t } = useTranslation(["user", "buttons"]);
  const i = useSafeAreaInsets();
  const acceptNewEulaMutation = useAcceptNewEula();

  React.useEffect(() => {
    if (hasNewEula) {
      Alert.alert(t("user.has_new_agreement", { ns: "user" }), "", [
        {
          text: t("buttons.show_new_eula", { ns: "buttons" }),
          onPress: () => {
            sheetModalRef.current?.present();
          },
          style: "default",
        },
      ]);
    }
  }, [hasNewEula]);

  const onAcceptNewEula = async () => {
    acceptNewEulaMutation.mutate(undefined, {
      onSuccess: () => {
        sheetModalRef.current?.close();
      },
    });
  };

  return (
    <BottomSheetModal
      ref={sheetModalRef}
      index={0}
      enablePanDownToClose={false}
      containerStyle={{ position: "relative" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: i.bottom + 66,
        }}
      >
        <Eula />
      </BottomSheetScrollView>

      <View
        style={{
          paddingBottom: i.bottom,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <LinearGradient
          colors={["rgba(242, 242, 242,1)", "transparent"]}
          start={{ x: 0, y: 0.9 }}
          end={{ x: 0, y: 0 }}
          style={[StyleSheet.absoluteFill]}
        />

        <Button
          title={t("buttons.i_agree", { ns: "buttons" })}
          onPress={onAcceptNewEula}
        />
      </View>
    </BottomSheetModal>
  );
};
