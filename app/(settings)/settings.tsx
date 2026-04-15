import { Image } from "@/components/tw";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const [hapticFeedback, setHapticFeedback] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="pb-10"
    >
      {/* Email */}
      <View
        className="mx-5 mt-4 mb-5 bg-muted rounded-xl px-4 py-3"
        style={{ borderCurve: "continuous" }}
      >
        <Text selectable className="text-[15px] text-foreground">
          developer@expo.dev
        </Text>
      </View>

      {/* Account */}
      <SettingsRow
        icon="person.crop.circle"
        label="Profile"
        href="/(settings)/profile"
      />
      <SettingsRow icon="dollarsign.circle" label="Billing" detail="Max plan" />
      <SettingsRow icon="chart.line.uptrend.xyaxis" label="Usage" />

      <SectionDivider />

      {/* Features */}
      <SettingsRow
        icon="slider.horizontal.3"
        label="Capabilities"
        href="/(settings)/capabilities"
      />
      <SettingsRow icon="square.grid.2x2" label="Connectors" />
      <SettingsRow icon="person.2.circle" label="Permissions" />

      <SectionDivider />

      {/* Preferences */}
      <SettingsRow
        icon="circle.lefthalf.filled"
        label="Appearance"
        detail="System"
      />
      <SettingsRow icon="globe" label="Speech language" detail="EN" />
      <SettingsRow icon="bell" label="Notifications" />
      <SettingsRow icon="lock.shield" label="Privacy" />
      <SettingsRow icon="link" label="Shared links" />

      <SectionDivider />

      {/* Toggles */}
      <SettingsToggleRow
        icon="iphone.radiowaves.left.and.right"
        label="Haptic feedback"
        value={hapticFeedback}
        onValueChange={setHapticFeedback}
      />

      <SectionDivider />

      {/* Log out */}
      <Pressable className="flex-row items-center px-5 py-3.5 gap-4 active:bg-muted">
        <Image
          source="sf:rectangle.portrait.and.arrow.right"
          className="w-5 h-5 text-foreground"
        />
        <Text className="text-[17px] text-foreground">Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

function SectionDivider() {
  return <View className="h-px bg-border mx-5" />;
}

function SettingsRow({
  icon,
  label,
  detail,
  href,
}: {
  icon: string;
  label: string;
  detail?: string;
  href?: string;
}) {
  const content = (
    <View className="flex-row items-center px-5 py-3.5 gap-4 active:bg-muted">
      <Image source={`sf:${icon}`} className="w-5 h-5 text-foreground" />
      <Text className="flex-1 text-[17px] text-foreground">{label}</Text>
      {detail && (
        <Text className="text-[15px] text-muted-foreground">{detail}</Text>
      )}
      <Image
        source="sf:chevron.right"
        className="w-3.5 h-3.5 text-muted-foreground"
      />
    </View>
  );

  if (href) {
    return (
      <Link href={href as any} asChild>
        <Pressable>{content}</Pressable>
      </Link>
    );
  }

  return <Pressable>{content}</Pressable>;
}

function SettingsToggleRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center px-5 py-3 gap-4">
      <Image source={`sf:${icon}`} className="w-5 h-5 text-foreground" />
      <Text className="flex-1 text-[17px] text-foreground">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
