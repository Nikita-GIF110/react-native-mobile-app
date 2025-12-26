import { useField, useFormState, withTypes } from "react-final-form";
import {
  FormTextInput,
  Button,
  ImagePicker,
  KeyboardAvoidingView,
  LoadingPlaceholder,
  FormFieldButton,
  useSafeAreaInsets,
  useDropdownState,
  Dropdown,
  DropdownAnchor,
  // FadeInView,
} from "@/src/shared/ui-kit";
import { editUserProductSchema } from "@/src/shared/api/products";
import type { CreateProductFormFields } from "@/src/shared/api/products";
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  CURRENCY_LIST,
  CONDITIONS_LIST,
  PROMOTION_TYPE_LIST,
  LANGUAGE_TAGS,
  useFetchProductById,
  CURRENCY_BY_NAME,
} from "@/src/entities/products";
import { CATEGORIES as CATEGORIES_LIST } from "@/src/shared/config";
import { MapStepper } from "@/src/features/map";
import { IconButton, Text } from "react-native-paper";
import {
  useEditProduct,
  setFormInitialValues,
} from "../model/edit-product.model";
import { useValidationSchema } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

const { Form } = withTypes<CreateProductFormFields>();

const styles = StyleSheet.create({
  field: { gap: 8, paddingHorizontal: 16 },
  label: { fontWeight: 600 },
});

const LocationField = () => {
  const { input } = useField<CreateProductFormFields["location"]>("location");

  return (
    <MapStepper
      onChange={input.onChange}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      value={input.value}
    />
  );
};
const ImageField = () => {
  // Бля тут полная залупа творится с валидацией
  // Пока это самы лучшый варик, проверять длину здесть и + еще в самой форме
  // Хватает только проверки что список без картинок с статусом "deleted" не равен 0
  const imageSize = { width: 140, height: 140 };
  const pickerOptions = { selectionLimit: 5, allowsMultipleSelection: true };
  const { input, meta } = useField<CreateProductFormFields["images"]>("images");
  const imagesList = input.value ?? [];
  const imagesLength =
    imagesList && imagesList?.filter((i) => i.status !== "deleted")?.length;

  return (
    <>
      <ImagePicker pickerOptions={pickerOptions} {...input}>
        {({ pickImage, deleteImage, images }) => {
          return (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              scrollEnabled={images.length > 1}
              contentContainerStyle={{ gap: 8 }}
            >
              <ImagePicker.UploadButton
                onUploadImage={pickImage}
                style={imageSize}
              />
              {images &&
                images.map((image, index) => {
                  if (image.status === "deleted") {
                    return null;
                  }

                  return (
                    <View
                      key={image.id}
                      style={{ ...imageSize, position: "relative" }}
                    >
                      <ImagePicker.Image
                        source={{ uri: image.uri }}
                        {...imageSize}
                      />
                      <IconButton
                        icon="close"
                        size={16}
                        mode="contained"
                        style={{ position: "absolute", top: 0, right: 0 }}
                        onPress={() => deleteImage(index)}
                      />
                    </View>
                  );
                })}
            </ScrollView>
          );
        }}
      </ImagePicker>

      {/* <HelperText type="error" visible={meta.touched && imagesLength === 0}>
        Must be min 1 photo
      </HelperText> */}
    </>
  );
};
const SubCategoryField = () => {
  const formState = useFormState<CreateProductFormFields>();
  const { t } = useTranslation(["categories", "common"]);

  const categoryId = formState.values.category;
  const currentCategory = CATEGORIES_LIST.find(
    ({ value }) => value === categoryId
  );
  const optionsList = currentCategory?.subcategories ?? [];

  return optionsList.map((option) => (
    <FormFieldButton
      name="subCategory"
      key={option.value}
      title={t(option.label, { ns: "categories" })}
      value={option.value}
    />
  ));
};
const PriceField = () => {
  const { t } = useTranslation("forms");
  const { input } = useField<CreateProductFormFields["currency"]>("currency");
  const { initialValues } = useFormState<CreateProductFormFields>();
  const { visible, openMenu, closeMenu } = useDropdownState();

  const dropdownAnchorLabel = input.value
    ? t(CURRENCY_BY_NAME[input.value])
    : t(initialValues.currency ?? "");

  return (
    <View style={{ gap: 8, flexDirection: "row" }}>
      <FormTextInput
        name="price"
        inputMode="numeric"
        placeholder={t("forms.input_price", { ns: "forms" })}
        containerStyle={{ flexGrow: 1 }}
        maxLength={9}
      />
      <Dropdown
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={{ gap: 4 }}
        anchor={
          <DropdownAnchor
            label={dropdownAnchorLabel}
            onPress={openMenu}
            style={{ width: 100 }}
          />
        }
      >
        {CURRENCY_LIST.map((option) => (
          <Button
            key={option.value}
            title={t(option.label, { ns: "forms" })}
            variant="surface"
            onPressIn={() => input.onFocus()}
            onPressOut={() => input.onBlur()}
            onPress={() => {
              closeMenu();
              input.onChange(option.value);
            }}
          />
        ))}
      </Dropdown>
    </View>
  );
};

