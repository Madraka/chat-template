import { Stack, useRouter } from "expo-router";

export default function SettingsLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerLeft: () => null,
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon="xmark"
            onPress={() => router.back()}
          />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon="info.circle">
            <Stack.Toolbar.MenuAction>
              Claude v1.260323.4 (2355638143)
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.Menu inline>
              <Stack.Toolbar.MenuAction icon="doc.text">
                Acceptable Use Policy
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="arrow.up.forward.square">
                Consumer Terms
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="arrow.up.forward.square">
                Privacy Policy
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="list.bullet.rectangle">
                Licenses
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.MenuAction icon="arrow.up.forward.square">
              Help & Support
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      </Stack.Screen>
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="capabilities"
        options={{
          title: "Capabilities",
        }}
      />
    </Stack>
  );
}
