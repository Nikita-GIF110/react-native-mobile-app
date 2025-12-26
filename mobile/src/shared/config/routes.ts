export const ROUTES = {
  HOME: "/",
  PRODUCT_OVERVIEW: "/(no-tabs)/product-overview/[id]",
  PRODUCT_CREATE_INTRO: "/(tabs)/create-product",
  PRODUCT_CREATE: "/(no-tabs)/create-product",
  PRODUCT_CATEGORY: "/(tabs)/(home)/category/[id]",

  LIKED_PRODUCTS: "/(tabs)/liked-products",

  SEARCH: "/(tabs)/(home)/search",

  CHATS: "/(tabs)/chats",
  CHAT_OVERVIEW: "/(no-tabs)/chat/[id]",

  USER_PROFILE: "/(tabs)/profile",
  USER_PROFILE_PRODUCTS: "/(no-tabs)/my-products",
  USER_PROFILE_SETTINGS: "/(no-tabs)/settings/index",
  USER_PROFILE_CHANGE_NAME: "/(no-tabs)/settings/change-name",
  USER_PROFILE_CHANGE_PHOTO: "/(no-tabs)/settings/change-photo",
  USER_PROFILE_CHANGE_PASSWORD: "/(no-tabs)/settings/change-password",
  USER_PROFILE_PRODUCT_OVERVIEW: "/(no-tabs)/my-product-overview/[id]",
  USER_PROFILE_PRODUCT_EDIT: "/(no-tabs)/edit-product/[id]",

  OTHER_USER_PROFILE_OVERVIEW: "/(no-tabs)/user/[id]",

  SIGN_IN: "/(auth)/sign-in",
  REGISTRATION: "/(auth)/registration",
  RECOVER_PASSWORD: "/(auth)/recover-password",
} as const;
