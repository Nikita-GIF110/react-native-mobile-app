import { CATEGORIES } from "@/src/shared/config";
import { PageTitle } from "@/src/shared/ui-kit";
import { useTranslation } from "react-i18next";

export const CategoryTitle = ({ categoryId }: { categoryId: string }) => {
  const categoryOption = CATEGORIES.find(({ value }) => value === categoryId);
  const { t } = useTranslation("categories");

  return <PageTitle>{t(categoryOption?.label ?? "")}</PageTitle>;
};
