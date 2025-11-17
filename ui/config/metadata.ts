import { Metadata } from "next";

export const rootMetadata: Metadata = {
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
