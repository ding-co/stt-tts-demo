import TTSFactory from "@/engines/factory/TTSFactory";
import { useTTSConfig } from "@/providers/VoiceProvider";
import { useCallback, useMemo, useRef, useState } from "react";

import type { TTSEngine, TTSHookResult, TTSStartOptions } from "@/types/tts";

export const useTTS = (): TTSHookResult => {
  const { ttsConfig } = useTTSConfig();

  const engineRef = useRef<TTSEngine | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const start = useCallback(
    async (options: TTSStartOptions) => {
      if (!engineRef.current) {
        engineRef.current = TTSFactory.create(ttsConfig);
      }

      const startOptions: TTSStartOptions = {
        ...options,
        onMediaStream: (stream) => {
          setMediaStream(stream);

          options?.onMediaStream?.(stream);
        },
      };

      const result = await engineRef.current?.start(startOptions);

      return result;
    },
    [ttsConfig],
  );

  const stop = useCallback(() => {
    setMediaStream(null);

    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const analyserNode = useMemo(() => engineRef.current?.getAnalyserNode() ?? null, []);

  return {
    start,
    stop,
    mediaStream,
    analyserNode,
  };
};
