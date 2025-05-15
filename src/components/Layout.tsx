import Link from 'next/link';
import React from 'react';
import CookieBanner from './CookieBanner'; // CookieBannerをインポート

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full text-white sticky top-0 z-50 p-4 bg-[#212121]">
        <Link href="/" className="flex-col inline-block">
          <div className="text-5xl font-bold">CAPTURED HERE</div>
          <div className="text-sm pl-1 tracking-widest">Explore the World Through Photography Art Books</div>
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
      <CookieBanner /> {/* CookieBannerコンポーネントをここに追加 */}
    </div>
  );
};

export default Layout;
