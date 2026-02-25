"use client"; // Pathname चेक करने के लिए ज़रूरी है

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 👇 यह इम्पोर्ट जोड़ना बहुत ज़रूरी है (अपना पाथ चेक कर लें)
import styles from "@/styles/StudentLayout.module.css"; 
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import ToastProvider from "@/redux/provider/ToastProvider";
import { StoreProvider } from "@/redux/provider/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudentArea = pathname?.startsWith("/student");

  return (
    <html lang="en">
      <head>
        <title>Skillverse | Premium Learning Platform</title>
        <meta name="description" content="Master your skills with EduLeaf's premium courses" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <ToastProvider />

          {/* Main Layout Container */}
          <div className="flex flex-col min-h-screen">

            {/* 🚫 स्टूडेंट एरिया में Navbar गायब */}
            {!isStudentArea && <Navbar />}

            {/* ✅ children के अंदर आपके सारे पेजेस आएंगे */}
            {/* flex-grow यह सुनिश्चित करेगा कि कंटेंट पूरी जगह ले और noMargin ऊपर की खाली जगह हटा देगा */}
            <main className={`${isStudentArea ? styles.noMargin : styles.mainContent} flex-grow`}>
              {children}
            </main>

            {/* 🚫 स्टूडेंट एरिया में Footer गायब */}
            {!isStudentArea && <Footer />}

          </div>
        </StoreProvider>
      </body>
    </html>
  );
}