import { DrawerLayout } from "@/components/drawer-layout";
import { Slot, useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left"]}>
      <View style={{ flex: 1, paddingTop: 8 }}>
        <Pressable
          onPress={() => onNavigate("/")}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginHorizontal: 8,
            borderRadius: 10,
            backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
          })}
        >
          <Text style={{ fontSize: 16 }}>Chat</Text>
        </Pressable>
        <Pressable
          onPress={() => onNavigate("/settings")}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginHorizontal: 8,
            borderRadius: 10,
            backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
          })}
        >
          <Text style={{ fontSize: 16 }}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const params = useGlobalSearchParams<{ drawer?: string }>();
  const drawerOpen = params.drawer === "open";

  const onOpen = useCallback(
    () => router.setParams({ drawer: "open" }),
    [router],
  );
  const onClose = useCallback(
    () => router.setParams({ drawer: undefined }),
    [router],
  );

  return (
    <KeyboardProvider>
      <ThemeProvider>
        <DrawerLayout
          open={drawerOpen}
          onOpen={onOpen}
          onClose={onClose}
          drawerContent={
            <DrawerContent
              onNavigate={(path) => {
                router.replace(path as any);
              }}
            />
          }
        >
          <Slot />
        </DrawerLayout>
      </ThemeProvider>
      <StatusBar style="auto" />
    </KeyboardProvider>
  );
}
