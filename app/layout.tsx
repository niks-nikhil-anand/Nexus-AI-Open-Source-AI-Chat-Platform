import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Sans, Libre_Baskerville } from "next/font/google";
import { ChatProvider } from "@/lib/store";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus AI - Devkit Market",
  description: "Nexus AI is a powerful multi-model AI chat platform offering unlimited tokens and free access to cutting-edge models. Join the Devkit Market to start shipping vision today.",
  keywords: [
    "Nexus AI",
    "Devkit Market",
    "Multi-model AI",
    "AI Chat",
    "Unlimited tokens",
    "Free AI",
    "Vision AI",
    "Developer tools"
  ],
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${dmSans.variable} ${libreBaskerville.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-devkit-bg text-devkit-text">
        <div className="page-grid-bg" aria-hidden="true" />
        <ChatProvider>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
