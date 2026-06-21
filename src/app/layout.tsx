import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
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
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
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
