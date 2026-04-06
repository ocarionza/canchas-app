import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../src/context/AuthContext";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.nombre?.charAt(0).toUpperCase() ?? "?"}
        </Text>
      </View>

      <Text style={styles.nombre}>{user?.nombre}</Text>
      <Text style={styles.correo}>{user?.correo}</Text>

      <View style={styles.card}>
        <Row label="Nombre" value={user?.nombre ?? ""} />
        <View style={styles.divider} />
        <Row label="Correo" value={user?.correo ?? ""} />
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 24,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  correo: { fontSize: 14, color: "#64748b", marginBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: "100%",
    marginBottom: 32,
  },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 14, color: "#64748b" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  btnLogout: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  btnLogoutText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
