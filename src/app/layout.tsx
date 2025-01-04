import '@/styles/globals.css';

import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';

import type { Metadata } from 'next';
const geistSans = localFont({
  src: '../styles/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../styles/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Parity Deals',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            geistSans.variable,
            geistMono.variable,
            'antialiased font-sans bg-background',
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
