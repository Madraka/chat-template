import {
  Button,
  HStack,
  TextField,
  type TextFieldRef,
} from "@expo/ui/swift-ui";
import { frame, glassEffect, padding } from "@expo/ui/swift-ui/modifiers";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";

import { useChatContext } from "../chat-context";

export function PromptInput({ children }: { children: ReactNode }) {
  return (
    <HStack
      spacing={8}
      alignment="bottom"
      modifiers={[
        padding({ horizontal: 12, vertical: 8 }),
        glassEffect({
          glass: { variant: "regular", interactive: true },
          shape: "capsule",
        }),
        padding({ horizontal: 12, bottom: 12 }),
      ]}
    >
      {children}
    </HStack>
  );
}

export function PromptInputTextarea({
  placeholder = "Message...",
}: {
  placeholder?: string;
}) {
  const { input, setInput, onSend } = useChatContext();
  const ref = useRef<TextFieldRef>(null);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    onSend();
    ref.current?.setText("");
  }, [input, onSend]);

  return (
    <TextField
      ref={ref}
      placeholder={placeholder}
      defaultValue=""
      multiline
      numberOfLines={5}
      onChangeText={setInput}
      onSubmit={handleSubmit}
      modifiers={[frame({ minHeight: 36 })]}
    />
  );
}

export function PromptInputSubmit() {
  const { input, isGenerating, onSend } = useChatContext();
  const disabled = !input.trim() || isGenerating;

  return (
    <Button
      systemImage="arrow.up"
      label={isGenerating ? "..." : "Send"}
      onPress={onSend}
      modifiers={[frame({ width: 36, height: 36 })]}
    />
  );
}
