"use client";

import clsx from "clsx";
import { useState } from "react";

type VoiceMode = "hands-free" | "push-to-talk";

export default function VoiceMode() {
  const [mode, setMode] = useState<VoiceMode>("hands-free");
  const [isListening, setIsListening] = useState(false);

  const handleModeChange = (newMode: VoiceMode) => {
    setMode(newMode);
    setIsListening(false);
  };

  const handleStartListening = () => {
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const modeButtonStyles = (currentMode: VoiceMode) =>
    clsx(
      "cursor-pointer rounded-full px-6 py-2 transition-all",
      mode === currentMode
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300",
    );

  const controlButtonStyles = (isActive: boolean) =>
    clsx(
      "rounded-full p-4 text-white transition-all",
      isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Voice Mode Selector */}
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => handleModeChange("hands-free")}
          className={modeButtonStyles("hands-free")}
        >
          Hands-free
        </button>
        <button
          onClick={() => handleModeChange("push-to-talk")}
          className={modeButtonStyles("push-to-talk")}
        >
          Push-to-talk
        </button>
      </div>

      {/* Voice Status Display */}
      <div className="mb-8 flex min-h-[200px] items-center justify-center rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          {isListening ? (
            <>
              <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-blue-100"></div>
              <p className="text-lg text-gray-600">Listening...</p>
            </>
          ) : (
            <p className="text-lg text-gray-600">
              {mode === "hands-free" ? "Click to start listening" : "Hold to talk"}
            </p>
          )}
        </div>
      </div>

      {/* Voice Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStopListening}
          className={controlButtonStyles(false)}
          disabled={!isListening}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={handleStartListening}
          className={controlButtonStyles(true)}
          disabled={isListening}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
