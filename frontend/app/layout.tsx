// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

export const metadata: Metadata = {
  title: "EduLeaf | Premium Learning Platform",
  description: "Master your skills with EduLeaf's premium courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* ✅ StoreProvider wrappers for Redux State */}
        <StoreProvider>
          <ToastProvider />

          {/* Main Layout Container */}
          <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* children के अंदर आपके सारे पेजेस आएंगे */}
            <main className="mainContent">
              {children}
            </main>

            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}