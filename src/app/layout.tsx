// src/app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Layout from '@/components/Layout';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const siteUrl = "https://captured-here.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CAPTURED HERE",
  description: "Explore the World Through Photography Art Books",
  manifest: '/manifest.json', // Link to PWA Manifest for Android icons etc.
  openGraph: {
    title: 'CAPTURED HERE',
    description: 'Explore the World Through Photography Art Books',
    url: '/', // Relative to metadataBase
    siteName: 'CAPTURED HERE',
    images: [
      {
        url: `${siteUrl}/og-default-image.jpg`, // Absolute URL for OGP image
        width: 1200,
        height: 630,
        alt: 'CAPTURED HERE - Discover Photography Books by Location',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // For Apple touch icon, Next.js recommends placing apple-icon.png (e.g., 180x180)
  // in the 'app' directory root. It will automatically add the <link> tag.
  // If you prefer to place it in /public or specify different icons:
  icons: {
    apple: '/apple-icon.png', // Assumes it's in /public or Next.js finds it in /app
    // You can add other general icons here if needed, e.g., for desktop browsers
    // icon: '/favicon.ico', // This is usually handled by favicon.ico in /app or /public too
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CAPTURED HERE",
    "url": siteUrl, // Use the defined siteUrl
  };

  return (
    <html lang="en" className={`${montserrat.variable} font-sans antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Theme color for browser UI (Android Chrome primarily) */}
        <meta name="theme-color" content="#212121" />
      </head>
      <body>
        <Layout> 
          {children}
        </Layout>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
