import { View, StyleSheet } from "react-native";
import { useField, useFormState, withTypes } from "react-final-form";
import {
  FormChip,
  Button,
  IconButton,
  BottomSheet,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@/src/shared/ui-kit";

import {
  CATEGORIES as CATEGORIES_LIST,
  SUB_CATEGORIES_LIST,
} from "@/src/shared/config";
import {
  CONDITIONS_LIST,
  SORT_BY_PRICE_LIST,
  LANGUAGE_TAGS,
  CURRENCY_LIST,
  CITY_LIST,
} from "@/src/entities/products";
import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { useValidationSchema } from "@/src/shared/lib";
import { productFiltersSchema } from "@/src/shared/api/products";
import type { ProductFiltesFormField } from "@/src/shared/api/products";
import { Text } from "react-native-paper";
import { useProductsFilterContext } from "../model/filter.model";
import { useTranslation } from "react-i18next";
import React from "react";

const { Form } = withTypes<ProductFiltesFormField>();

const styles = StyleSheet.create({
  field: {
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const getSubCategoryByCategoryId = (categoryId: string) => {
  return SUB_CATEGORIES_LIST.filter(
    ({ parent_id }) => parent_id === categoryId
  );
};

const Label = ({ text }: { text: string }) => {
  return <Text style={{ fontWeight: 600 }}>{text}</Text>;
};

export const ProductFilterFormCategoryField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation(["categories", "forms"]);
  return (
    <>
      <Label text={t("forms.label.category", { ns: "forms" })} />
      <View style={styles.field}>
        {CATEGORIES_LIST.map((category) => (
          <FormChip
            key={category.value}
            name="category"
            label={t(category.label, { ns: "categories" })}
            value={category.value}
            selected={formState.values.category === category.value}
          />
        ))}
      </View>
    </>
  );
};

export const ProductFilterFormSubCategoryField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation(["categories", "forms"]);
  return (
    <>
      <Label text={t("forms.label.subcategory", { ns: "forms" })} />
      <View style={styles.field}>
        {getSubCategoryByCategoryId(formState.values.category).map(
          (category) => (
            <FormChip
              key={category.value}
              name="subCategory"
              label={t(category.label, { nd: "categories" })}
              value={category.value}
              selected={formState.values.subCategory === category.value}
            />
          )
        )}
      </View>
    </>
  );
};

export const ProductFilterFormCurrencyField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation("forms");
  return (
    <>
      <Label text={t("forms.label.currency", { ns: "forms" })} />
      <View style={styles.field}>
        {CURRENCY_LIST.map((currency) => (
          <FormChip
            key={currency.value}
            name="currency"
            label={t(currency.label, { ns: "forms" })}
            value={currency.value}
            selected={formState.values.currency === currency.value}
          />
        ))}
      </View>
    </>
  );
};

export const ProductFilterFormCityField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation("forms");
  return (
    <>
      <Label text={t("forms.label.city", { ns: "forms" })} />
      <View style={styles.field}>
        {CITY_LIST.map((city) => (
          <FormChip
            key={city.value}
            name="city"
            label={t(city.label, { ns: "forms" })}
            value={city.value}
            selected={formState.values.city === city.value}
          />
        ))}
      </View>
    </>
  );
};

export const ProductFilterFormLanguageTagField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation("forms");
  return (
    <>
      <Label text={t("forms.label.language_tag", { ns: "forms" })} />
      <View style={styles.field}>
        {LANGUAGE_TAGS.map((language) => (
          <FormChip
            key={language.value}
            name="language_tag"
            label={t(language.label, { ns: "forms" })}
            value={language.value}
            selected={formState.values.language_tag === language.value}
          />
        ))}
      </View>
    </>
  );
};

export const BottomSheetProductFilterFormPriceField = () => {
  const priceFromField = useField("priceFrom");
  const priceToField = useField("priceTo");
  const { t } = useTranslation("forms");

  return (
    <>
      <Label text={t("forms.label.price", { ns: "forms" })} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <BottomSheetTextInput
            placeholder={t("forms.input_price_from", { ns: "forms" })}
            numberOfLines={1}
            inputMode="numeric"
            onBlur={() => priceFromField.input.onBlur()}
            onChange={priceFromField.input.onChange}
            onFocus={() => priceFromField.input.onFocus()}
          />
        </View>

        <View style={{ flex: 1 }}>
          <BottomSheetTextInput
            placeholder={t("forms.input_price_to", { ns: "forms" })}
            numberOfLines={1}
            inputMode="numeric"
            onBlur={() => priceToField.input.onBlur()}
            onFocus={() => priceToField.input.onFocus()}
            onChange={priceToField.input.onChange}
          />
        </View>
      </View>
    </>
  );
};

export const ProductFilterFormConditionField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation("forms");
  return (
    <>
      <Label text={t("forms.label.condition", { ns: "forms" })} />
      <View style={styles.field}>
        {CONDITIONS_LIST.map((condition) => (
          <FormChip
            key={condition.value}
            name="condition"
            label={t(condition.label, { ns: "forms" })}
            value={condition.value}
            selected={formState.values.condition === condition.value}
          />
        ))}
      </View>
    </>
  );
};

export const ProductFilterFormSortField = () => {
  const formState = useFormState<ProductFiltesFormField>();
  const { t } = useTranslation("forms");
  return (
    <>
      <Label text={t("forms.label.sort", { ns: "forms" })} />
      <View style={styles.field}>
        {SORT_BY_PRICE_LIST.map((sort) => (
          <FormChip
            key={sort.value}
            name="sort_type"
            label={t(sort.label, { ns: "forms" })}
            value={sort.value}
            selected={formState.values.sort_type === sort.value}
          />
        ))}
      </View>
    </>
  );
};

export const BottomSheetProductFilterForm = React.forwardRef<
  GorhomBottomSheet,
  React.ComponentProps<typeof BottomSheetModal>
>(function BottomSheetFilterForm({ children }, ref) {
  const validate = useValidationSchema(productFiltersSchema);
  const { t } = useTranslation("buttons");
  const { filters, setFilters, resetFilters } = useProductsFilterContext();

  return (
    <BottomSheetModal ref={ref}>
      <BottomSheetScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 16,
        }}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Form
            onSubmit={(fields) => {
              setFilters(fields);
              ref?.current?.close();
            }}
            initialValues={filters}
            validate={validate}
          >
            {({
              handleSubmit,
              submitting,
              pristine,
              invalid,
              values,
              form,
            }) => {
              return (
                <>
                  <View style={{ gap: 8 }}>{children}</View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                      marginTop: 16,
                    }}
                  >
                    <IconButton
                      icon="restore"
                      onPress={() => {
                        resetFilters();
                        form.restart();
                      }}
                      disabled={Object.keys(values).length < 1 || submitting}
                    />

                    <Button
                      title={t("buttons.apply", { ns: "buttons" })}
                      style={{ marginTop: "auto", flex: 1 }}
                      disabled={
                        submitting ||
                        pristine ||
                        invalid ||
                        Object.keys(values).length < 1
                      }
                      onPress={handleSubmit}
                    />
                  </View>
                </>
              );
            }}
          </Form>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
