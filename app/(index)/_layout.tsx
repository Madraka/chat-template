import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon={"line.horizontal.3"}
            onPress={() => {
              router.setParams({ drawer: "open" });
            }}
          />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon={"plus"}
            onPress={() => {
              // TODO: New app
            }}
          />
        </Stack.Toolbar>
      </Stack.Screen>
    </Stack>
  );
}
