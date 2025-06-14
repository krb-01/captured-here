"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import next/image

interface Book {
  id?: string;
  title: string;
  author: string;
  image_url?: string;
  region: string;
  country: string;
  description: string;
  created_at: string; 
  updated_at: string; 
  continent?: string[];
  amazon_url?: string; 
}

interface NewBooksClientProps {
  initialBooks: Book[];
}

const NewBooksClient: React.FC<NewBooksClientProps> = ({ initialBooks }) => {
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null);
  const activeOverlayRef = useRef<HTMLDivElement>(null);

  const handleDescriptionToggle = (uniqueBookKey: string) => {
    if (showDescriptionIsbn === uniqueBookKey) {
      setShowDescriptionIsbn(null);
    } else {
      setShowDescriptionIsbn(uniqueBookKey);
    }
  };

  useEffect(() => {
    const mobileBreakpoint = 1024;
    if (showDescriptionIsbn && activeOverlayRef.current && window.innerWidth < mobileBreakpoint) {
      const headerHeight = 80; 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {initialBooks.map((book) => {
          const uniqueKeyForBook = book.id || book.title;
          
          let displayCountries = "";
          if (book.country) {
            const countriesArray = book.country.split(',').map(c => c.trim());
            if (countriesArray.length > 5) {
              displayCountries = countriesArray.slice(0, 5).join(', ') + ", etc...";
            } else {
              displayCountries = countriesArray.join(', ');
            }
          }

          return (
            <div
              key={uniqueKeyForBook}
              className="relative rounded-lg p-4 border border-gray-300 flex flex-col justify-between h-full bg-white"
            >
              <div className="relative w-full aspect-square mb-4"> {/* Added relative positioning and dimensions for Image fill */}
                {book.image_url ? (
                  <Image
                    src={book.image_url}
                    alt={`Cover of ${book.title} by ${book.author}`}
                    fill
                    className="object-contain rounded-md"
                    priority={initialBooks.slice(0,4).includes(book)} // Prioritize loading for the first few images in NewArrivals
                  />
                ) : ( 
                  <Image
                    src="/window.svg"
                    alt="Book cover placeholder"
                    fill
                    className="object-contain rounded-md"
                  />
                )}
              </div>
              <div className="mb-2 flex-1">
                <p className="font-bold text-black">{book.title}</p>
                <p className="text-sm text-black">by {book.author}</p>
                <p className="text-sm text-black">Country: {displayCountries}</p> 
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  className="bg-black text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
                  onClick={() => handleDescriptionToggle(uniqueKeyForBook)}
                >
                  DESCRIPTION
                </button>
                {book.amazon_url && (
                  <a
                    href={book.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FF9900] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200 text-center block"
                  >
                    AVAILABLE ON AMAZON
                  </a>
                )}
              </div>
              {showDescriptionIsbn === uniqueKeyForBook && (
                <div
                  ref={activeOverlayRef}
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
          );
        })}
      </div>
    </div>
  );
};

export default NewBooksClient;
