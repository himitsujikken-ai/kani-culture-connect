import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kani-Culture Connect — 可児市文化対話AI",
  description: "可児市の歴史・文化・暮らしについて、AIコンシェルジュ「かに語り」と対話できるアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="season-bg min-h-screen">{children}</body>
    </html>
  );
}
