import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ReservaDTO } from "../../dtos/ReservaDTO";

interface Props {
  reserva: ReservaDTO;
  onPress: () => void;
}

export function ReservaCard({ reserva, onPress }: Props) {
  const cancelada = reserva.estado === "CANCELADA";

  return (
    <TouchableOpacity
      style={[styles.card, cancelada && styles.cardCancelada]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{reserva.cancha}</Text>
        <View
          style={[
            styles.badge,
            cancelada ? styles.badgeCancelada : styles.badgeActiva,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              cancelada ? styles.badgeTextCancelada : styles.badgeTextActiva,
            ]}
          >
            {reserva.estado}
          </Text>
        </View>
      </View>
      <Text style={styles.cardSub}>{reserva.sede}</Text>
      <Text style={styles.cardInfo}>
        {reserva.fecha} · {reserva.horaInicio?.substring(0, 5)} -{" "}
        {reserva.horaFin?.substring(0, 5)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
