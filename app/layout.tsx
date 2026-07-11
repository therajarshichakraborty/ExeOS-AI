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
        <body className='min-h-full flex flex-col'>
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
            <footer className='footer-wrapper'>
              <div className='section-heading'>
                <p className='text-center text-sm text-muted-foreground'>
                  © {new Date().getFullYear()} ExeOS- AI.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
