import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Geist-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: "../../public/fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-geist-mono",
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
      className="antialiased"
    >
      <body className={`min-h-screen ${geistSans.variable} ${geistMono.variable}`} style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', fontWeight: 450 }}>
        {children}
      </body>
    </html>
  );
}
