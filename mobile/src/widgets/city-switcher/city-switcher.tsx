import type { ProductFiltesFormField } from "@/src/shared/api/products";
import React from "react";
import { withTypes } from "react-final-form";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  BottomSheetView,
  BottomSheetModal,
  useBottomSheetModalRef,
  useAppTheme,
  FormFieldButton,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";
import { CONFIG } from "@/src/shared/config";
import { useProductsFilterContext } from "@/src/features/filter-products";
import { useAuthContext } from "@/src/entities/auth";
import { CITY_LIST } from "@/src/entities/products";

const { Form } = withTypes<ProductFiltesFormField>();

const getSelectedCity = async () => {
  const cityId = await SecureStore.getItemAsync(CONFIG.SELECTED_USER_CITY_KEY);

  if (!cityId) {
    return { label: "choose_city", value: "" };
  }
  const cityItem = CITY_LIST.find((c) => c.value === cityId);
  return cityItem;
};

export const CitySwitcher = () => {
  const { t } = useTranslation(["forms", "buttons"]);
  const sheetRef = useBottomSheetModalRef();
  const queryClient = useQueryClient();
  const { isAuthorized, redirectToSignIn } = useAuthContext();
  const { setFilters, filters } = useProductsFilterContext();
  const { colors } = useAppTheme();
  const i = useSafeAreaInsets();

  const query = useQuery({
    queryKey: [CONFIG.SELECTED_USER_CITY_KEY],
    queryFn: getSelectedCity,
    staleTime: Infinity,
  });
  const selectedCity = query.data;

  if (query.isLoading) {
    return (
      <Text
        variant="titleMedium"
        style={{
          color: colors.onBackground,
          fontWeight: 500,
          opacity: 0.8,
          padding: 8,
        }}
      >
        ...
      </Text>
    );
  }

  if (!isAuthorized) {
    return (
      <TouchableOpacity
        onPress={() => redirectToSignIn({ from: "/(tabs)/(home)/search" })}
        activeOpacity={0.6}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon source="account-arrow-right-outline" size={42} />
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => sheetRef.current?.present()}
      >
        {query.isSuccess &&
          (query.data?.value ? (
            <Text
              variant="titleMedium"
              style={{
                color: colors.onBackground,
                fontWeight: 500,
                opacity: 0.8,
                padding: 8,
              }}
            >
              {t(query.data?.label, { ns: "forms" })}
            </Text>
          ) : (
            <Icon source="map-marker-radius-outline" size={42} />
          ))}
      </TouchableOpacity>

      <BottomSheetModal ref={sheetRef} snapPoints={["60"]}>
        <BottomSheetView style={{ paddingBottom: i.bottom }}>
          <Form
            initialValues={{ city: selectedCity?.value }}
            onSubmit={(fields) => {
              const cityId = fields.city;

              queryClient.resetQueries({ queryKey: ["products"] });
              queryClient.setQueryData<{ value: string; label: string }>(
                [CONFIG.SELECTED_USER_CITY_KEY],
                () => CITY_LIST.find((c) => c.value === cityId)
              );
              setFilters({ ...filters, city: cityId });
              SecureStore.setItem(CONFIG.SELECTED_USER_CITY_KEY, cityId);
              sheetRef.current?.close();
            }}
          >
            {({ handleSubmit, submitting, pristine }) => {
              return (
                <View style={{ paddingHorizontal: 16, gap: 8, flex: 1 }}>
                  {CITY_LIST.map((city) => (
                    <FormFieldButton
                      key={city.value}
                      name="city"
                      title={t(city.label, { ns: "forms" })}
                      value={city.value}
                      rightSlor="chevron-right"
                    />
                  ))}

                  <Button
                    title={t("buttons.apply", { ns: "buttons" })}
                    style={{ marginTop: "auto" }}
                    disabled={submitting || pristine}
                    onPress={handleSubmit}
                  />
                </View>
              );
            }}
          </Form>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
