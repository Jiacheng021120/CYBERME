import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBERME",
  description: "你的赛博分身，在你的城市中替你生活"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
