import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CanchaDTO, SedeDTO, TipoCanchaDTO } from "../../../src/dtos/CanchaDTO";
import ApiClient from "../../../src/services/ApiClient";

export default function CanchasScreen() {
  const router = useRouter();
  const [canchas, setCanchas] = useState<CanchaDTO[]>([]);
  const [sedes, setSedes] = useState<SedeDTO[]>([]);
  const [tipos, setTipos] = useState<TipoCanchaDTO[]>([]);
  const [sedeId, setSedeId] = useState<number | undefined>();
  const [tipoId, setTipoId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFiltros();
  }, []);

  useEffect(() => {
    cargarCanchas();
  }, [sedeId, tipoId]);

  const cargarFiltros = async () => {
    try {
      const [sedesData, tiposData] = await Promise.all([
        ApiClient.get<SedeDTO[]>("/catalogo/sedes", true),
        ApiClient.get<TipoCanchaDTO[]>("/catalogo/tipos-cancha", true),
      ]);
      setSedes(sedesData);
      setTipos(tiposData);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarCanchas = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (sedeId) params.sedeId = sedeId;
      if (tipoId) params.tipoCanchaId = tipoId;
      const data = await ApiClient.get<CanchaDTO[]>("/canchas", true, {
        params,
      });
      setCanchas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Filtro por sede */}
      <Text style={styles.filterLabel}>Sede</Text>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, !sedeId && styles.chipActive]}
          onPress={() => setSedeId(undefined)}
        >
          <Text style={[styles.chipText, !sedeId && styles.chipTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {sedes.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.chip, sedeId === s.id && styles.chipActive]}
            onPress={() => setSedeId(sedeId === s.id ? undefined : s.id)}
          >
            <Text
              style={[
                styles.chipText,
                sedeId === s.id && styles.chipTextActive,
              ]}
            >
              {s.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtro por tipo */}
      <Text style={styles.filterLabel}>Deporte</Text>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, !tipoId && styles.chipActive]}
          onPress={() => setTipoId(undefined)}
        >
          <Text style={[styles.chipText, !tipoId && styles.chipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {tipos.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.chip, tipoId === t.id && styles.chipActive]}
            onPress={() => setTipoId(tipoId === t.id ? undefined : t.id)}
          >
            <Text
              style={[
                styles.chipText,
                tipoId === t.id && styles.chipTextActive,
              ]}
            >
              {t.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de canchas */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 32 }}
        />
      ) : (
        <FlatList
          data={canchas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(tabs)/(canchas)/${item.id}`)}
            >
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardSub}>
                {item.sede} · {item.tipoCancha}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.descripcion}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay canchas disponibles</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { fontSize: 13, color: "#475569" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
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
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 48, fontSize: 15 },
});
