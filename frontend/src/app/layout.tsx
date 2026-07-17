import type { Metadata } from "next";
import { Geist, Geist_Mono, Lilita_One, Comic_Neue } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-lilita-one",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zap! Chat - Join the Chaos!",
  description: "Yo! Sign in to Zap! Chat and join the squad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lilitaOne.variable} ${comicNeue.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col"><AppProvider>
        <SocketProvider>{children}</SocketProvider></AppProvider></body>
    </html>
  );
}
