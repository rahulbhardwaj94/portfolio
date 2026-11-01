import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

// Geist is still used by the case-study pages.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Flight Recorder theme: editorial serif for display, JetBrains Mono for trace data.
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const traceMono = JetBrains_Mono({
  variable: "--font-trace",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahul Bhardwaj — Backend & AI Infrastructure Engineer",
  description:
    "Backend engineer building AI infrastructure & agent tooling — orchestration, evaluation, memory, and governance for LLM agents.",
  openGraph: {
    title: "Rahul Bhardwaj — Backend & AI Infrastructure Engineer",
    description:
      "Backend engineer building AI infrastructure & agent tooling.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} ${plexSans.variable} ${plexMono.variable} ${grotesk.variable} ${serif.variable} ${traceMono.variable}`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
