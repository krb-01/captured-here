import type { Metadata } from 'next';
import { Montserrat } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from '@/components/ScrollToTopButton';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "CAPTURED HERE",
  description: "Explore the World Through Photography Art Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${montserrat.variable} antialiased font-sans`}>
        {children}
        <ScrollToTopButton />
        </body>
    </html>
  );
}
