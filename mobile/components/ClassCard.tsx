import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

type ClassInfo = {
  id: string;
  code: string;
  name: string;
  classBlock: string;
  classRoom: string;
  schedules: {
    id: string;
    startTime: string;
    endTime: string;
    weekDay: string;
  }[];
};

export default function ClassCard({ ...classe }: ClassInfo) {
  const router = useRouter();
  const { name, code, classRoom, classBlock, schedules } = classe;
  return (
    <Card mode="contained" style={styles.card}>
      <Card.Content>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(app)/class/[id]",
              params: { id: classe.id },
            })
          }
        >
          <View style={styles.container}>
            <View style={styles.info}>
              <Text style={styles.title} variant="titleMedium">
                {name}
              </Text>

              {schedules.map(({ id, weekDay, startTime, endTime }) => (
                <Text key={id} style={styles.scheduleText} variant="bodyMedium">
                  📅 {weekDay} ⏰ {startTime} - {endTime}
                </Text>
              ))}
            </View>

            <Card.Actions style={styles.actions}>
              <IconButton
                icon="qrcode-scan"
                size={40}
                style={styles.qrButton}
                onPress={() => router.push("/(app)/(tabs)/scanner")}
                iconColor="black"
              />
            </Card.Actions>
          </View>
        </Pressable>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  scheduleText: {
    marginTop: 2,
  },
  actions: {
    justifyContent: "flex-end", // alinha o QR code à direita
    paddingHorizontal: 5,
  },
  qrButton: {
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    elevation: 0,
  },
});
