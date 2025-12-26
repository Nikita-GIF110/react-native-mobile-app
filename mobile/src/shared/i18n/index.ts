import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import * as Localization from "expo-localization";

import enButtons from "@/assets/locales/en/buttons.json";
import enCategories from "@/assets/locales/en/categories.json";
import enCommon from "@/assets/locales/en/common.json";
import enForms from "@/assets/locales/en/forms.json";
import enPages from "@/assets/locales/en/pages.json";
import enProduct from "@/assets/locales/en/product.json";
import enUser from "@/assets/locales/en/user.json";

import ruButtons from "@/assets/locales/ru/buttons.json";
import ruCategories from "@/assets/locales/ru/categories.json";
import ruCommon from "@/assets/locales/ru/common.json";
import ruForms from "@/assets/locales/ru/forms.json";
import ruPages from "@/assets/locales/ru/pages.json";
import ruProduct from "@/assets/locales/ru/product.json";
import ruUser from "@/assets/locales/ru/user.json";
// optional: для persistence
// import AsyncStorage from '@react-native-async-storage/async-storage';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      categories: enCategories,
      buttons: enButtons,
      forms: enForms,
      pages: enPages,
      product: enProduct,
      user: enUser,
    },
    ru: {
      common: ruCommon,
      categories: ruCategories,
      buttons: ruButtons,
      forms: ruForms,
      pages: ruPages,
      product: ruProduct,
      user: ruUser,
    },
  },
  lng: "ru", // deviceLanguage
  fallbackLng: "ru",
  debug: false,
  ns: ["common", "home"], // загружаем общий namespace
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
