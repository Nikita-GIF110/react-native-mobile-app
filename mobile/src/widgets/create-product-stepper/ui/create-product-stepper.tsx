import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { priceFormatter, useValidationSchema } from "@/src/shared/lib";
import { withTypes, useField, useForm, useFormState } from "react-final-form";
import type { CreateProductFormFields } from "@/src/shared/api/products";
import { createProductSchema } from "@/src/shared/api/products";
import { useTranslation } from "react-i18next";
import {
  Button,
  Fade,
  LoadingPlaceholder,
  KeyboardAvoidingView,
  ContentPlaceholder,
  FlatList,
  PageTitle,
  useAppTheme,
  FormImagePicker,
  FormTextInput,
  IconButton,
  Appbar,
  BackActionButton,
  StepperProvider,
  useStepper,
  Dropdown,
  useDropdownState,
  DropdownAnchor,
  FormFieldButton,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { MapStepper } from "@/src/features/map";
import {
  CONDITIONS_LIST,
  PROMOTION_TYPE_LIST,
  LANGUAGE_TAGS,
  CURRENCY_LIST,
  CURRENCY_BY_NAME,
  LANGUAGE_BY_NAME,
} from "@/src/entities/products";
import { CATEGORIES as CATEGORIES_LIST } from "@/src/shared/config";
import { useRouter } from "expo-router";
import { PreviewProduct } from "@/src/features/previews";
import { LocationOverview } from "@/src/features/map";
import { ProductOverview } from "@/src/features/product-overview";
import { CategoryTitle } from "@/src/features/category-title";
import { useCreateProduct } from "../model/create-product.model";

const { Form } = withTypes<CreateProductFormFields>();

const ExitButton = () => {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation("buttons");

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => router.replace("/")}
      style={{ padding: 4 }}
    >
      <Text variant="labelLarge" style={{ color: colors.onBackground }}>
        {t("buttons.exit", { ns: "buttons" })}
      </Text>
    </TouchableOpacity>
  );
};
const StpperHeader = ({ pageTitle }: { pageTitle: string }) => {
  const { isCanGoBack, onBack } = useStepper();

  return (
    <Appbar style={{ marginBottom: 8, marginHorizontal: -16 }}>
      {isCanGoBack && <BackActionButton onPress={onBack} />}

      <PageTitle style={{ flex: 1 }}>{pageTitle}</PageTitle>
      <ExitButton />
    </Appbar>
  );
};

