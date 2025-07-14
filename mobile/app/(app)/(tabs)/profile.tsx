import { SafeAreaView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView>
        <Text>
           Oi, eu sou o aluno de matricula 427369
        </Text>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
