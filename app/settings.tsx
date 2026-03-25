import { platformColor } from "@/components/platform-color";
import { ScrollView, View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: platformColor('systemBackground') }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        style={{
          backgroundColor: platformColor('secondarySystemBackground'),
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: platformColor('label'), marginBottom: 8 }}>
          Model Info
        </Text>
        <Text style={{ fontSize: 15, color: platformColor('secondaryLabel'), lineHeight: 22 }}>
          Qwen 3.5 0.8B (Q4_K_M quantization)
        </Text>
        <Text style={{ fontSize: 13, color: platformColor('tertiaryLabel'), marginTop: 4 }}>
          Running locally via llama.cpp
        </Text>
      </View>

      <View
        style={{
          backgroundColor: platformColor('secondarySystemBackground'),
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: platformColor('label'), marginBottom: 8 }}>
          About
        </Text>
        <Text style={{ fontSize: 15, color: platformColor('secondaryLabel'), lineHeight: 22 }}>
          This app runs a local LLM entirely on-device. No data is sent to external servers.
        </Text>
      </View>
    </ScrollView>
  );
}
