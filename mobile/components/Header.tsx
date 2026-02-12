import { BlurView } from "expo-blur";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => (
  <ImageBackground
    source={require("@/assets/images/header-bg.png")}
    style={styles.background}
    imageStyle={styles.backgroundImage}
  >
    <BlurView intensity={45} tint="dark" style={styles.blurLayer}>
      <View style={styles.overlay}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.content}>
            <Text style={styles.title}>UFC PRESENÇA</Text>
          </View>
        </SafeAreaView>
      </View>
    </BlurView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    width: "100%",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  blurLayer: {
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  content: {
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "serif",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 2.6,
    textAlign: "center",

    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
});

export default Header;
