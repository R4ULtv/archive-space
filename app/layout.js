import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import CustomToaster from "@/components/layout/CustomToaster";

export const metadata = {
  metadataBase: process.env.HOST_NAME,
  title: "Archive Space",
  description: "A simple archive space build for you by Raul Carini.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${GeistMono.className} bg-zinc-100 dark:bg-zinc-900 selection:bg-zinc-400/25 dark:selection:bg-zinc-600/25`}
      >
        <ThemeProvider attribute="class" enableSystem={false}>
          <main
            className="max-w-3xl py-16 px-6 mx-auto"
            style={{ minHeight: "calc(100vh - 45px)" }}
          >
            {children}
          </main>
          <CustomToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
