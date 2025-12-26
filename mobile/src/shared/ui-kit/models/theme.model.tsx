import {
  PaperProvider,
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
  useTheme,
} from "react-native-paper";
import { useColorScheme } from "react-native";

type AppTheme = Omit<typeof DefaultLightTheme, "colors"> & {
  borderRadius: {
    primary: number;
    secondary: number;
    tertiary: number;
  };
  colors: (typeof DefaultLightTheme)["colors"] & {
    transparent: string;
  };
};

const DefaultBorderRadius = {
  primary: 28,
  secondary: 16,
  tertiary: 8,
};

const LightTheme: AppTheme = {
  ...DefaultLightTheme,
  borderRadius: DefaultBorderRadius,
  colors: {
    ...DefaultLightTheme.colors,
    primary: "#292848",
    onPrimary: "#FFFFFF",
    secondary: "#6181FF",
    onSecondary: "#FFFFFF",
    tertiary: "#81BE64",
    onTertiary: "#FFFFFF",
    surface: "#FFFFFF",
    onSurface: "#292848",
    background: "#F2F2F2",
    onBackground: "#292848",
    error: "#D22D2D",
    onError: "#FFFFFF",
    errorContainer: "#F46868",
    onErrorContainer: "#D22D2D",

    transparent: "transparent",
  },
};
const DarkTheme: AppTheme = {
  ...DefaultDarkTheme,
  borderRadius: DefaultBorderRadius,
  colors: {
    ...DefaultDarkTheme.colors,
  },
};

export const useAppTheme = () => useTheme<AppTheme>();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // const colorScheme = useColorScheme();
  // const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return <PaperProvider theme={LightTheme}>{children}</PaperProvider>;
};
