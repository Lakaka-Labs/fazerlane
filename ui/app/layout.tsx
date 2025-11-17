import {
  Geist,
  Geist_Mono,
  Lato,
  Julius_Sans_One,
  Nunito,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import AppProvider from "@/providers";
import { rootMetadata } from "@/config/metadata";

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

const sfProDisplay = localFont({
  src: [
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYREGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYLIGHTITALIC.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYMEDIUM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYSEMIBOLDITALIC.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYBOLD.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/sf-pro-display/SFPRODISPLAYBLACKITALIC.otf",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-sf-pro-display",
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

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistJulius.variable} ${geistLato.variable} ${geistNunito.variable} ${sfProDisplay.variable} font-lato antialiased`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-center" reverseOrder={false} gutter={8} />
      </body>
    </html>
  );
}
