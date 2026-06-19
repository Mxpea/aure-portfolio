import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Aurelith | Creative Developer & Designer",
  description: "ad perpetranda miracula rei unius... - A creative developer and designer exploring the infinite possibilities of code and aesthetics.",
  keywords: ["Aurelith", "Mxpea", "creative developer", "designer", "portfolio"],
  authors: [{ name: "Aurelith" }],
  icons: {
    icon: [
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Aurelith | Creative Developer & Designer",
    description: "ad perpetranda miracula rei unius...",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
