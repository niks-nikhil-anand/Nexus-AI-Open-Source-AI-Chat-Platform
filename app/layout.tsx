import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Sans, Libre_Baskerville } from "next/font/google";
import { ChatProvider } from "@/lib/store";
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
  title: "NeuralChat",
  description: "Multi-model AI chat platform",
  icons: {
    icon: "/logo2.png",
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
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
