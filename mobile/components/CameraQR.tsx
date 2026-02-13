import { buildApiUrl } from "@/constants/api";
import { getOrCreateDeviceId } from "@/hooks/useDeviceId";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import useResetQrLockOnFocus from "@/hooks/useResetQrLockOnFocus";
import { getValidSessionToken } from "@/hooks/useSession";
import { getStudentId } from "@/hooks/useStudentData";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Button,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoaderOverlay } from "./LoaderOverlay";

export default function CameraQR() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const qrLock = useRef(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const { zoom, pinchGesture } = usePinchZoom();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [showSettingsCTA, setShowSettingsCTA] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useResetQrLockOnFocus(qrLock);

  useEffect(() => {
    if (isFocused) {
      setIsCameraReady(false);
    }
  }, [isFocused]);

  const onCameraReady = () => {
    setIsCameraReady(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showErrorMessage = (
    message: string,
    options?: { showSettingsCTA?: boolean },
  ) => {
    setResponseMessage(message);
    setShowSettingsCTA(Boolean(options?.showSettingsCTA));
  };

  const clearResponseState = () => {
    qrLock.current = false;
    setResponseMessage(null);
    setShowSettingsCTA(false);
  };

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert("Erro", "Não foi possível abrir as configurações do app.");
    }
  };

  const getCategorizedErrorMessage = (status: number, message?: string) => {
    const normalizedMessage = (message || "").toLowerCase();

    if (status === 401 || normalizedMessage.includes("token")) {
      return "Sessão expirada. Faça login novamente.";
    }

    if (
      status === 403 ||
      normalizedMessage.includes("fora") ||
      normalizedMessage.includes("área")
    ) {
      return "Você está fora da área permitida para registrar presença.";
    }

    if (
      status === 410 ||
      normalizedMessage.includes("expir") ||
      normalizedMessage.includes("inválid")
    ) {
      return "QR expirado ou inválido. Solicite um novo código.";
    }

    if (
      status >= 500 ||
      normalizedMessage.includes("network") ||
      normalizedMessage.includes("internet")
    ) {
      return "Sem internet ou servidor indisponível. Tente novamente.";
    }

    return message || "Não foi possível validar o QR Code.";
  };

  const handleQrScanned = async ({ data }: { data: string }) => {
    if (!data || qrLock.current || loading) return;

    qrLock.current = true;
    setLoading(true);
    setResponseMessage(null);
    setShowSettingsCTA(false);

    const studentId = await getStudentId();
    const token = await getValidSessionToken();
    const deviceId = await getOrCreateDeviceId();

    try {
      if (!token) {
        showErrorMessage("Token inválido ou expirado. Faça login novamente.");
        router.replace("/sign-in");
        return;
      }

      if (!studentId) {
        showErrorMessage("Aluno não identificado. Faça login novamente.");
        return;
      }

      if (!deviceId?.trim()) {
        showErrorMessage("Não foi possível identificar este dispositivo.");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        showErrorMessage(
          "GPS indisponível. Ative a localização do dispositivo.",
        );
        return;
      }

      const { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showErrorMessage("Permissão de localização negada.", {
          showSettingsCTA: !canAskAgain,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      const { latitude, longitude } = location.coords;

      const response = await fetch(buildApiUrl(`/${studentId}/presenca/qr`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          deviceId,
        },
        body: JSON.stringify({
          signedData: data,
          latitude,
          longitude,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Presença confirmada com sucesso!");
        setShowSettingsCTA(false);
        router.replace("/(app)/(tabs)");
      } else {
        const categorizedError = getCategorizedErrorMessage(
          response.status,
          result?.message,
        );
        showErrorMessage(categorizedError);
      }
    } catch (error) {
      console.error(error);
      showErrorMessage(
        "Sem internet ou servidor indisponível. Tente novamente.",
      );
    } finally {
      setLoading(false);
      qrLock.current = false;

      setTimeout(() => {
        setResponseMessage(null);
        setShowSettingsCTA(false);
      }, 4000);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    const showCameraSettingsCTA = !permission.canAskAgain;

    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {showCameraSettingsCTA
            ? "Permissão de câmera negada permanentemente. Abra as configurações para liberar o acesso."
            : "Esta aplicação precisa de permissões para acessar a câmera."}
        </Text>
        {showCameraSettingsCTA ? (
          <Button
            title="Abrir configurações do app"
            onPress={openAppSettings}
          />
        ) : (
          <Button title="Conceder permissão" onPress={requestPermission} />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "Scanner", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {isFocused && (
        <>
          {!isCameraReady && <LoaderOverlay />}
          {loading && <LoaderOverlay />}
          {responseMessage && (
            <View style={styles.responseOverlay}>
              <Text style={styles.responseText}>{responseMessage}</Text>
              <View style={styles.responseActions}>
                {showSettingsCTA && (
                  <Button
                    title="Abrir configurações do app"
                    onPress={openAppSettings}
                  />
                )}
                <Button title="Tentar novamente" onPress={clearResponseState} />
              </View>
            </View>
          )}
          <GestureDetector gesture={pinchGesture}>
            <Animated.View
              style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
            >
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                facing="back"
                mirror={true}
                zoom={zoom}
                onCameraReady={onCameraReady}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={handleQrScanned}
              />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", padding: 10 },
  responseOverlay: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 11,
    gap: 12,
  },
  responseText: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  responseActions: {
    gap: 8,
  },
});
