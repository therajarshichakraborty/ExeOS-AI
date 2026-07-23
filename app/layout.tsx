import type { Metadata } from "next";
import "./globals.css";
import { Nanum_Pen_Script, Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-providers";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nanumPenScript = Nanum_Pen_Script({
  subsets: ["latin"],
  variable: "--font-nanum-pen",
  weight: "400",
});

export const metadata: Metadata = {
  title: "ExeOS-AI",
  description: "Your autonomous AI assistant for email and calendar management",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${nanumPenScript.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <ClerkProvider appearance={{ theme: dark }}>
        <body className='h-screen overflow-hidden flex flex-col'>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='layout-theme-toggler absolute top-4 right-4'>
              <AnimatedThemeToggler />
            </div>
            {children}
            <Toaster position='top-right' richColors />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
