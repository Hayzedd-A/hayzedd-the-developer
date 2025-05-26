import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import MainWrapper from "./components/MainWrapper";
import SuspenseWrapper from "./components/common/SuspenseWrapper";
import AppInitializer from "./components/common/AppInitializer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adebayo Azeez - Full Stack Developer",
  description: "Portfolio of Adebayo Azeez, a skilled full stack web developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AnalyticsProvider>
            <AppInitializer>
              {/* <SuspenseWrapper> */}
              <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Sidebar />
                <MainWrapper>{children}</MainWrapper>
              </div>
              {/* </SuspenseWrapper> */}
            </AppInitializer>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