const CategoryStep = () => {
  const { t } = useTranslation(["categories", "pages"]);
  return (
    <>
      <Appbar
        style={{
          marginBottom: 8,
          justifyContent: "flex-start",
          marginHorizontal: -16,
        }}
      >
        <BackActionButton />
        <PageTitle style={{ flex: 1 }}>
          {t("create_product_page.category_step", {
            ns: "pages",
          })}
        </PageTitle>
      </Appbar>

      {CATEGORIES_LIST.map((option) => (
        <FormFieldButton
          key={option.value}
          name="category"
          title={t(option.label, { ns: "categories" })}
          value={option.value}
          rightSlor="chevron-right"
          style={{ marginBottom: 8, flex: 0 }}
        />
      ))}
    </>
  );
};
const SubcategoriesStep = () => {
  const formState = useFormState<CreateProductFormFields>();
  const { t } = useTranslation(["categories", "common"]);
  const { onBack } = useStepper();

  const categoryId = formState.values.category;
  const currentCategory = CATEGORIES_LIST.find(
    ({ value }) => value === categoryId
  );
  const optionsList = currentCategory?.subcategories ?? [];

  return (
    <>
      <Appbar
        style={{
          marginBottom: 8,
          justifyContent: "flex-start",
          marginHorizontal: -16,
        }}
      >
        <BackActionButton onPress={onBack} />
        <View style={{ flex: 1 }}>
          <CategoryTitle categoryId={categoryId} />
        </View>
        <ExitButton />
      </Appbar>

      <FlatList
        data={optionsList}
        isListLoaded
        ListEmptyComponent={
          <ContentPlaceholder
            subHeader={t("common.empty_list_text", { ns: "common" })}
          />
        }
        renderItem={({ item }) => (
          <FormFieldButton
            key={item.value}
            name="subCategory"
            title={t(item.label, { ns: "categories" })}
            value={item.value}
            rightSlor="chevron-right"
          />
        )}
      />
    </>
  );
};
const PromotionTypeStep = () => {
  const { t } = useTranslation(["pages", "forms"]);
  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.promotion_type_step", {
          ns: "pages",
        })}
      />
      {PROMOTION_TYPE_LIST.map((option) => (
        <FormFieldButton
          key={option.value}
          name="promotionType"
          title={t(option.label, { ns: "forms" })}
          value={option.value}
          style={{ marginBottom: 8, flex: 0 }}
        />
      ))}
    </>
  );
};
const ImagesStep = () => {
  const { t } = useTranslation("pages");

  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.images_step", { ns: "pages" })}
      />

      <FormImagePicker
        name="images"
        pickerOptions={{ selectionLimit: 5, allowsMultipleSelection: true }}
      >
        {({ pickImage, images, deleteImage }) => {
          const imageHeight = 160;

          return (
            <>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {images &&
                  images.map((image, index) => (
                    <View
                      key={image.uri}
                      style={{ height: imageHeight, width: "48%" }}
                    >
                      <FormImagePicker.Image
                        source={{ uri: image.uri }}
                        style={{ width: "100%", height: "100%" }}
                      />

                      <IconButton
                        icon="close"
                        size="sm"
                        style={{ position: "absolute", top: 8, right: 8 }}
                        onPress={() => deleteImage(index)}
                      />
                    </View>
                  ))}
                {images.length < 5 && (
                  <FormImagePicker.UploadButton
                    onUploadImage={pickImage}
                    style={{ width: "48%", height: imageHeight }}
                  />
                )}
              </View>
            </>
          );
        }}
      </FormImagePicker>
    </>
  );
};
const NameStep = () => {
  const { t } = useTranslation(["pages", "forms"]);
  const { input } =
    useField<CreateProductFormFields["language_tag"]>("language_tag");
  const { initialValues } = useFormState<CreateProductFormFields>();
  const { visible, openMenu, closeMenu } = useDropdownState();

  const dropdownAnchorLabel = input.value
    ? t(LANGUAGE_BY_NAME[input.value], { ns: "forms" })
    : t(initialValues.currency ?? "");

  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.name_step", { ns: "pages" })}
      />
      <View style={{ gap: 8, flexDirection: "row" }}>
        <FormTextInput
          name="name"
          placeholder={t("forms.input_product_name", { ns: "forms" })}
          containerStyle={{ flex: 1 }}
        />

        <Dropdown
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{ gap: 4 }}
          anchor={
            <DropdownAnchor
              label={dropdownAnchorLabel}
              onPress={openMenu}
              contentStyle={{ width: 40 }}
            />
          }
        >
          {LANGUAGE_TAGS.map((option) => (
            <Button
              key={option.value}
              title={t(option.label, { ns: "forms" })}
              onPressIn={() => input.onFocus()}
              onPressOut={() => input.onBlur()}
              variant="surface"
              onPress={() => {
                closeMenu();
                input.onChange(option.value);
              }}
            />
          ))}
        </Dropdown>
      </View>
    </>
  );
};
const PriceStep = () => {
  const { t } = useTranslation(["forms", "pages"]);
  const { input } = useField<CreateProductFormFields["currency"]>("currency");
  const { initialValues } = useFormState<CreateProductFormFields>();
  const { visible, openMenu, closeMenu } = useDropdownState();

  const dropdownAnchorLabel = input.value
    ? t(CURRENCY_BY_NAME[input.value], { ns: "forms" })
    : t(initialValues.currency ?? "");

  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.price_step", { ns: "pages" })}
      />

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
    </>
  );
};
const ConditionStep = () => {
  const { t } = useTranslation("pages");
  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.condition_step", { ns: "pages" })}
      />

      <View style={{ flex: 1, gap: 8 }}>
        {CONDITIONS_LIST.map((option) => (
          <FormFieldButton
            key={option.value}
            name="condition"
            title={t(option.label, { ns: "forms" })}
            value={option.value}
          />
        ))}
        <FormTextInput
          name="description"
          placeholder={t("forms.input_description", { ns: "forms" })}
          textarea
        />
      </View>
    </>
  );
};
const LocationField = () => {
  const { t } = useTranslation("pages");
  const { input, meta } =
    useField<CreateProductFormFields["location"]>("location");

  const checkLocationErros = (errors: unknown) => {
    if (
      typeof errors === "object" &&
      errors !== null &&
      "display_name" in errors &&
      typeof errors.display_name === "string"
    ) {
      return errors.display_name;
    }

    if (
      typeof errors === "object" &&
      errors !== null &&
      "place_id" in errors &&
      typeof errors.place_id === "string"
    ) {
      return errors.place_id;
    }

    if (
      typeof errors === "object" &&
      errors !== null &&
      "city" in errors &&
      typeof errors.city === "string"
    ) {
      return errors.city;
    }

    if (
      typeof errors === "object" &&
      errors !== null &&
      "house_number" in errors &&
      typeof errors.house_number === "string"
    ) {
      return errors.house_number;
    }
    return "";
  };

  return (
    <>
      <StpperHeader
        pageTitle={t("create_product_page.location_step", { ns: "pages" })}
      />

      <MapStepper
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={input.value}
        error={meta.touched && meta.error}
        helperText={checkLocationErros(meta.error)}
      />
    </>
  );
};
const FooterButtons = () => {
  const { errors } = useFormState();
  const { submit } = useForm();
  const { activeStepIndex, isCanGoNext, onNext } = useStepper();
  const { t } = useTranslation("buttons");

  const activeStepName = steps[activeStepIndex].name;

  const categoryFieldInvalid =
    activeStepName === "category" ? errors["category"] : false;

  const subCategoryFieldInvalid =
    activeStepName === "subCategory" ? errors["subCategory"] : false;

  const priceFieldInvalid =
    activeStepName === "price" ? errors["price"] : false;

  const descriptionFieldInvalid =
    activeStepName === "condition" ? errors["description"] : false;

  const imagesFieldInvalid =
    activeStepName === "images" ? errors["images"] : false;

  const nameFieldInvalid = activeStepName === "name" ? errors["name"] : false;

  const locationFieldInvalid =
    activeStepName === "location" ? errors["location"] : false;

  const disabledContinueBtn =
    imagesFieldInvalid ||
    priceFieldInvalid ||
    descriptionFieldInvalid ||
    nameFieldInvalid ||
    subCategoryFieldInvalid ||
    categoryFieldInvalid ||
    locationFieldInvalid;

  return (
    <View>
      {isCanGoNext ? (
        <Button
          disabled={disabledContinueBtn}
          onPress={onNext}
          title={t("buttons.continue", { ns: "buttons" })}
        />
      ) : (
        <Button
          onPress={submit}
          disabled={disabledContinueBtn}
          title={t("buttons.publish", { ns: "buttons" })}
          variant="tertiary"
        />
      )}
    </View>
  );
};
const ProducPreviewStep = () => {
  const { t } = useTranslation("common");
  const { onBack } = useStepper();
  const { values } = useFormState<CreateProductFormFields>();

  const images = !values?.images
    ? []
    : values?.images.map((image) => image.uri);

  return (
    <>
      <Appbar style={{ marginBottom: 8, marginHorizontal: -16 }}>
        <BackActionButton onPress={onBack} />
        <PreviewProduct
          name={values.name}
          imageUri={values?.images[0]?.uri}
          isLoading={false}
          price={priceFormatter(
            parseInt(values?.price, 10),
            t(values.currency)
          )}
        />
      </Appbar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        <ProductOverview
          price={priceFormatter(parseInt(values?.price, 10), values?.currency)}
          condition={t(values?.condition ?? "")}
          description={values?.description ?? ""}
          creationTime={t("product.created_days_ago", {
            days: 0,
            ns: "product",
          })}
          images={images}
          name={values.name}
        />
        <LocationOverview location={values?.location} />
      </ScrollView>
    </>
  );
};

