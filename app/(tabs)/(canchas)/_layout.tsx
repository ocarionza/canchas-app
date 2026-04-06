import { Stack } from "expo-router";

export default function CanchasLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "#2563eb" }}>
      <Stack.Screen name="index" options={{ title: "Canchas" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle de cancha" }} />
    </Stack>
  );
}
