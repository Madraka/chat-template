import { Link, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";

const NAV_ITEMS = [
  { href: "/", label: "Chat" },
  { href: "/settings", label: "Settings" },
] as const;

// SVG icons as inline data URIs for web
function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PenSquareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function PanelLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

/**
 * Sidebar that collapses to an icon rail (matching Vercel chatbot pattern).
 * Expanded = 256px with labels. Collapsed = 48px icon-only rail.
 * Animated width transition.
 */
export function Sidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapse,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <Pressable
          onPress={onToggle}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar — always rendered, animates between w-64 and w-12 */}
      <View
        className={`
          fixed left-0 top-0 z-50 flex h-dvh flex-col bg-sidebar border-r border-border/40
          md:relative md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          width: isCollapsed ? 48 : 256,
          transition: "width 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <View
          className="flex flex-row items-center h-14 px-2 gap-1"
          style={{
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {/* Logo / toggle button */}
          <Pressable
            onPress={onCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {isCollapsed ? (
              <ChatIcon />
            ) : (
              <PanelLeftIcon />
            )}
          </Pressable>

          {/* Collapse trigger (only visible when expanded) */}
          {!isCollapsed && (
            <Pressable
              onPress={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
            >
              <Text className="text-sm">✕</Text>
            </Pressable>
          )}
        </View>

        {/* Action buttons */}
        <View
          className={`flex gap-1 pb-2 ${isCollapsed ? "items-center px-1" : "px-3"}`}
        >
          <Link href="/" asChild>
            <Pressable
              className={`flex flex-row items-center gap-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground ${
                isCollapsed
                  ? "h-8 w-8 justify-center"
                  : "h-8 justify-center border border-border/50 px-3"
              }`}
            >
              <PenSquareIcon />
              {!isCollapsed && (
                <Text className="text-[13px] font-medium text-foreground">
                  New chat
                </Text>
              )}
            </Pressable>
          </Link>
          {isCollapsed && (
            <Pressable className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <TrashIcon />
            </Pressable>
          )}
        </View>

        {/* Chat history / navigation */}
        {!isCollapsed && (
          <View className="flex-1 overflow-hidden px-2 py-1">
            <Text className="px-2 pb-1 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
              Recent
            </Text>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href as any} asChild>
                  <Pressable
                    className={`flex flex-row items-center rounded-lg px-2 py-1.5 mb-0.5 ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <Text
                      numberOfLines={1}
                      className={`text-[13px] ${
                        isActive
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        )}

        {/* Spacer when collapsed */}
        {isCollapsed && <View className="flex-1" />}

        {/* Footer: user info */}
        <View className="border-t border-border/40 p-2">
          <Pressable
            className={`flex flex-row items-center rounded-lg hover:bg-accent ${
              isCollapsed ? "h-8 w-8 justify-center" : "h-8 gap-2 px-2"
            }`}
          >
            <View
              className="h-5 w-5 rounded-full shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.35 0.08 250), oklch(0.25 0.05 290))",
              }}
            />
            {!isCollapsed && (
              <>
                <Text
                  numberOfLines={1}
                  className="flex-1 text-[13px] text-foreground"
                >
                  user@example.com
                </Text>
                <View className="text-muted-foreground">
                  <ChevronUpIcon />
                </View>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

export function SidebarToggle({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <PanelLeftIcon />
    </Pressable>
  );
}
