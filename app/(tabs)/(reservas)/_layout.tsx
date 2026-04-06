import { Stack } from "expo-router";

export default function ReservasLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "#2563eb" }}>
      <Stack.Screen name="index" options={{ title: "Mis reservas" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle de reserva" }} />
    </Stack>
  );
}
