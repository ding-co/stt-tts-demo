import type { TTSConfig, TTSEngine, TTSResult, TTSStartOptions } from "@/types/tts";

export default class TTSWebSpeechEngine implements TTSEngine {
  private config: TTSConfig;
  private mediaStream: MediaStream | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private onMediaStream?: (stream: MediaStream | null) => void;
  private onAudioStarted?: () => void;
  private onAudioEnded?: () => void;
  private onError?: (error: unknown) => void;

  constructor(config: TTSConfig) {
    this.config = config;
  }

  // Analyze Waveform Data
  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  async start(options: TTSStartOptions): Promise<TTSResult> {
    this.onMediaStream = options?.onMediaStream;
    this.onAudioStarted = options?.onAudioStarted;
    this.onAudioEnded = options?.onAudioEnded;
    this.onError = options?.onError;

    if (!("speechSynthesis" in window)) {
      throw new Error("Speech synthesis is not supported in this browser.");
    }

    this.audioContext = new AudioContext();
    const destination = this.audioContext.createMediaStreamDestination();
    this.mediaStream = destination.stream;

    this.onMediaStream?.(this.mediaStream);

    this.mediaRecorder = new MediaRecorder(this.mediaStream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    const utterance = new SpeechSynthesisUtterance(options.text);

    utterance.lang = this.config.language || "en-US";
    utterance.voice = this.config.voice
      ? window.speechSynthesis.getVoices().find((voice) => voice.name === this.config.voice) || null
      : null;
    utterance.pitch = this.config.pitch || 1;
    utterance.rate = this.config.rate || 1;
    utterance.volume = this.config.volume || 1;

    const startTime = Date.now();

    this.mediaRecorder.start();

    utterance.onstart = () => {
      this.onAudioStarted?.();
    };

    utterance.onend = () => {
      this.onAudioEnded?.();
      this.mediaRecorder?.stop();
    };

    utterance.onerror = (event) => {
      this.onError?.(event.error);
    };

    window.speechSynthesis.speak(utterance);

    return {
      text: options.text,
      audio: new Blob(this.audioChunks, { type: "audio/wav" }),
      duration: Date.now() - startTime,
    };
  }

  stop() {
    window.speechSynthesis.cancel();

    this.audioContext?.close();
    this.mediaRecorder?.stop();
  }
}
