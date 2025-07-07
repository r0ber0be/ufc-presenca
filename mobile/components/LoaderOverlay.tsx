import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoaderOverlay({ message }: { message?: string }) {
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#fff" />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: { marginTop: 8, color: '#fff', fontSize: 16 },
});
