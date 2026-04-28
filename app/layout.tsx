import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CIT-Racing Team | 日本大学生産工学部 学生フォーミュラ",
    template: "%s | CIT-Racing Team",
  },
  description:
    "日本大学生産工学部の学生フォーミュラチームCIT-Racing Team。2002年結成。学生が設計・製作したフォーミュラカーで全日本大会に挑戦中。スポンサー・応援募集中。",
  openGraph: {
    title: "CIT-Racing Team | 日本大学生産工学部 学生フォーミュラ",
    description:
      "日本大学生産工学部の学生フォーミュラチームCIT-Racing Team。2002年結成。学生が設計・製作したフォーミュラカーで全日本大会に挑戦中。スポンサー・応援募集中。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-racing-black text-racing-white">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
