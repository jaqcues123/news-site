import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "New England Wrecker Sales | Custom NRC Truck Builds",
    template: "%s | New England Wrecker Sales",
  },
  description:
    "New England Wrecker Sales specializes in custom NRC-built wreckers, rollbacks, and rotators. Browse available inventory or request a custom build.",
  keywords: ["wrecker", "rollback", "rotator", "NRC", "tow truck", "recovery truck", "New England"],
  icons: {
    icon: "/images/newsfleetblack.png",
    apple: "/images/newsfleetblack.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "New England Wrecker Sales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Anti-FOUC: apply saved theme class before React hydrates
          so there's no flash between server render and client
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('news-theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
