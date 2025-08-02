import STTWebSpeech from "@/components/STTWebSpeech";
import TTSWebSpeech from "@/components/TTSWebSpeech";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <nav className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">STT/TTS Demo</h1>
        <div className="flex flex-col gap-10">
          <STTWebSpeech />
          <TTSWebSpeech />
        </div>
      </nav>
    </main>
  );
}
