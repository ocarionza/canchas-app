import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { HorarioDTO } from "../../dtos/HorarioDTO";

interface Props {
  horario: HorarioDTO;
  onPress: () => void;
}

export function HorarioItem({ horario, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress}>
      <Text style={styles.text}>
        {horario.horaInicio.substring(0, 5)} - {horario.horaFin.substring(0, 5)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: { color: "#1d4ed8", fontWeight: "600", fontSize: 13 },
});
