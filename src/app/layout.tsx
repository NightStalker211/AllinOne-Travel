import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

const displayFont = localFont({
  src: "../assets/fonts/BricolageGrotesqueVariable.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

const bodyFont = localFont({
  src: "../assets/fonts/InterVariable.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AllinOne Travel",
  description:
    "Multi-modal travel planner with honest, live-only pricing: live flight fares, deep-link price checks, a unified country Explore hub and a trip builder.",
};

// Dark-first: applied before paint so the shell never flashes the wrong theme.
// Only an explicit stored choice switches to light — the default is dark.
const themeInit = `(function(){try{var l=localStorage.getItem("ait-theme")==="light";document.documentElement.classList.toggle("light",l);document.documentElement.classList.toggle("dark",!l);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} font-sans`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
