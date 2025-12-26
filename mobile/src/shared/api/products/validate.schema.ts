import { object, string, ObjectSchema, number, array, mixed } from "yup";
import type {
  ProductFiltesFormField,
  CreateProductFormFields,
} from "./entities";

export const productFiltersSchema: ObjectSchema<
  Partial<ProductFiltesFormField>
> = object({
  city: string(),
  category: string(),
  subCategory: string(),
  priceFrom: string()
    .min(0, "Minimum 1 character")
    .max(9, "Maximum 9 characters"),
  priceTo: string()
    .min(1, "Minimum 1 character")
    .max(9, "Maximum 9 characters"),
  condition: string(),
  sort_type: string(),
  location: string(),
  prompt: string(),
  language_tag: string(),
  page: number(),
  currency: string(),
  id: string(),
});

export const createProductSchema: ObjectSchema<
  Omit<CreateProductFormFields, "id">
> = object({
  name: string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters")
    .required("Name is required"),
  description: string()
    .min(10, "Minimum 10 characters")
    .max(1000, "Maximum 1000 characters")
    .required("Description is required"),
  price: string()
    .min(1, "Minimum 1 character")
    .max(9, "Maximum 9 characters")
    .required("Price is required"),
  images: array(
    object({
      id: string().required(),
      uri: string().required(),
      name: string().required(),
      type: string().required(),
      status: string().required(),
    })
  )
    .min(1, "Must be min 1 photo")
    .max(5, "Must be max 5 photo")
    .required(),
  category: string().required(),
  subCategory: string().required(),
  condition: mixed<CreateProductFormFields["condition"]>()
    .oneOf(["NEW", "USED"])
    .required(),
  currency: string().required(),
  promotionType: string().required(),
  language_tag: string().required(),
  location: object({
    place_id: number().required("The house/street is incorrect."),
    country: string(),
    house_number: string(),
    road: string(),
    suburb: string(),
    neighbourhood: string(),
    lat: string().required("The house/street is incorrect."),
    lon: string().required("The house/street is incorrect."),
    display_name: string(),
    city: string().required("The city is incorrect."),
  }).required(),
});

export const editUserProductSchema: ObjectSchema<CreateProductFormFields> =
  object({
    name: string()
      .min(3, "Minimum 3 characters")
      .max(30, "Maximum 30 characters")
      .required("Name is required"),
    description: string()
      .min(10, "Minimum 10 characters")
      .max(1000, "Maximum 1000 characters")
      .required("Description is required"),
    price: string()
      .min(1, "Minimum 1 character")
      .max(9, "Maximum 9 characters")
      .required("Price is required"),
    images: array(
      object({
        id: string().required(),
        uri: string().required(),
        name: string().required(),
        type: string().required(),
        status: string().required(),
      })
    )
      // это потому что после удаления фотка получает статус deleted image.status === "deleted"
      // .min(2, "Must be min 1 photo")
      // .max(6, "Must be max 5 photo")
      .required(),
    category: string().required(),
    subCategory: string().required(),
    condition: mixed<CreateProductFormFields["condition"]>()
      .oneOf(["NEW", "USED"])
      .required(),
    currency: string().required(),
    promotionType: string().required(),
    language_tag: string().required(),
    id: number().required(),
    location: object({
      place_id: number().required("The house/street is incorrect."),
      country: string(),
      house_number: string(),
      road: string(),
      suburb: string(),
      neighbourhood: string(),
      lat: string().required("The house/street is incorrect."),
      lon: string().required("The house/street is incorrect."),
      display_name: string(),
      city: string().required("The city is incorrect."),
    }).required(),
  });
