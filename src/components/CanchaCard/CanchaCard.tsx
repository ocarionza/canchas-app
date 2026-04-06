import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { CanchaDTO } from "../../dtos/CanchaDTO";

interface Props {
  cancha: CanchaDTO;
  onPress: () => void;
}

export function CanchaCard({ cancha, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{cancha.nombre}</Text>
      <Text style={styles.cardSub}>
        {cancha.sede} · {cancha.tipoCancha}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {cancha.descripcion}
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: "#2563eb", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#64748b" },
});
