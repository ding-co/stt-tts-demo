"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

import type { STTConfig } from "@/types/stt";
import type { TTSConfig } from "@/types/tts";

interface VoiceContextType {
  sttConfig: STTConfig | null;
  ttsConfig: TTSConfig | null;
  setSTTConfig: (config: STTConfig | null) => void;
  setTTSConfig: (config: TTSConfig | null) => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

interface VoiceProviderProps {
  sttConfig?: STTConfig;
  ttsConfig?: TTSConfig;
  children: ReactNode;
}

export const VoiceProvider = ({
  sttConfig: initialSTTConfig,
  ttsConfig: initialTTSConfig,
  children,
}: VoiceProviderProps) => {
  const [sttConfig, setSTTConfig] = useState<STTConfig | null>(initialSTTConfig ?? null);
  const [ttsConfig, setTTSConfig] = useState<TTSConfig | null>(initialTTSConfig ?? null);

  return (
    <VoiceContext.Provider
      value={{
        sttConfig,
        ttsConfig,
        setSTTConfig,
        setTTSConfig,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceConfig = () => {
  const context = useContext(VoiceContext);

  if (!context) {
    throw new Error("useVoiceConfig must be used within a VoiceProvider.");
  }

  return context;
};

export const useSTTConfig = () => {
  const { sttConfig, setSTTConfig } = useVoiceConfig();

  if (!sttConfig || !setSTTConfig) {
    throw new Error(
      "STT config or setter is not provided. Make sure to pass sttConfig to VoiceProvider.",
    );
  }

  return { sttConfig, setSTTConfig };
};

export const useTTSConfig = () => {
  const { ttsConfig, setTTSConfig } = useVoiceConfig();

  if (!ttsConfig || !setTTSConfig) {
    throw new Error(
      "TTS config or setter is not provided. Make sure to pass ttsConfig to VoiceProvider.",
    );
  }

  return { ttsConfig, setTTSConfig };
};
