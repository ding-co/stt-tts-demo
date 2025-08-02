import type { TTSConfig, TTSEngine } from "@/types/tts";

import TTSWebSpeechEngine from "../tts/TTSWebSpeechEngine";

export default class TTSFactory {
  static create(config: TTSConfig): TTSEngine {
    switch (config.model) {
      case "web-speech":
        return new TTSWebSpeechEngine(config);
      default:
        throw new Error(`Unsupported TTS model: ${config.model}`);
    }
  }
}
