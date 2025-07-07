import { SafeAreaView, StyleSheet } from 'react-native';

import CameraQR from '@/components/CameraQR';

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CameraQR />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'space-around',
    paddingVertical: 80,
  },
});
