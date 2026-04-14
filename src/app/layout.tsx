import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "EnglishPath — Học tiếng Anh A1 đến B2",
  description: "Nền tảng học tiếng Anh toàn diện với 4 kỹ năng, ngữ pháp có hệ thống và AI cá nhân hóa. Lộ trình rõ ràng từ A1 đến B2.",
  keywords: ["học tiếng Anh", "IELTS", "TOEIC", "luyện nghe nói đọc viết", "A1 B2"],
  openGraph: {
    title: "EnglishPath — Học tiếng Anh A1 đến B2",
    description: "Nền tảng học tiếng Anh toàn diện với AI hỗ trợ cá nhân hóa.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.variable} ${mono.variable} h-full antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontSize: "14px", fontWeight: 500 },
            success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
