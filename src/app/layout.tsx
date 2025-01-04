import '@/styles/globals.css';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Parity Deals',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
