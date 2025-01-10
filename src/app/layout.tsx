import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import { ToastContainer } from "react-toastify";
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
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
