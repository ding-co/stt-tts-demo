import type { STTConfig, STTEngine, STTStartOptions } from "@/types/stt";

export default class STTWebSpeechEngine implements STTEngine {
  private config: STTConfig = {
    model: "web-speech",
    constraints: {
      audio: {
        channelCount: 1,
        sampleRate: 16_000,
        sampleSize: 16,
      },
    },
  };
  private mediaStream: MediaStream | null = null;
  private recognition: SpeechRecognition | null = null;
  private onMediaStream?: (stream: MediaStream | null) => void;
  private onAfterMicPermission?: () => void;
  private onRecognizing?: (text: string) => void;
  private onRecognized?: (text: string) => void;
  private onEnded?: () => void;
  private onError?: (reason: string) => void;

  constructor(config: STTConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  async getUserMedia(constraints: MediaStreamConstraints) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Invalid media devices.");
      }

      await navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
        this.mediaStream = mediaStream;
        this.onMediaStream?.(this.mediaStream);
        this.onAfterMicPermission?.();
      });
    } catch (error) {
      throw new Error("Error accessing media devices: " + error);
    }
  }

  async start({
    onMediaStream,
    onAfterMicPermission,
    onRecognizing,
    onRecognized,
    onEnded,
    onError,
  }: STTStartOptions) {
    this.onMediaStream = onMediaStream;
    this.onAfterMicPermission = onAfterMicPermission;
    this.onRecognizing = onRecognizing;
    this.onRecognized = onRecognized;
    this.onEnded = onEnded;
    this.onError = onError;

    if (!this.mediaStream && this.config.constraints) {
      await this.getUserMedia(this.config.constraints);
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error("Speech recognition is not supported in this browser.");
      }

      this.recognition = new SpeechRecognition();

      this.recognition.lang = this.config.language || "en-US";
      this.recognition.continuous = this.config.continuous || false;
      this.recognition.interimResults = this.config.interimResults || false;
      this.recognition.maxAlternatives = this.config.maxAlternatives || 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript;
          const isFinal = event.results[i].isFinal;

          if (isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }

          if (finalTranscript.length > 0) {
            this.onRecognized?.(finalTranscript);
          } else {
            this.onRecognizing?.(interimTranscript);
          }
        }
      };

      this.recognition.onend = () => {
        this.onEnded?.();
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.onError?.(`Speech recognition error: ${event.error}`);
        this.recognition?.stop();
      };

      this.recognition.start();
    } catch (error) {
      console.error("Failed to start STT Web Speech Engine: " + error);
      this.onError?.(`Failed to start STT Web Speech Engine: ${error}`);
    }
  }

  stop() {
    this.recognition?.stop();
    this.recognition = null;
    this.mediaStream = null;
  }

  mute() {
    this.mediaStream?.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }

  unmute() {
    this.mediaStream?.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
  }
}
