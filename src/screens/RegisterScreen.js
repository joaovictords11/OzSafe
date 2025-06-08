import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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

const RegisterScreen = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nome || !email || !senha || !telefone) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const userData = {
        nome,
        email,
        senha,
        telefone,
        localizacao: "A definir",
      };
      await api.register(userData);
      Alert.alert(
        "Sucesso!",
        "Sua conta foi criada. Faça o login para continuar."
      );
      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "Erro no Cadastro",
        "Não foi possível criar sua conta. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: { ...FONTS.h2, color: COLORS.text, marginBottom: 30 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { ...FONTS.button },
});

export default RegisterScreen;
