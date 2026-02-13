import { buildApiUrl } from "@/constants/api";
import { getValidSessionToken } from "@/hooks/useSession";
import { getStudentRegistration } from "@/hooks/useStudentData";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type LessonAttendance = {
  lessonId: string;
  date: string;
  present: boolean;
};

type ClassReportStudent = {
  name: string;
  registration: number;
  presences: number;
  absences: number;
  percentage: number;
  lessonAttendances: LessonAttendance[];
};

type ClassReport = {
  name: string;
  totalLessons: number;
  averagePresence: number;
  students: ClassReportStudent[];
};

export default function ClassDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ClassReport | null>(null);
  const [studentReport, setStudentReport] = useState<ClassReportStudent | null>(
    null,
  );

  const router = useRouter();

  const className = report?.name || "Detalhes da turma";

  const loadClassReport = useCallback(async () => {
    if (!id) {
      setError("Turma não informada.");
      setIsLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);

      const [studentRegistration, token] = await Promise.all([
        getStudentRegistration(),
        getValidSessionToken(),
      ]);

      if (!token) {
        router.replace("/sign-in");
        return;
      }

      if (!studentRegistration) {
        setError("Matrícula do aluno não encontrada.");
        return;
      }

      const response = await fetch(buildApiUrl(`/${id}/report`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as ClassReport | { message: string };

      if (!response.ok || "message" in data) {
        setError(
          "message" in data
            ? data.message
            : "Não foi possível carregar os detalhes da turma.",
        );
        return;
      }

      const currentStudent = data.students.find(
        ({ registration }) => registration.toString() === studentRegistration,
      );

      if (!currentStudent) {
        setError("Não foi possível localizar suas presenças nesta turma.");
        return;
      }

      setReport(data);
      setStudentReport(currentStudent);
    } catch {
      setError("Erro ao carregar os detalhes da turma.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadClassReport();
  }, [loadClassReport]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadClassReport();
  }, [loadClassReport]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator animating size="large" />
          <Text style={styles.supportText}>Carregando dados da turma...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: className,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#111827" },
          headerTintColor: "#111827",
        }}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card>
          <Card.Content>
            <Text variant="bodyLarge">
              Presenças: {studentReport?.presences}
            </Text>
            <Text variant="bodyLarge">Faltas: {studentReport?.absences}</Text>
            <Text variant="bodyLarge">
              Total de aulas: {report?.totalLessons}
            </Text>
            <Text variant="bodyLarge">
              Frequência: {studentReport?.percentage.toFixed(2)}%
            </Text>
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Presença por aula" />
          <Card.Content style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text variant="titleSmall" style={styles.columnDate}>
                Data
              </Text>
              <Text variant="titleSmall" style={styles.columnStatus}>
                Situação
              </Text>
            </View>

            <Divider />

            {studentReport?.lessonAttendances.map(
              ({ lessonId, date, present }) => {
                const formattedDate = new Date(date).toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  },
                );

                return (
                  <View key={lessonId}>
                    <View style={styles.tableRow}>
                      <Text style={styles.columnDate}>{formattedDate}</Text>
                      <Text style={styles.columnStatus}>
                        {present ? "Presença" : "Falta"}
                      </Text>
                    </View>
                    <Divider />
                  </View>
                );
              },
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#334155",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  supportText: {
    marginTop: 12,
    color: "#fff",
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  tableContainer: {
    gap: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  columnDate: {
    flex: 1,
  },
  columnStatus: {
    flex: 1,
    textAlign: "right",
  },
});
