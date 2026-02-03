import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trail Finder - Discover Your Next Hiking Adventure',
  description: 'Find and explore hiking trails with interactive maps, real-time weather, and AI-powered recommendations.',
  keywords: ['hiking', 'trails', 'outdoor', 'nature', 'maps', 'weather', 'adventure'],
  authors: [{ name: 'Trail Finder' }],
  openGraph: {
    title: 'Trail Finder - Discover Your Next Hiking Adventure',
    description: 'Find and explore hiking trails with interactive maps, real-time weather, and AI-powered recommendations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
