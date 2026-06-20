import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: {
    default: "Charvia | AI Career Growth Platform",
    template: "%s | Charvia",
  },
  description: "Supercharge your job search with AI resume analysis, mock interviews, and intelligent job matching.",
  keywords: ["AI resume", "mock interviews", "job tracking", "career growth", "ATS analyzer"],
  openGraph: {
    title: "Charvia | AI Career Growth Platform",
    description: "Supercharge your job search with AI resume analysis, mock interviews, and intelligent job matching.",
    url: "https://charvia.com",
    siteName: "Charvia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charvia | AI Career Growth Platform",
    description: "Supercharge your job search with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
