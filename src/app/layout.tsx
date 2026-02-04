import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WaterTracker - Stay Hydrated',
  description: 'Simple and beautiful hydration tracking app. Track your daily water intake, set goals, and stay healthy.',
  keywords: ['water tracker', 'hydration', 'health', 'drink water', 'wellness'],
  authors: [{ name: 'WaterTracker' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WaterTracker',
  },
  openGraph: {
    title: 'WaterTracker - Stay Hydrated',
    description: 'Track your daily water intake and stay healthy',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
