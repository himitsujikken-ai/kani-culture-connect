import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "可児市ブレインバンク",
  description: "可児市の歴史・文化・暮らしについてAIと対話できるサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Serif+JP:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative">{children}</body>
    </html>
  );
}
