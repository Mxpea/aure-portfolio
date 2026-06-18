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
