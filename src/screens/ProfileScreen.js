import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode"; // Precisa instalar: npm install jwt-decode
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as api from "../api/api";
import { COLORS, FONTS } from "../styles/theme";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Supondo que o ID está no payload do token como 'userId'

        const response = await api.getUserById(userId);
        setUser(response.data);
        setNome(response.data.nome);
        setTelefone(response.data.telefone);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = { ...user, nome, telefone };
      await api.updateUser(user.id, updatedData);
      Alert.alert("Sucesso", "Seus dados foram atualizados.");
      setUser(updatedData); // Atualiza o estado local
    } catch (error) {
      console.error(error.response?.data);
      Alert.alert("Erro", "Não foi possível atualizar seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api.deleteUser(user.id);
              await AsyncStorage.removeItem("userToken");
              Alert.alert(
                "Conta Excluída",
                "Sua conta foi removida com sucesso."
              );
              navigation.replace("Login");
            } catch (error) {
              console.error(error.response?.data);
              Alert.alert("Erro", "Não foi possível excluir sua conta.");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading && !user) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>E-mail (não editável):</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.email}
        editable={false}
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Atualizar Dados</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  label: { ...FONTS.body, color: COLORS.text, marginBottom: 5, marginTop: 15 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  disabledInput: { backgroundColor: "#f0f0f0" },
  updateButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  deleteButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { ...FONTS.button },
});

export default ProfileScreen;
