import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { NavProgress } from "@/components/motion/nav-progress";
import { ThemeProvider } from "@/providers/theme-providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "ExeOS · The calm inbox that runs itself",
    template: "%s · ExeOS",
  },
  description:
    "ExeOS triages your Gmail by priority, drafts replies, schedules deadlines on Google Calendar and pings you only when it matters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} light h-full`}
      suppressHydrationWarning
    >
      <ClerkProvider appearance={{ theme: shadcn }}>
        <body className='flex min-h-full flex-col font-sans'>
          <ThemeProvider
            attribute='class'
            forcedTheme='light'
            defaultTheme='light'
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <NavProgress />
            </Suspense>
            {children}
            <Toaster position='bottom-right' closeButton toastOptions={{ classNames: { toast: 'rounded-2xl! border! shadow-lg!' } }} />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
