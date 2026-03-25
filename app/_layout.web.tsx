import "../global.css";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
