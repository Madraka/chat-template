import { useSyncExternalStore } from "react";
import { platformColor } from "@/components/platform-color";
import { Text } from "react-native";
import type { StreamingStore } from "./streaming-store";

export function StreamingMessage({ store }: { store: StreamingStore }) {
  const text = useSyncExternalStore(store.subscribe, store.get);
  return (
    <Text
      style={{
        fontSize: 16,
        lineHeight: 22,
        color: platformColor("label"),
      }}
    >
      {text || "..."}
      <Text style={{ opacity: 0.4 }}>{"\u258C"}</Text>
    </Text>
  );
}