export const steps: {
  name: string;
  component: React.ReactNode;
}[] = [
  {
    name: "category",
    component: <CategoryStep />,
  },
  {
    name: "subCategory",
    component: <SubcategoriesStep />,
  },
  {
    name: "promotionType",
    component: <PromotionTypeStep />,
  },
  {
    name: "images",
    component: <ImagesStep />,
  },
  {
    name: "name",
    component: <NameStep />,
  },
  {
    name: "price",
    component: <PriceStep />,
  },
  {
    name: "location",
    component: <LocationField />,
  },
  {
    name: "condition",
    component: <ConditionStep />,
  },
  {
    name: "final",
    component: <ProducPreviewStep />,
  },
];

const StepsComponent = () => {
  const { activeStepIndex } = useStepper();
  return steps[activeStepIndex].component;
};

export const CreateProductStepper = () => {
  const { onCreate, initialValues } = useCreateProduct();
  const validate = useValidationSchema(createProductSchema);
  const i = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Form
        onSubmit={onCreate}
        validate={validate}
        initialValues={initialValues}
      >
        {({ submitting }) => {
          return (
            <>
              <StepperProvider stepsLength={steps.length}>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                  <View style={{ marginHorizontal: 16, flex: 1 }}>
                    <StepsComponent />
                  </View>
                </KeyboardAvoidingView>

                <View style={{ marginHorizontal: 16, paddingBottom: i.bottom }}>
                  <FooterButtons />
                </View>
              </StepperProvider>

              <Fade
                visible={submitting}
                style={{ position: "absolute", width: "100%", height: "100%" }}
              >
                <LoadingPlaceholder />
              </Fade>
            </>
          );
        }}
      </Form>
    </View>
  );
};
