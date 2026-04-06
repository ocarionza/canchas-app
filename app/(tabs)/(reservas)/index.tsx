import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
          <TouchableOpacity
            style={[
              styles.card,
              item.estado === "CANCELADA" && styles.cardCancelada,
            ]}
            onPress={() => router.push(`/(tabs)/(reservas)/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.cancha}</Text>
              <View
                style={[
                  styles.badge,
                  item.estado === "CANCELADA"
                    ? styles.badgeCancelada
                    : styles.badgeActiva,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.estado === "CANCELADA"
                      ? styles.badgeTextCancelada
                      : styles.badgeTextActiva,
                  ]}
                >
                  {item.estado}
                </Text>
              </View>
            </View>
            <Text style={styles.cardSub}>{item.sede}</Text>
            <Text style={styles.cardInfo}>
              {item.fecha} · {item.horaInicio?.substring(0, 5)} -{" "}
              {item.horaFin?.substring(0, 5)}
            </Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardCancelada: { opacity: 0.6 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  cardSub: { fontSize: 13, color: "#2563eb", marginBottom: 4 },
  cardInfo: { fontSize: 13, color: "#64748b" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeActiva: { backgroundColor: "#dcfce7" },
  badgeCancelada: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 11, fontWeight: "600" },
  badgeTextActiva: { color: "#16a34a" },
  badgeTextCancelada: { color: "#dc2626" },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 48, fontSize: 15 },
});
