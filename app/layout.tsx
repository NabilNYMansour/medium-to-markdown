import "@mantine/core/styles.css";
import type { Metadata } from "next";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Header } from "./ui/layout/Header";
import { theme } from "@/theme";
import { Footer } from "./ui/layout/Footer";
import classes from "./home.module.css";
import localFont from 'next/font/local';
import cx from 'clsx';

const CaviarDreams = localFont({ src: '../public/CaviarDreams.ttf' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={cx(classes.body, CaviarDreams.className)}>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <Header />
          <div className={classes.app}>
            {children}
          </div>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
