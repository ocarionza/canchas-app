import { Stack } from "expo-router";

export default function PerfilLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "#2563eb" }}>
      <Stack.Screen name="index" options={{ title: "Mi perfil" }} />
    </Stack>
  );
}
