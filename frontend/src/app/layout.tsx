import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chit-Chat",
  description: "Chat with your people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {children}
        </AppRouterCacheProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#101010",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              border: "3px solid #101010",
              borderRadius: "12px",
              boxShadow: "4px 4px 0 0 #101010",
            },
          }}
        />
      </body>
    </html>
  );
}
