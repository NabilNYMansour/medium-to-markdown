import "@mantine/core/styles.css";
import type { Metadata } from "next";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Header } from "./ui/layout/Header";
import { Footer } from "./ui/layout/Footer";
import { theme } from "@/theme";
import classes from "./home.module.css";
import localFont from 'next/font/local';
import cx from 'clsx';

const CaviarDreams = localFont({ src: '../public/CaviarDreams.ttf' });

const description = "Convert Medium articles to Markdown online for free. No signup required. Just paste the URL and get the Markdown.";
const title = "Medium to Markdown";
const author = "Nabil Mansour";

const MAIN_URL = `https://${process.env.MAIN_URL}`;
const imageLink = `${MAIN_URL}/med2mark.png`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${MAIN_URL}` },
  keywords: "Medium, Markdown, Articles, .md, Convert, Online, Free, Turndown, HTML, Next.js, Nabil Mansour",
  openGraph: {
    title,
    siteName: title,
    description,
    url: MAIN_URL,
    type: "website",
    images: [{ url: imageLink, alt: title }],
    locale: 'en_US',
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageLink],
  },
  authors: { name: author },
  creator: author,
  publisher: author,
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=yes"
        />
      </head>
      <body className={cx(classes.body, CaviarDreams.className)}>
        <MantineProvider defaultColorScheme="light" theme={theme}>
          <Header />
          <main className={classes.app}>{children}</main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
