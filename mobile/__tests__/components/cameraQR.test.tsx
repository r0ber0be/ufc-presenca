import CameraQR from "@/components/CameraQR";
import { getOrCreateDeviceId } from "@/hooks/useDeviceId";
import { getValidSessionToken } from "@/hooks/useSession";
import { getStudentId } from "@/hooks/useStudentData";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

const mockReplace = jest.fn();

const permissionState = {
  granted: false,
  canAskAgain: false,
};

jest.mock("@/hooks/useSession", () => ({
  getValidSessionToken: jest.fn(),
}));

jest.mock("@/hooks/useStudentData", () => ({
  getStudentId: jest.fn(),
}));

jest.mock("@/hooks/useDeviceId", () => ({
  getOrCreateDeviceId: jest.fn(),
}));

jest.mock("@/hooks/usePinchZoom", () => ({
  usePinchZoom: () => ({ zoom: 0, pinchGesture: {} }),
}));

jest.mock("@/hooks/useResetQrLockOnFocus", () => jest.fn());

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
  Stack: { Screen: () => null },
}));

jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => true,
}));

jest.mock("react-native-gesture-handler", () => ({
  GestureDetector: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => (
    <View>{children}</View>
  ),
}));

jest.mock("expo-camera", () => {
  const React = require("react");
  const { TouchableOpacity, Text, View } = require("react-native");

  return {
    useCameraPermissions: () => [permissionState, jest.fn()],
    CameraView: ({ onBarcodeScanned, onCameraReady }: any) => {
      React.useEffect(() => {
        onCameraReady?.();
      }, [onCameraReady]);

      return (
        <View>
          <TouchableOpacity
            testID="scan-qr"
            onPress={() => onBarcodeScanned?.({ data: "signed-qr-data" })}
          >
            <Text>Scan</Text>
          </TouchableOpacity>
        </View>
      );
    },
  };
});

jest.mock("expo-location", () => ({
  hasServicesEnabledAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { BestForNavigation: "BestForNavigation" },
}));

const Location = require("expo-location");

describe("CameraQR main states", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    permissionState.granted = false;
    permissionState.canAskAgain = false;
  });

  it("shows camera permission denied permanently state", () => {
    const { getByText } = render(<CameraQR />);

    expect(
      getByText(
        "Permissão de câmera negada permanentemente. Abra as configurações para liberar o acesso.",
      ),
    ).toBeTruthy();
    expect(getByText("Abrir configurações do app")).toBeTruthy();
  });

  it("shows success state and redirects after QR API success", async () => {
    permissionState.granted = true;
    permissionState.canAskAgain = true;

    (getStudentId as jest.Mock).mockResolvedValue("student-1");
    (getValidSessionToken as jest.Mock).mockResolvedValue("token-1");
    (getOrCreateDeviceId as jest.Mock).mockResolvedValue("device-1");
    Location.hasServicesEnabledAsync.mockResolvedValue(true);
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: "granted",
      canAskAgain: true,
    });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: -3.73, longitude: -38.52 },
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "ok" }),
    } as never);

    const { getByTestId, getByText } = render(<CameraQR />);

    fireEvent.press(getByTestId("scan-qr"));

    await waitFor(() => {
      expect(getByText("Presença confirmada com sucesso!")).toBeTruthy();
      expect(mockReplace).toHaveBeenCalledWith("/(app)/(tabs)");
    });
  });
});
