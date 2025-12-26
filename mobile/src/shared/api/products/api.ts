import { instance } from "../instance";
import type {
  ProductEntity,
  ProductOverviewEntity,
  ProductFiltesFormField,
  ProductStatus,
} from "./entities";
import { AxiosRequestConfig } from "axios";

export const products = {
  getProductsList: async (
    params?: Partial<ProductFiltesFormField>,
    config?: AxiosRequestConfig<ProductEntity>
  ) => {
    return instance().get<ProductEntity[]>("/products/", {
      ...config,
      params,
    });
  },

  getLikedProductsList: async (
    params: { page: number; limit?: number },
    config?: AxiosRequestConfig<ProductEntity>
  ) => {
    return instance().get<ProductEntity[]>("/liked-products/", {
      ...config,
      params,
    });
  },
  getSelfUserProducts: async (
    params: { type: number; page: number },
    config?: AxiosRequestConfig<ProductEntity>
  ) => {
    return instance().get<ProductEntity[]>("/self-products/", {
      ...config,
      params,
    });
  },
  getUserProducts: async (
    user_id: string,
    config?: AxiosRequestConfig<ProductEntity>
  ) => {
    return instance().get<ProductEntity[]>(`/user-products/${user_id}`, config);
  },

  create: async (newProduct: FormData) => {
    return instance().post<ProductEntity>("/products/", newProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getProductById: async (id: string) => {
    return instance().get<ProductOverviewEntity>(`/product/${id}`);
  },
  reportProduct: async (product_id: number) => {
    return instance().post<void>("/product-report/", {
      product_id,
    });
  },
  sellProduct: async (body: { product_id: number; price: number }) => {
    return instance().post<void>("/product-status-sold/", body);
  },

  likeIt: async (productId: string) => {
    const product_id = Number(productId);
    return instance().post<ProductEntity>("/like-product/", {
      product_id,
    });
  },

  getProductCreationLimit: async () => {
    return instance().get<{
      allowed_to_create: boolean;
      daily_products_left: number;
    }>("/product-creation-limit/");
  },

  changeStatus: async (body: { status: ProductStatus; product_id: number }) => {
    return instance().post<ProductEntity>("/product-change-status/", body);
  },
  edit: async (newProduct: FormData) => {
    return instance().post<ProductEntity>("/product-edit/", newProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  searching: async (prompt: string) => {
    return instance().get<ProductEntity[]>("/products/searching/", {
      params: { prompt },
    });
  },
  getSearchingFilters: async () => {
    return instance().get<ProductEntity[]>("/get-searching-filters/");
  },
};
