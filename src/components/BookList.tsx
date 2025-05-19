import { useState, useEffect, useMemo, useRef } from "react"; // useRef imported

interface BookListProps {
  initialBooks: Book[]; 
  continent?: string | null;
  country?: string | null;
}

interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url?: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError?: boolean;
  continent?: string;
}

const BookList: React.FC<BookListProps> = ({ initialBooks, continent, country }) => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null);
  const activeOverlayRef = useRef<HTMLDivElement>(null); // Ref for the currently active overlay

  const currentFilteredBooks = useMemo(() => {
    let newFilteredBooks = [...initialBooks]; 

    if (continent) {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.continent === continent
      );
    }
    if (country && continent !== 'Antarctica') { 
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.country === country
      );
    }
    return newFilteredBooks;
  }, [initialBooks, continent, country]);

  useEffect(() => {
    setFilteredBooks(currentFilteredBooks);
  }, [currentFilteredBooks]);

  let title = "Book List";
  if (continent) {
    title += ` - ${continent}`;
  }
  if (country && continent !== 'Antarctica') {
    title += ` - ${country}`;
  }

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
      <h2 className="text-2xl font-bold text-white pt-8 mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredBooks.length === 0 ? (
          <p className="text-white">No items found</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.isbn}
              className="relative flex flex-col justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="h-full flex-1 bg-white">
                <div className="mb-4">
                  {book.image_url && !book.hasError ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full aspect-square object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-full aspect-square object-contain rounded-md">
                      <img
                        src="/file.svg" 
                        alt="fallback"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <p className="font-bold text-black">{book.title}</p>
                  <p className="text-sm text-black">by {book.author}</p>
                  <p className="text-xs text-black mt-1">
                    Published: {new Date(book.published_on).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 ">
                <button 
                  className="bg-[#212121] text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform"
                  onClick={() => handleDescriptionToggle(book.isbn)}
                >
                  DESCRIPTION
                </button>
                <button className="bg-amber-500 text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform">
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
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
