import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Tracker — Track every application in one dashboard",
  description:
    "A premium, single-user dashboard to track every job application — company, role, status, and analytics — in one place.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#6d6afc",
    colorBackground: "#1b1b1f",
    colorText: "#f4f4f6",
    colorTextSecondary: "#9b9ba6",
    colorInputBackground: "#161619",
    colorInputText: "#f4f4f6",
    colorDanger: "#f87171",
    borderRadius: "0.7rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    cardBox: "shadow-2xl shadow-black/40",
    card: "bg-card border border-white/10",
    headerTitle: "text-[1.35rem]",
    socialButtonsBlockButton: "border-white/10",
    formButtonPrimary:
      "bg-[#6d6afc] hover:bg-[#5d5af0] text-white normal-case font-medium",
    footerActionLink: "text-[#9b9bff] hover:text-white",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProvider>{children}</QueryProvider>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
