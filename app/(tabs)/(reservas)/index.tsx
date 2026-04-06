import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ReservaCard } from "../../../src/components/ReservaCard/ReservaCard";
import { ReservaDTO } from "../../../src/dtos/ReservaDTO";
import ApiClient from "../../../src/services/ApiClient";

export default function ReservasScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState<ReservaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, []),
  );

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.get<ReservaDTO[]>(
        "/reservas/mis-reservas",
        true,
      );
      setReservas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <ReservaCard
            reserva={item}
            onPress={() => router.push(`/(tabs)/(reservas)/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes reservas aún</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 48, fontSize: 15 },
});
