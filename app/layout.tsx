import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Sans } from "next/font/google";
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
  weight: ["600"],
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
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <body className="bg-[var(--nc-void)] text-[var(--nc-text-primary)] min-h-screen antialiased">
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
