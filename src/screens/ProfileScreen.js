import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as api from "../api/api";
import { COLORS, FONTS } from "../styles/theme";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub;

        const response = await api.getAllUsers();
        const allUsers = response.data;

        const currentUser = allUsers.find((u) => u.email === userEmail);

        if (currentUser) {
          setUser(currentUser);
          setNome(currentUser.nome);
          setTelefone(currentUser.telefone);
        } else {
          throw new Error("Usuário do token não encontrado na base de dados.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        Alert.alert(
          "Erro de Sessão",
          "Não foi possível carregar seus dados. Por favor, faça login novamente."
        );

        await AsyncStorage.removeItem("userToken");
        navigation.replace("Login");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdate = async () => {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Nome e telefone não podem estar vazios.");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedData = { ...user, nome, telefone };
      await api.updateUser(user.id, updatedData);
      Alert.alert("Sucesso", "Seus dados foram atualizados.");
      setUser(updatedData);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar seus dados.");
    } finally {
      setIsUpdating(false);
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
            setIsUpdating(true);
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
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
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
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Atualizar Dados</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isUpdating}
      >
        <Text style={styles.buttonText}>Excluir Conta</Text>
      </TouchableOpacity>
    </ScrollView>
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
  disabledInput: { backgroundColor: "#f0f0f0", color: "#a0a0a0" },
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
