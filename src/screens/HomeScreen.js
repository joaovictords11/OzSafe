import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "../styles/theme";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>Como podemos te ajudar hoje?</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("PsychologistList")}
      >
        <Text style={styles.menuButtonText}>Ver Psicólogos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.menuButtonText}>Meu Perfil</Text>
      </TouchableOpacity>

      {/* Adicionar mais opções de menu conforme necessário */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: { ...FONTS.h1, color: COLORS.text, marginTop: 20 },
  subtitle: {
    ...FONTS.body,
    color: COLORS.text,
    marginBottom: 40,
    textAlign: "center",
  },
  menuButton: {
    width: "90%",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
  },
  menuButtonText: { ...FONTS.h2, fontSize: 18, color: COLORS.primary },
  logoutButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  logoutButtonText: { ...FONTS.button, color: COLORS.white },
});

export default HomeScreen;
