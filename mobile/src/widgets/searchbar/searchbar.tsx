import React from "react";
import {
  Appbar as PaperAppbar,
  Searchbar as PaperSearchbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/src/shared/ui-kit";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/src/shared/lib";
import { useProductsFilterContext } from "@/src/features/filter-products";

export const Searchbar = ({
  style,
  ...props
}: React.ComponentProps<typeof PaperSearchbar>) => {
  const router = useRouter();
  const { t } = useTranslation("forms");
  const { colors, borderRadius } = useAppTheme();

  return (
    <PaperAppbar
      style={{
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        width: "100%",
      }}
    >
      <PaperSearchbar
        placeholderTextColor={colors.onSurface}
        iconColor={colors.onSurface}
        style={[
          {
            width: "100%",
            backgroundColor: colors.surface,
            borderRadius: borderRadius.secondary,
          },
          style,
        ]}
        editable={false}
        placeholder={t("forms.input_search", { ns: "forms" })}
        onPress={() => router.push("/(tabs)/(home)/search")}
        {...props}
      />
    </PaperAppbar>
  );
};

export const DebounceSearchbar = (
  props: React.ComponentProps<typeof Searchbar>
) => {
  const { filters, setFilters } = useProductsFilterContext();

  const [prompt, setPrompt] = React.useState<string | undefined>(
    () => filters.prompt
  );
  const debouncedName = useDebounce(prompt, 1000);

  React.useEffect(() => {
    setFilters({ prompt: debouncedName });
  }, [debouncedName]);

  return (
    <Searchbar
      {...props}
      editable
      onClearIconPress={() => setPrompt(undefined)}
      onChangeText={setPrompt}
      value={prompt ?? ""}
    />
  );
};
