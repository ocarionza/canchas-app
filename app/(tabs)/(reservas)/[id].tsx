import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ReservaDTO } from "../../../src/dtos/ReservaDTO";
import ApiClient from "../../../src/services/ApiClient";

export default function DetalleReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [reserva, setReserva] = useState<ReservaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    cargarReserva();
  }, []);

  const cargarReserva = async () => {
    try {
      const data = await ApiClient.get<ReservaDTO[]>(
        "/reservas/mis-reservas",
        true,
      );
      const found = data.find((r) => r.id === Number(id));
      if (found) setReserva(found);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      "Cancelar reserva",
      "¿Estás seguro que deseas cancelar esta reserva?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: cancelarReserva,
        },
      ],
    );
  };

  const cancelarReserva = async () => {
    try {
      setCancelando(true);
      await ApiClient.delete(`/reservas/${id}`, true);
      Alert.alert("Reserva cancelada", "", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", "No se pudo cancelar la reserva");
    } finally {
      setCancelando(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
    );
  }

  if (!reserva) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Reserva no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{reserva.cancha}</Text>
          <View
            style={[
              styles.badge,
              reserva.estado === "CANCELADA"
                ? styles.badgeCancelada
                : styles.badgeActiva,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                reserva.estado === "CANCELADA"
                  ? styles.badgeTextCancelada
                  : styles.badgeTextActiva,
              ]}
            >
              {reserva.estado}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Row label="Sede" value={reserva.sede} />
        <Row label="Fecha" value={reserva.fecha} />
        <Row
          label="Horario"
          value={`${reserva.horaInicio?.substring(0, 5)} - ${reserva.horaFin?.substring(0, 5)}`}
        />
      </View>

      {reserva.estado === "ACTIVA" && (
        <TouchableOpacity
          style={styles.btnCancelar}
          onPress={handleCancelar}
          disabled={cancelando}
        >
          {cancelando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnCancelarText}>Cancelar reserva</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowLabel: { fontSize: 14, color: "#64748b" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeActiva: { backgroundColor: "#dcfce7" },
  badgeCancelada: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextActiva: { color: "#16a34a" },
  badgeTextCancelada: { color: "#dc2626" },
  btnCancelar: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  btnCancelarText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 48, fontSize: 15 },
});
