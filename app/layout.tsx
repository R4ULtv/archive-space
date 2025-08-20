import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_HOST || "http://localhost:3000",
  ),
  title: {
    default: "Home - Archive Space",
    template: "%s - Archive Space",
  },
  description: "A simple archive space build for you by Raul Carini.",
  openGraph: {
    title: "Archive Space",
    description: "A simple archive space build for you by Raul Carini.",
    url: process.env.NEXT_PUBLIC_HOST || "http://localhost:3000",
    images: [
      {
        url: `https://www.raulcarini.dev/api/dynamic-og?title=Archive%20Space&description=A%20simple%20archive%20space%20build%20for%20you%20by%20Raul%20Carini.`,
        width: 843,
        height: 441,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${geistSans.variable} antialiased selection:bg-primary/25`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
