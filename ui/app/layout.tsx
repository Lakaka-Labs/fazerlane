import type {Metadata} from "next";
import {Geist, Geist_Mono, Lato, Julius_Sans_One, Nunito} from "next/font/google";
import "./globals.css";

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
    weight: "400"
});

const geistLato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["400", "100", "300", "700", "900", "400", "100", "300", "700", "900"]
});

export const metadata: Metadata = {
    title: "Fazerlane",
    description: "Gamify any youtube tutorial",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${geistJulius.variable} ${geistLato.variable} ${geistNunito.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
