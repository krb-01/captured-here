import { useState, useEffect, useMemo, useRef } from "react";
import Image from 'next/image'; // Import next/image

interface BookListProps {
  initialBooks: Book[]; 
  continent?: string | null;
  country?: string | null;
}

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

const BOOKS_PER_PAGE = 20;

const BookList: React.FC<BookListProps> = ({ initialBooks, continent, country }) => {
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const activeOverlayRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null); // For scrolling

  const currentFilteredBooks = useMemo(() => {
    let newFilteredBooks = [...initialBooks]; 
    if (continent) {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.continent && book.continent.includes(continent)
      );
    }
    if (country && continent !== 'Antarctica') { 
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.country.split(',').map(c => c.trim()).includes(country)
      );
    }
    return newFilteredBooks;
  }, [initialBooks, continent, country]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilteredBooks]);
  
  const totalPages = Math.ceil(currentFilteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const paginatedBooks = currentFilteredBooks.slice(startIndex, endIndex);

  let titleText = "Book List";
  if (continent) {
    titleText += ` - ${continent}`;
  }
  if (country && continent !== 'Antarctica') {
    titleText += ` - ${country}`;
  }

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

  const scrollToTop = () => {
    if (listContainerRef.current) {
      // Use a more specific block position to avoid scrolling the whole page if possible
      listContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    scrollToTop();
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    scrollToTop();
  };

  return (
    <div ref={listContainerRef} className="pb-16">
      <h2 className="text-2xl font-bold text-white pt-8 mb-8">{titleText}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {paginatedBooks.length === 0 ? (
          <p className="text-white">No items found</p>
        ) : (
          paginatedBooks.map((book) => {
            const uniqueKeyForBook = book.id || book.title; 
            return (
              <div
                key={uniqueKeyForBook} 
                className="relative flex flex-col justify-between rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="h-full flex-1 bg-white">
                  {/* Image container needs to be relative for fill to work */}
                  <div className="relative w-full aspect-square mb-4">
                    {book.image_url ? (
                      <Image
                        src={book.image_url}
                        alt={`Cover of ${book.title} by ${book.author}`}
                        fill
                        className="object-contain rounded-md"
                      />
                    ) : (
                      <Image
                        src="/file.svg" 
                        alt="Book cover placeholder"
                        fill
                        className="object-contain rounded-md"
                      />
                    )}
                  </div>
                  <div className="mb-2">
                    <p className="font-bold text-black">{book.title}</p>
                    <p className="text-sm text-black">by {book.author}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 ">
                  <button 
                    className="bg-[#212121] text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform"
                    onClick={() => handleDescriptionToggle(uniqueKeyForBook)}
                  >
                    DESCRIPTION
                  </button>
                  {book.amazon_url && (
                    <a
                      href={book.amazon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-500 text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform text-center block"
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
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-14 text-white">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-white hover:bg-gray-200 text-[#212121] font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="py-2 px-4 bg-[#212121]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-white hover:bg-gray-200 text-[#212121] font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
