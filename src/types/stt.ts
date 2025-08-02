export type STTModel = "web-speech";

export interface STTConfig {
  model: STTModel;
  apiKey?: string;
  token?: string;
  region?: string;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  constraints?: MediaStreamConstraints;
}

export interface STTEngine {
  start(options?: STTStartOptions): Promise<void>;
  stop(): void | Promise<void>;
  mute(): void;
  unmute(): void;
}

export interface STTStartOptions {
  onMediaStream?: (stream: MediaStream | null) => void; // Media Stream transfer
  onAfterMicPermission?: () => void;
  onRecognizing?: (text: string) => void;
  onRecognized?: (text: string) => void;
  onError?: (reason: string) => void;
  onEnded?: () => void;
  onSessionStopped?: () => void;
}

export interface STTHookResult {
  start: (options?: STTStartOptions) => Promise<void>;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  mediaStream: MediaStream | null;
  isInitialized: boolean;
  isStarted: boolean;
  isMuted: boolean;
}
