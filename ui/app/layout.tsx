import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Lato,
  Julius_Sans_One,
  Nunito,
} from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import AppProvider from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistNunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistJulius = Julius_Sans_One({
  variable: "--font-julius",
  subsets: ["latin"],
  weight: "400",
});

const geistLato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: [
    "400",
    "100",
    "300",
    "700",
    "900",
    "400",
    "100",
    "300",
    "700",
    "900",
  ],
});

export const metadata: Metadata = {
  title: "Fazerlane",
  description: "Gamify any youtube tutorial",
  icons: {
    icon: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Fazerlane",
    description: "Gamify any youtube tutorial.",
    url: "https://fazerlane.com/",
    siteName: "StableBank",
    images: [
      {
        url: "https://fazerlane.com/brand/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Fazerlane Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fazerlane",
    description: "Gamify any youtube tutorial",
    images: ["https://fazerlane.com/brand/favicon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistJulius.variable} ${geistLato.variable} ${geistNunito.variable} font-lato antialiased`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-center" reverseOrder={false} gutter={8} />
      </body>
    </html>
  );
}
