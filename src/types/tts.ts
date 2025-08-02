export type TTSModel = "web-speech";

export interface TTSConfig {
  model: TTSModel;
  speaker?: string;
  apiKey?: string;
  voice?: string;
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface TTSEngine {
  start(options: TTSStartOptions): Promise<TTSResult>;
  stop(): void;
  getAnalyserNode(): AnalyserNode | null;
}

export interface TTSStartOptions {
  text: string;
  onMediaStream?: (stream: MediaStream | null) => void; // Media Stream transfer
  onAudioStarted?: () => void;
  onAudioEnded?: () => void;
  onError?: (error: unknown) => void;
}

export interface TTSResult {
  text: string;
  audio: Blob;
  duration: number;
}

export interface TTSHookResult {
  start: (options: TTSStartOptions) => Promise<TTSResult>;
  stop: () => void;
  mediaStream: MediaStream | null;
  analyserNode: AnalyserNode | null;
}