export const EditProductForm = ({ productId }: { productId: string }) => {
  const { onSubmit } = useEditProduct();
  const validate = useValidationSchema(editUserProductSchema);
  const { item } = useFetchProductById(productId);
  const { t } = useTranslation(["categories", "common"]);
  const i = useSafeAreaInsets();

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={setFormInitialValues(item)}
        validate={validate}
      >
        {({ handleSubmit, submitting, pristine, values, invalid }) => {
          const imagesLength = values.images?.filter(
            (i) => i.status !== "deleted"
          ).length;

          return (
            <View style={{ position: "relative", flex: 1 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: i.bottom + 50 + 16 }}
              >
                <KeyboardAvoidingView>
                  <View style={{ gap: 20, flex: 1 }}>
                    {/* Name */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.name", { ns: "forms" })}
                      </Text>
                      <FormTextInput
                        name="name"
                        placeholder={t("forms.input_product_name", {
                          ns: "forms",
                        })}
                      />
                    </View>
                    {/* Description */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.description", { ns: "forms" })}
                      </Text>
                      <FormTextInput
                        name="description"
                        placeholder={t("forms.input_description", {
                          ns: "forms",
                        })}
                        textarea
                      />
                    </View>
                    {/* Images */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.image", { ns: "forms" })}
                      </Text>
                      <ImageField />
                    </View>
                    {/* Category */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.category", { ns: "forms" })}
                      </Text>
                      {CATEGORIES_LIST.map((option) => (
                        <FormFieldButton
                          name="category"
                          key={option.value}
                          title={t(option.label, { ns: "categories" })}
                          value={option.value}
                        />
                      ))}
                    </View>
                    {/* Sub Category */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.subcategory", { ns: "forms" })}
                      </Text>
                      <SubCategoryField />
                    </View>
                    {/* Promotion Type */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.promotion_type", { ns: "forms" })}
                      </Text>
                      {PROMOTION_TYPE_LIST.map((option) => (
                        <FormFieldButton
                          name="promotionType"
                          key={option.value}
                          title={t(option.label, { ns: "forms" })}
                          value={option.value}
                        />
                      ))}
                    </View>
                    {/* Price */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.price", { ns: "forms" })}
                      </Text>
                      <PriceField />
                    </View>
                    {/* Language */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.language_tag", { ns: "forms" })}
                      </Text>
                      {LANGUAGE_TAGS.map((option) => (
                        <FormFieldButton
                          name="language_tag"
                          key={option.value}
                          title={t(option.label, { ns: "forms" })}
                          value={option.value}
                        />
                      ))}
                    </View>
                    {/* Condition */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.condition", { ns: "forms" })}
                      </Text>
                      {CONDITIONS_LIST.map((option) => (
                        <FormFieldButton
                          name="condition"
                          key={option.value}
                          title={t(option.label, { ns: "forms" })}
                          value={option.value}
                        />
                      ))}
                    </View>
                    {/* Location */}
                    <View style={styles.field}>
                      <Text variant="headlineSmall" style={styles.label}>
                        {t("forms.label.location", { ns: "forms" })}
                      </Text>
                      <LocationField />
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  paddingBottom: i.bottom,
                  paddingHorizontal: 16,
                  width: "100%",
                }}
              >
                <LinearGradient
                  colors={["rgba(242, 242, 242,1)", "transparent"]}
                  start={{ x: 0, y: 0.9 }}
                  end={{ x: 0, y: 0 }}
                  style={[StyleSheet.absoluteFill]}
                />

                <Button
                  disabled={submitting || pristine || !imagesLength || invalid}
                  loading={submitting}
                  onPress={handleSubmit}
                  title={t("buttons.submit", { ns: "buttons" })}
                />
              </View>
            </View>
          );
        }}
      </Form>

      {/* <FadeInView
        visible={isPending || !isLoaded}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <LoadingPlaceholder />
      </FadeInView> */}
    </>
  );
};
