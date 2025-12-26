export type ProductCondition = "NEW" | "USED";
// TODO: вынести в костанту # 0 - Deleted, 1 - Opened, 2 - Hidden, 3 - Sold, 4 - Moderation
export type ProductStatus = 0 | 1 | 2 | 3 | 4;
// ProductModerationStatus -> 0 на модерации / 1 одобрено / 2 отклонено
export type ProductModerationStatus = 0 | 1 | 2;

export interface ProductEntity {
  category: number;
  condition: ProductCondition;
  creationTime: string;
  currency: string;
  description: string;
  user_email: string;
  id: number;
  image_urls: { url: string }[];
  likes: number;
  location: {
    place_id: number;
    country: string;
    house_number: string;
    road: string;
    suburb: string;
    neighbourhood: string;
    lat: string;
    lon: string;
    display_name: string;
  };
  name: string;
  price: number;
  promotionType: number;
  subCategory: number;
  user_id: number;
  views: number;
  isLiked: boolean;
  isSelf: boolean;
  sell_price: number;
  statement: ProductStatus;
  is_moderation: boolean;
  is_blocked: boolean;
  moderation_status: ProductModerationStatus;
  moderation_comment: string;
}

export type ProductOverviewEntity = {
  product: ProductEntity;
  similars: ProductEntity[];
  dialog_id: number | null;
};

export interface CreateProductFormFields {
  name: string;
  category: string;
  subCategory: string;
  images: {
    id: string;
    uri: string;
    name: string;
    type: string;
    status: string;
  }[];
  price: string;
  description: string;
  location: {
    place_id: number;
    country?: string;
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    lat: string;
    lon: string;
    display_name?: string;
    city: string;
  };
  condition: ProductCondition;
  currency: string;
  promotionType: string;
  language_tag: string;
  id: number;
}

export interface ProductFiltesFormField {
  city: string;
  category: string;
  subCategory: string;
  priceFrom: string;
  priceTo: string;
  condition: string;
  sort_type: string;
  location: string;
  prompt: string;
  language_tag: string;
  page: number;
  currency: string
  id: string
}

export interface MyProductFiltesFormField {
  status: string;
}

export interface ChangeProductStatusFormField {
  status: ProductStatus;
  product_id: number;
}

export interface SellProductFormFields {
  sell_price: string;
  product_id: number;
}
