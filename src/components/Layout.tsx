import Link from 'next/link';
import React from 'react'; // Removed useEffect, useRef, useState imports
import CookieBanner from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Removed useEffect and useRef related code

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full text-white sticky top-0 z-50 p-4 bg-[#212121]">
        {/* Removed ref from Link, restored Tailwind classes for responsiveness */}
        <Link href="/" className="block sm:inline-block sm:flex-col text-left">
          {/* Adjusted Tailwind responsive font size classes for title */}
          <div className="font-bold text-4xl sm:text-5xl whitespace-nowrap">CAPTURED HERE</div>
          {/* Adjusted Tailwind responsive font size and padding classes for subtitle */}
          <div className="text-xs tracking-wide pl-0.5 sm:text-sm sm:pl-1 sm:tracking-widest">Explore the World Through Photography Art Books</div>
        </Link>
      </header>

      <main className="flex-grow text-black">
        {children}
      </main>

      <footer className="w-full text-white text-sm p-4 bg-[#212121]">
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <Link className="hover:underline" href="/privacy-policy">Privacy Policy</Link>
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
