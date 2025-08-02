import type { STTConfig, STTEngine } from "@/types/stt";

import STTWebSpeechEngine from "../stt/STTWebSpeechEngine";

export default class STTFactory {
  static create(config: STTConfig): STTEngine {
    switch (config.model) {
      case "web-speech":
        return new STTWebSpeechEngine(config);
      default:
        throw new Error(`Unsupported STT model: ${config.model}`);
    }
  }
}
