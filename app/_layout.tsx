import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";
  const inRootIndex = (segments as string[]).length === 0;
  const needsRedirect =
    !isLoading &&
    ((!user && !inAuthGroup) || (!!user && (inAuthGroup || inRootIndex)));

  useEffect(() => {
    if (isLoading) return;

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/LoginComponent");
    } else if (user && (inAuthGroup || inRootIndex)) {
      router.replace("/(tabs)/(canchas)");
    }
  }, [user, isLoading, segments, inAuthGroup, inRootIndex, router]);

  if (isLoading || needsRedirect) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
