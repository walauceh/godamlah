import type { Metadata } from "next";
import { Roboto } from 'next/font/google';

import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-Send",
  description: "Store and send files easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
