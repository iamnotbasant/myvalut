import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stashr.me'),
  title: 'Stashr',
  description:
    'Stashr is the AI bookmark manager that captures every save from every platform you use — including X, Reddit, Instagram, TikTok, YouTube, and Bluesky — auto-tagged and agent-ready.',
  icons: {
    icon: [
      { url: '/branding/icon.svg', type: 'image/svg+xml' },
      { url: '/branding/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/branding/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [{ url: '/branding/icon.svg' }]
  },
  openGraph: {
    title: 'Stashr',
    description:
      'Stashr is the AI bookmark manager that captures every save from every platform you use — including X, Reddit, Instagram, TikTok, YouTube, and Bluesky — auto-tagged and agent-ready.',
    images: ['/branding/og-image.jpg']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-sidebar text-foreground selection:bg-primary/20 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
