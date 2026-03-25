import {
  ChatProvider,
  Conversation,
  ConversationEmptyState,
  ConversationScrollButton,
  LoadingScreen,
  Message,
  MessageResponse,
  PromptInput,
  PromptInputAction,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  StreamingMessage,
  createStreamingStore,
  type ChatMessage,
} from "@/components/chat";
import { platformColor } from "@/components/platform-color";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text } from "react-native";

// Throttle interval for streaming UI updates (~30fps)
const STREAMING_THROTTLE_MS = 32;

const IS_WEB = process.env.EXPO_OS === "web";

const MOCK_RESPONSES = [
  "That's a great question! Here's what I think:\n\nThe key insight is that **simplicity** often beats complexity. When you break down the problem into smaller pieces, the solution becomes much clearer.\n\n```javascript\nconst answer = problems\n  .map(simplify)\n  .reduce(combine, []);\n```\n\nHope that helps!",
  "I'd be happy to help with that. Let me walk you through it step by step:\n\n1. **First**, identify the core requirements\n2. **Then**, design the interface\n3. **Finally**, implement and test\n\nThe most important thing is to start simple and iterate. You can always add more features later.",
  "Interesting! Here's a quick overview:\n\n> The best code is the code you don't have to write.\n\nThat said, when you *do* need to write code, keep these principles in mind:\n\n- **Readability** over cleverness\n- **Composition** over inheritance\n- **Explicit** over implicit\n\nLet me know if you want me to dive deeper into any of these!",
  "Sure thing! Here's a concise answer:\n\nThe approach I'd recommend is to use a **streaming architecture** where data flows through the system in real-time. This gives you:\n\n- Lower latency\n- Better resource utilization\n- Simpler error handling\n\n```python\nasync for chunk in stream:\n    process(chunk)\n```\n\nWant me to elaborate on any part?",
];

async function mockStreamResponse(
  text: string,
  onToken: (token: string) => void,
  signal?: AbortSignal,
) {
  const words = text.split(/(?<=\s)/);
  for (const word of words) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
    onToken(word);
  }
}

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const streamingStore = useMemo(() => createStreamingStore(), []);
  const streamingRef = useRef("");
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const mockIndexRef = useRef(0);

  // --- Model loading (AI concern) ---

  const loadModel = useCallback(async () => {
    if (IS_WEB) {
      // Skip model download on web — use mock responses
      setContext({});
      setIsLoading(false);
      setStatus("Ready (mock)");
      return;
    }

    try {
      const { Directory, File, Paths } = await import("expo-file-system");
      const { initLlama } = await import("llama.rn");

      const MODEL_URL =
        "https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/Qwen3.5-0.8B-Q4_K_M.gguf";
      const MODEL_FILENAME = "Qwen3.5-0.8B-Q4_K_M.gguf";

      const modelsDir = new Directory(Paths.document, "models");
      const modelFile = new File(modelsDir, MODEL_FILENAME);

      if (!modelsDir.exists) {
        modelsDir.create();
      }

      if (!modelFile.exists) {
        setStatus("Downloading Qwen 3.5 (533MB)...");
        await File.downloadFileAsync(MODEL_URL, modelFile);
      }

      setStatus("Loading model...");

      const ctx = await initLlama({
        model: modelFile.uri,
        n_ctx: 4096,
        n_batch: 512,
        n_threads: 4,
        n_gpu_layers: process.env.EXPO_OS === "ios" ? 99 : 0,
      });

      setContext(ctx);
      setIsLoading(false);
      setStatus("Ready");
    } catch (err) {
      console.error("Failed to load model:", err);
      setError(err instanceof Error ? err.message : "Failed to load model");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModel();
    return () => {
      if (!IS_WEB && context && typeof context === "object" && "release" in context) {
        (context as { release: () => void }).release();
      }
    };
  }, []);

  // --- Message generation (AI concern) ---

  const handleSend = async () => {
    if (!input.trim() || !context || isGenerating) return;

    if (process.env.EXPO_OS === "ios") {
      const Haptics = await import("expo-haptics");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };

    const newMessages = [...messages, userMessage, assistantMessage];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);

    streamingRef.current = "";
    streamingStore.set("");

    try {
      if (IS_WEB) {
        const mockText =
          MOCK_RESPONSES[mockIndexRef.current % MOCK_RESPONSES.length];
        mockIndexRef.current++;

        await mockStreamResponse(mockText, (token) => {
          streamingRef.current += token;
          if (!throttleRef.current) {
            throttleRef.current = setTimeout(() => {
              streamingStore.set(streamingRef.current);
              throttleRef.current = null;
            }, STREAMING_THROTTLE_MS);
          }
        });
      } else {
        const llamaContext = context as {
          completion: (
            params: Record<string, unknown>,
            cb: (data: { token?: string }) => void,
          ) => Promise<void>;
        };

        const chatMessages = [
          {
            role: "system" as const,
            content: "You are a helpful assistant. Be concise.",
          },
          ...newMessages.slice(0, -1).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        await llamaContext.completion(
          {
            messages: chatMessages,
            n_predict: 512,
            temperature: 0.7,
            top_p: 0.9,
            stop: ["<|im_end|>", "<|endoftext|>"],
          },
          (data) => {
            if (data.token) {
              streamingRef.current += data.token;
              if (!throttleRef.current) {
                throttleRef.current = setTimeout(() => {
                  streamingStore.set(streamingRef.current);
                  throttleRef.current = null;
                }, STREAMING_THROTTLE_MS);
              }
            }
          },
        );
      }
    } catch (err) {
      console.error("Generation error:", err);
      streamingRef.current = "Error generating response";
    } finally {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
      const finalContent = streamingRef.current;
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          content: finalContent,
        };
        return updated;
      });
      streamingRef.current = "";
      streamingStore.set("");
      setIsGenerating(false);
      if (process.env.EXPO_OS === "ios") {
        const Haptics = await import("expo-haptics");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  // --- Render ---

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      if (item.role === "user") {
        return <Message from="user">{item.content}</Message>;
      }

      const isStreaming = isGenerating && item.content === "";
      return (
        <Message from="assistant">
          {isStreaming ? (
            <StreamingMessage store={streamingStore} />
          ) : (
            <MessageResponse>{item.content}</MessageResponse>
          )}
        </Message>
      );
    },
    [isGenerating, streamingStore],
  );

  if (isLoading) {
    return <LoadingScreen status={status} error={error} />;
  }

  return (
    <ChatProvider
      value={{
        messages,
        input,
        setInput,
        isGenerating,
        onSend: handleSend,
        streamingStore,
      }}
    >
      <Conversation
        renderMessage={renderMessage}
        emptyState={
          <ConversationEmptyState
            title={IS_WEB ? "Chat Demo" : "Qwen 3.5 Ready"}
            description={
              IS_WEB
                ? "Mock responses for web preview"
                : "Running locally via llama.cpp"
            }
          />
        }
      >
        <ConversationScrollButton />
        <PromptInput>
          <PromptInputAction>
            <Text style={{ fontSize: 20, color: platformColor("label") }}>
              +
            </Text>
          </PromptInputAction>
          <PromptInputBody>
            <PromptInputTextarea />
            <PromptInputSubmit />
          </PromptInputBody>
        </PromptInput>
      </Conversation>
    </ChatProvider>
  );
}
