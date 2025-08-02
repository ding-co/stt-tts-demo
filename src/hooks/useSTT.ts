import STTFactory from "@/engines/factory/STTFactory";
import { useSTTConfig } from "@/providers/VoiceProvider";
import { useCallback, useRef, useState } from "react";

import type { STTEngine, STTHookResult, STTStartOptions } from "@/types/stt";

export const useSTT = (): STTHookResult => {
  const { sttConfig } = useSTTConfig();

  const engineRef = useRef<STTEngine | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const start = useCallback(
    async (options?: STTStartOptions) => {
      if (!engineRef.current) {
        engineRef.current = STTFactory.create(sttConfig);
      }

      setIsInitialized(false);
      setIsStarted(false);

      const startOptions: STTStartOptions = {
        ...options,
        onMediaStream: (stream) => {
          setMediaStream(stream);

          options?.onMediaStream?.(stream);
        },
      };

      await engineRef.current
        ?.start(startOptions)
        .then(() => {
          setIsInitialized(true);
          setIsStarted(true);
        })
        .catch((error) => {
          throw error;
        });
    },
    [sttConfig],
  );

  const stop = useCallback(() => {
    setIsInitialized(false);
    setIsStarted(false);
    setMediaStream(null);

    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const mute = useCallback(() => {
    setIsMuted(true);
    engineRef.current?.mute();
  }, []);

  const unmute = useCallback(() => {
    setIsMuted(false);
    engineRef.current?.unmute();
  }, []);

  return {
    start,
    stop,
    mute,
    unmute,
    mediaStream,
    isInitialized,
    isStarted,
    isMuted,
  };
};
