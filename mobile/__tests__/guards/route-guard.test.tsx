import { getValidSessionToken } from "@/hooks/useSession";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockReplace = jest.fn();
const mockHideAsync = jest.fn();
const mockPreventAutoHideAsync = jest.fn();

jest.mock("@/hooks/useSession", () => ({
  __esModule: true,
  getValidSessionToken: jest.fn(),
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Header</Text>;
});

jest.mock("@/components/ui/TabBarBackground", () => () => null);

jest.mock("@/hooks/useColorScheme", () => ({
  __esModule: true,
  useColorScheme: () => "light",
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const Tabs = ({ children }: { children: React.ReactNode }) => (
    <View testID="tabs-root">{children}</View>
  );
  Tabs.Screen = () => null;

  return {
    __esModule: true,

    SplashScreen: {
      preventAutoHideAsync: mockPreventAutoHideAsync,
      hideAsync: mockHideAsync,
    },

    router: {
      replace: mockReplace,
      push: jest.fn(),
      back: jest.fn(),
    },

    useRouter: () => ({
      replace: mockReplace,
      push: jest.fn(),
      back: jest.fn(),
    }),

    usePathname: () => "/(app)/(tabs)",
    Tabs,
  };
});

describe("Guards de rota", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deveria redirecionar para tabs quando a sessão for válida", async () => {
    (getValidSessionToken as jest.Mock).mockResolvedValue("valid-token");

    const AuthCheck = require("@/app/auth-check").default;

    render(<AuthCheck />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(app)/(tabs)");
      expect(mockHideAsync).toHaveBeenCalled();
    });

    expect(mockPreventAutoHideAsync).toHaveBeenCalled();
  });

  it("deveria redirecionar para sign-in quando a sessão estiver ausente", async () => {
    (getValidSessionToken as jest.Mock).mockResolvedValue(null);

    const AuthCheck = require("@/app/auth-check").default;

    render(<AuthCheck />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/sign-in");
      expect(mockHideAsync).toHaveBeenCalled();
    });

    expect(mockPreventAutoHideAsync).toHaveBeenCalled();
  });

  it("deveria bloquear a renderização das tabs quando a sessão for inválida", async () => {
    (getValidSessionToken as jest.Mock).mockResolvedValue(null);

    const TabLayout = require("@/app/(app)/(tabs)/_layout").default;

    const { queryByTestId } = render(<TabLayout />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/sign-in"));
    expect(queryByTestId("tabs-root")).toBeNull();
  });

  it("deveria renderizar as tabs quando a sessão for válida", async () => {
    (getValidSessionToken as jest.Mock).mockResolvedValue("valid-token");

    const TabLayout = require("@/app/(app)/(tabs)/_layout").default;

    const { getByTestId } = render(<TabLayout />);

    await waitFor(() => expect(getByTestId("tabs-root")).toBeTruthy());
  });
});
