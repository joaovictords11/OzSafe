import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as api from "../api/api";
import { COLORS, FONTS } from "../styles/theme";

const PsychologistListScreen = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await api.getAllPsychologists();
        setPsychologists(response.data.filter((p) => p.disponivel));
      } catch (error) {
        console.error(error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível carregar a lista de psicólogos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.nome}</Text>
      <Text style={styles.itemCrp}>CRP: {item.crp}</Text>
      <Text style={styles.itemSpecialties}>
        Especialidades: {item.especialidades.map((e) => e.nome).join(", ")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={psychologists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum psicólogo disponível no momento.
          </Text>
        }
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  itemContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  itemName: { ...FONTS.h2, fontSize: 18, color: COLORS.text },
  itemCrp: { ...FONTS.body, color: COLORS.primary, marginVertical: 4 },
  itemSpecialties: { ...FONTS.body, fontStyle: "italic", color: COLORS.text },
  emptyText: { textAlign: "center", marginTop: 50, ...FONTS.body },
});

export default PsychologistListScreen;
