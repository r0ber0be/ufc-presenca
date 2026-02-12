import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

const Header = () => (
  <Appbar.Header>
    <Appbar.Content
      title="UFC PRESENÇA"
      titleStyle={styles.title}
      style={styles.content}
    />
  </Appbar.Header>
);

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "serif",
    letterSpacing: 1,
    fontWeight: "600",
  },
});

export default Header;
