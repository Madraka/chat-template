import { Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useSyncExternalStore } from "react";

import type { StreamingStore } from "../streaming-store";

export function StreamingMessage({ store }: { store: StreamingStore }) {
  const text = useSyncExternalStore(store.subscribe, store.get);
  return (
    <Text
      modifiers={[
        foregroundStyle({ type: "hierarchical", style: "primary" }),
      ]}
    >
      {(text || "...") + "\u258C"}
    </Text>
  );
}
