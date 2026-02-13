import { removeToken } from "@/hooks/useAuthToken";
import {
  getStudentName,
  getStudentRegistration,
  getStudentRole,
  removeStudentData,
} from "@/hooks/useStudentData";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileData = {
  name: string;
  registration: string;
};

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [name, registration, role] = await Promise.all([
          getStudentName(),
          getStudentRegistration(),
          getStudentRole(),
        ]);

        if (!name || !registration || !role) {
          setLoading(false);
          router.replace("/sign-in");
          return;
        }

        setProfileData({ name, registration });
      } catch {
        router.replace("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [router]);

  async function handleLogout() {
    setLogoutLoading(true);
    await removeToken();
    await removeStudentData();
    router.replace("/sign-in");
  }

  function handleOptions() {
    Alert.alert("Opções", "Configurações adicionais em breve.");
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formArea}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Nome</Text>
            <View style={styles.valueBox}>
              <Text variant="bodyLarge">{profileData.name}</Text>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Matrícula</Text>
            <View style={styles.valueBox}>
              <Text variant="bodyLarge">{profileData.registration}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleOptions}
            style={styles.optionsButton}
            contentStyle={styles.actionContent}
          >
            Opções
          </Button>
          <Button
            mode="contained"
            onPress={handleLogout}
            loading={logoutLoading}
            disabled={logoutLoading}
            style={styles.logoutButton}
            contentStyle={styles.actionContent}
          >
            Sair
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    color: "#374151",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  formArea: {
    gap: 16,
  },
  fieldBlock: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    fontFamily: "serif",
  },
  valueBox: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  actions: {
    marginTop: "auto",
    gap: 12,
  },
  actionContent: {
    height: 48,
  },
  optionsButton: {
    borderRadius: 12,
    borderColor: "#9ca3af",
  },
  logoutButton: {
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
});
