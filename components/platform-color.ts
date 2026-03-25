import { PlatformColor as RNPlatformColor } from "react-native";

const WEB_COLORS: Record<string, string> = {
  label: "#000",
  secondaryLabel: "#6c6c70",
  tertiaryLabel: "#acacb0",
  placeholderText: "#c7c7cc",
  separator: "#c6c6c8",
  link: "#007aff",
  systemBlue: "#007aff",
  systemRed: "#ff3b30",
  systemBackground: "#fff",
  secondarySystemBackground: "#f2f2f7",
  tertiarySystemBackground: "#fff",
  tertiarySystemFill: "rgba(118,118,128,0.12)",
};

export function platformColor(name: string) {
  if (process.env.EXPO_OS === "web") {
    return WEB_COLORS[name] ?? "#000";
  }
  return RNPlatformColor(name);
}
