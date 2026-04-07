import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { HorarioItem } from "../../../src/components/HorarioItem/HorarioItem";
import { CanchaDTO } from "../../../src/dtos/CanchaDTO";
import { HorarioDTO } from "../../../src/dtos/HorarioDTO";
import { CrearReservaDTO, ReservaDTO } from "../../../src/dtos/ReservaDTO";
import ApiClient from "../../../src/services/ApiClient";

const BASE_SERVER_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(
  /\/api\/?$/,
  "",
);

function buildImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_SERVER_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function DetalleCanchaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cancha, setCancha] = useState<CanchaDTO | null>(null);
  const [horarios, setHorarios] = useState<HorarioDTO[]>([]);
  const [fecha, setFecha] = useState("");
  const [nota, setNota] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] =
    useState<HorarioDTO | null>(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingReserva, setLoadingReserva] = useState(false);
  const NOTE_KEY = `nota_cancha_${id}`;

  useEffect(() => {
    cargarCancha();
    cargarNota();
  }, []);

  const cargarCancha = async () => {
    try {
      const data = await ApiClient.get<CanchaDTO>(`/canchas/${id}`, true);
      setCancha(data);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarNota = async () => {
    const saved = await AsyncStorage.getItem(NOTE_KEY);
    if (saved) setNota(saved);
  };

  const guardarNota = async (texto: string) => {
    setNota(texto);
    await AsyncStorage.setItem(NOTE_KEY, texto);
  };

  const buscarHorarios = async () => {
    if (!fecha) {
      Alert.alert("Error", "Ingresa una fecha");
      return;
    }
    const [year, month, day] = fecha.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      Alert.alert("Fecha inválida", "La fecha no puede ser anterior a hoy");
      return;
    }
    try {
      setLoadingHorarios(true);
      const data = await ApiClient.get<HorarioDTO[]>(
        `/canchas/${id}/horarios-disponibles`,
        true,
        { params: { fecha } },
      );
      setHorarios(data);
    } catch (e) {
      Alert.alert("Error", "No se pudieron cargar los horarios");
    } finally {
      setLoadingHorarios(false);
    }
  };

  const confirmarReserva = async () => {
    if (!horarioSeleccionado || !cancha) return;
    try {
      setLoadingReserva(true);
      const body: CrearReservaDTO = {
        canchaId: cancha.id,
        horarioId: horarioSeleccionado.id,
        fecha,
      };
      await ApiClient.post<ReservaDTO>("/reservas", body, true);
      Alert.alert("¡Reserva confirmada!", `${cancha.nombre} — ${fecha}`);
      setModalVisible(false);
      setHorarioSeleccionado(null);
      buscarHorarios();
    } catch (e) {
      Alert.alert("Error", "No se pudo crear la reserva");
    } finally {
      setLoadingReserva(false);
    }
  };

  if (!cancha) {
    return (
      <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={{ uri: buildImageUrl(cancha.imagenUrl) }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{cancha.nombre}</Text>
        <Text style={styles.sub}>
          {cancha.sede} · {cancha.tipoCancha}
        </Text>
        <Text style={styles.desc}>{cancha.descripcion}</Text>
        <Text style={styles.capacidad}>
          Capacidad: {cancha.capacidad} personas
        </Text>

        {/* Disponibilidad */}
        <Text style={styles.sectionTitle}>Consultar disponibilidad</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="YYYY-MM-DD"
            value={fecha}
            onChangeText={setFecha}
          />
          <TouchableOpacity style={styles.btnBuscar} onPress={buscarHorarios}>
            <Text style={styles.btnBuscarText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loadingHorarios ? (
          <ActivityIndicator color="#2563eb" style={{ marginTop: 16 }} />
        ) : (
          <View style={styles.horariosGrid}>
            {horarios.map((h) => (
              <HorarioItem
                key={h.id}
                horario={h}
                onPress={() => {
                  const now = new Date();
                  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                  if (fecha === todayStr) {
                    const [hours, minutes] = h.horaInicio
                      .split(":")
                      .map(Number);
                    const slotTime = new Date();
                    slotTime.setHours(hours, minutes, 0, 0);
                    if (slotTime <= now) {
                      Alert.alert(
                        "Horario no disponible",
                        "Este horario ya pasó y no puede ser seleccionado",
                      );
                      return;
                    }
                  }
                  setHorarioSeleccionado(h);
                  setModalVisible(true);
                }}
              />
            ))}
            {horarios.length === 0 && fecha !== "" && (
              <Text style={styles.empty}>
                Sin horarios disponibles para esta fecha
              </Text>
            )}
          </View>
        )}

        {/* Nota personal */}
        <Text style={styles.sectionTitle}>Mi nota</Text>
        <TextInput
          style={styles.notaInput}
          placeholder="Escribe un recordatorio o comentario..."
          value={nota}
          onChangeText={guardarNota}
          multiline
        />
      </View>

      {/* Modal confirmación reserva */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar reserva</Text>
            <Text style={styles.modalText}>{cancha.nombre}</Text>
            <Text style={styles.modalText}>Fecha: {fecha}</Text>
            <Text style={styles.modalText}>
              Horario: {horarioSeleccionado?.horaInicio.substring(0, 5)} -{" "}
              {horarioSeleccionado?.horaFin.substring(0, 5)}
            </Text>

            <TouchableOpacity
              style={styles.btnConfirmar}
              onPress={confirmarReserva}
              disabled={loadingReserva}
            >
              {loadingReserva ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnConfirmarText}>Confirmar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  image: { width: "100%", height: 220, backgroundColor: "#e2e8f0" },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  sub: { fontSize: 14, color: "#2563eb", marginBottom: 8 },
  desc: { fontSize: 14, color: "#475569", marginBottom: 4 },
  capacidad: { fontSize: 13, color: "#64748b", marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 20,
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  btnBuscar: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  btnBuscarText: { color: "#fff", fontWeight: "600" },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  horarioChip: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  horarioText: { color: "#1d4ed8", fontWeight: "600", fontSize: 13 },
  empty: { color: "#94a3b8", fontSize: 14, marginTop: 8 },
  notaInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalText: { fontSize: 14, color: "#475569" },
  btnConfirmar: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  btnConfirmarText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnCancelar: { padding: 12, alignItems: "center" },
  btnCancelarText: { color: "#64748b", fontSize: 14 },
});
