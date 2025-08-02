"use client";

import { useState } from "react";

import { useTTS } from "@/hooks/useTTS";

export default function TTSWebSpeech() {
  const [text, setText] = useState("");
  const { start, stop } = useTTS();

  const handleSpeak = async () => {
    if (text.trim()) {
      await start({
        text,
        onAudioStarted: () => {
          console.log("Audio started");
        },
        onAudioEnded: () => {
          console.log("Audio ended");
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold">Web Speech API - Speech Synthesis (TTS)</h1>
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <label htmlFor="text-input" className="mb-2 block text-sm font-medium text-gray-700">
            Text Input
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-32 w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter text to convert to speech"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSpeak}
            disabled={!text.trim()}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Play
          </button>
          <button
            onClick={stop}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
