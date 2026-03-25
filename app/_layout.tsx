import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider>
          <Drawer
            screenOptions={{
              headerShadowVisible: true,
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                title: "Chat",
                drawerLabel: "Chat",
              }}
            />
            <Drawer.Screen
              name="settings"
              options={{
                title: "Settings",
                drawerLabel: "Settings",
              }}
            />
          </Drawer>
        </ThemeProvider>
        <StatusBar style="auto" />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
