import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ViewTransitions } from 'next-view-transitions';
import * as React from 'react';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/toaster';

import { auth } from '@/auth';
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ViewTransitions>
        <html lang='en' suppressHydrationWarning>
          <body className={`${inter.className} overflow-hidden`}>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <ProgressProvider>{children}</ProgressProvider>
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </ViewTransitions>
    </SessionProvider>
  );
}
