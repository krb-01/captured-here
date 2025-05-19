"use client";

import React, { useState, useEffect, useRef } from 'react'; // useEffect, useRef imported

// Bookインターフェース (共通化されている場合はインポート)
interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url?: string;
  region: string; // NewBooksでは直接使われていないが、元々の型定義にはあった
  country: string;
  description: string;
  created_at: string; // NewBooksでは直接使われていない
  updated_at: string; // NewBooksでは直接使われていない
  hasError?: boolean; // サーバーで判定済み
}

interface NewBooksClientProps {
  initialBooks: Book[];
}

const NewBooksClient: React.FC<NewBooksClientProps> = ({ initialBooks }) => {
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null);
  const activeOverlayRef = useRef<HTMLDivElement>(null); // Ref for the currently active overlay

  const handleDescriptionToggle = (isbn: string) => {
    if (showDescriptionIsbn === isbn) {
      setShowDescriptionIsbn(null);
    } else {
      setShowDescriptionIsbn(isbn);
    }
  };

  useEffect(() => {
    if (showDescriptionIsbn && activeOverlayRef.current) {
      const headerHeight = 80; // Approximate header height in pixels. Adjust as needed.
      const elementPosition = activeOverlayRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [showDescriptionIsbn]);

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold pt-8 mb-8 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {initialBooks.map((book) => (
          <div
            key={book.isbn}
            className="relative rounded-lg p-4 border border-gray-300 flex flex-col justify-between h-full bg-white"
          >
            <div className="mb-4">
              {book.image_url && !book.hasError ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full aspect-square object-contain rounded-md"
                />
              ) : ( 
                <img
                  src="/window.svg"
                  alt="Fallback image"
                  className="w-full aspect-square object-contain rounded-md"
                />
              )}
            </div>
            <div className="mb-2 flex-1">
              <p className="font-bold text-black">{book.title}</p>
              <p className="text-sm text-black">by {book.author}</p>
              <p className="text-sm text-black">Country: {book.country}</p>
              <p className="text-xs text-black mt-1">
                Published: {new Date(book.published_on).getFullYear()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                className="bg-black text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
                onClick={() => handleDescriptionToggle(book.isbn)}
              >
                DESCRIPTION
              </button>
              <button
                className="bg-[#FF9900] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
              >
                AVAILABLE ON AMAZON
              </button>
            </div>
            {showDescriptionIsbn === book.isbn && (
              <div
                ref={activeOverlayRef} // Attach ref to the overlay container
                className="absolute inset-0 bg-[#212121]/[0.8] p-4 flex flex-col rounded-lg z-10"
                onClick={() => setShowDescriptionIsbn(null)}
              >
                <div
                  className="flex flex-col h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="font-bold text-lg mb-2 text-white">{book.title}</h4>
                  <p className="text-sm text-white flex-grow break-words overflow-hidden">
                    {book.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                    <button
                      className="bg-white text-black text-xs py-4 px-4 rounded-md hover:scale-105 transition-transform"
                      onClick={() => setShowDescriptionIsbn(null)}
                    >
                      CLOSE
                    </button>
                    <div></div> 
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBooksClient;
