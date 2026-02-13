import { getValidSessionToken } from "@/hooks/useSession";
import { SplashScreen, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function AuthCheck() {
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const token = await getValidSessionToken();
        if (token) {
          router.replace("/(app)/(tabs)");
          return;
        }
        router.replace("/sign-in");
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    verifyAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
