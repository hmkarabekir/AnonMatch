import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header.jsx';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'AnonMatch - Decentralized Anonymous Matching',
  description: 'Find your match, anonymously on the blockchain.',
  keywords: 'anonymous, matching, blockchain, stellar, privacy, messaging',
  authors: [{ name: 'AnonMatch Team' }],
  robots: 'index, follow',
  manifest: '/manifest.json',
  openGraph: {
    title: 'AnonMatch - Anonymous Matching Platform',
    description: 'Connect with others anonymously on the Stellar blockchain',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnonMatch - Anonymous Matching Platform',
    description: 'Connect with others anonymously on the Stellar blockchain',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
