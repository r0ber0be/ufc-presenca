import ClassCard from "@/components/ClassCard";
import { ThemedView } from "@/components/ThemedView";
import { buildApiUrl } from "@/constants/api";
import { getToken } from "@/hooks/useAuthToken";
import { getStudentId } from "@/hooks/useStudentData";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ClassInfo = {
  id: string;
  code: string;
  name: string;
  classBlock: string;
  classRoom: string;
  schedules: [
    {
      id: string;
      startTime: string;
      endTime: string;
      weekDay: string;
    },
  ];
};

export default function HomeScreen() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadClasses() {
      try {
        const studentId = await getStudentId();
        const token = await getToken();

        if (!studentId || !token) {
          router.replace("/sign-in");
          return;
        }

        const response = await fetch(buildApiUrl(`/${studentId}/turmas`), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data?.message ?? "Não foi possível carregar as turmas.");
          return;
        }

        if (data.message) {
          setError(data.message);
          return;
        }

        setClasses(data);
      } catch {
        setError("Ocorreu um erro ao carregar as turmas.");
      } finally {
        setIsLoading(false);
      }
    }

    loadClasses();
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.feedbackContainer}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.text}>Carregando turmas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  if (classes.length === 0) {
    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.text}>
          Bem vindo! Você não está matriculado em nenhuma turma
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView
          style={styles.listContainer}
          lightColor="#334155"
          darkColor="#334155"
        >
          {classes.map((classe: ClassInfo) => (
            <ClassCard key={classe.id} {...classe} />
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#334155",
  },
  text: {
    fontFamily: "serif",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 18,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
});
