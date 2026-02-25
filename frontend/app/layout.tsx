"use client"; 

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "@/styles/StudentLayout.module.css"; 
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


          <main className={`${isStudentArea ? styles.noMargin : styles.mainContent} flex-grow`}>
              {children}
            </main>
        </StoreProvider>
      </body>
    </html>
  );
}