"use client";

import { useRef, useState } from "react";

import { useSTT } from "@/hooks/useSTT";

export default function STTWebSpeech() {
  const { start, stop, isStarted } = useSTT();

  const [recognizedText, setRecognizedText] = useState("");
  const recognizedTextRef = useRef("");

  const handleStart = () => {
    start({
      onRecognizing: (text: string) => {
        setRecognizedText(recognizedTextRef.current + text);
        console.log("recognizing", text);
      },
      onRecognized: (text: string) => {
        recognizedTextRef.current += text + " ";
        setRecognizedText(recognizedTextRef.current);
        console.log("recognized", text);
      },
      onError: (reason: string) => {
        console.log("cancelled", reason);
      },
    });
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold">Web Speech API - Speech Recognition (STT)</h1>
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-2">
            <button
              onClick={isStarted ? handleStop : handleStart}
              className={`rounded-lg px-4 py-2 font-medium ${
                isStarted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isStarted ? "Stop Recognition" : "Start Recognition"}
            </button>
          </div>

          <div className="mt-4 min-h-[100px] rounded-lg bg-gray-100 p-4">
            <p className="whitespace-pre-wrap text-gray-800">{recognizedText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
