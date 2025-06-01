import clsx from "clsx";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import "@/styles/globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "STT/TTS Demo",
  description: "Speech-to-Text and Text-to-Speech Demo Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={clsx(notoSansKR.className, "antialiased")}>{children}</body>
    </html>
  );
}
