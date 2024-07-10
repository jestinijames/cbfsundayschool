import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import * as React from 'react';
import { Toaster } from 'sonner';

import '@/styles/globals.css';

import { cn } from '@/lib/utils';

import { siteConfig } from '@/constant/config';
import ProgressProvider from '@/providers/ProgressProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  authors: [
    {
      name: 'Jestin James',
      url: 'https://jestinjames.com',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html>
        <body
          className={cn(
            'relative h-full font-sans antialiased',
            inter.className,
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ProgressProvider>{children}</ProgressProvider>
          </ThemeProvider>
          <Toaster position='top-center' richColors />
        </body>
      </html>
    </ViewTransitions>
  );
}
