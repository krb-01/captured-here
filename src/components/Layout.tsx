import Link from 'next/link';
import React from 'react';
import CookieBanner from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full text-white sticky top-0 z-50 p-4 bg-[#212121]">
        <Link href="/" className="block sm:inline-block sm:flex-col text-left">
          {/* Restored to previous Tailwind responsive font size classes */}
          <div className="font-bold text-4xl sm:text-5xl whitespace-nowrap">CAPTURED HERE</div>
          <div className="text-xs tracking-wide pl-0.5 sm:text-sm sm:pl-1 sm:tracking-widest">Explore the World Through Photography Art Books</div>
        </Link>
      </header>

      <main className="flex-grow text-black">
        {children}
      </main>

      <footer className="w-full text-white text-sm p-4 bg-[#212121]">
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <Link className="hover:underline" href="/">Home</Link>
            <Link className="hover:underline" href="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:underline" href="/terms-of-service">Terms of Service</Link>
          </div>
          <div className="text-xs">
            © {new Date().getFullYear()} CAPTURED HERE. All rights reserved.
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
};

export default Layout;
