import booksData from "@/lib/books.json";
import { useState, useEffect } from "react";
import { getContinentByCountry } from "@/utils/continentCountries"; // インポートを追加

interface BookListProps {
  continent?: string | null;
  country?: string | null;
  selectedContinent?: string | null;
}

// 書籍データの型に continent を追加 (オプショナル)
interface Book {
  isbn: string;
  title: string;
  author: string;
  published_on: string;
  image_url: string;
  region: string;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
  hasError: boolean;
  continent?: string; // continent プロパティを追加
  imageChecked?: boolean; // 画像チェック済みフラグ
}

const BookList: React.FC<BookListProps> = ({ continent, country, selectedContinent }) => {
  const [initialBooks, setInitialBooks] = useState<Book[]>(() =>
    [...booksData]
      .map((book) => ({
        ...book,
        hasError: false, // 初期状態ではエラーなし
        continent: getContinentByCountry(book.country) || undefined,
      }))
      .sort(
        (a, b) =>
          new Date(a.published_on).getTime() -
          new Date(b.published_on).getTime()
      )
  );

  const [processedBooks, setProcessedBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null); // State for description overlay

  useEffect(() => {
    const checkImages = async () => {
      const booksToProcess = initialBooks.filter(book => !book.imageChecked);
      if (booksToProcess.length === 0) {
        if (JSON.stringify(processedBooks) !== JSON.stringify(initialBooks)) {
          setProcessedBooks(initialBooks);
        }
        return;
      }

      const updatedBooks = await Promise.all(
        initialBooks.map(async (book) => {
          if (book.imageChecked) return book;
          let hasError = book.hasError;
          if (book.image_url) {
            try {
              const response = await fetch(book.image_url);
              if (!response.ok) {
                hasError = true;
              }
            } catch (error) {
              hasError = true;
            }
          } else {
            hasError = true;
          }
          return { ...book, hasError, imageChecked: true };
        })
      );
      setProcessedBooks(updatedBooks);
    };

    checkImages();
  }, [initialBooks, processedBooks]);

  useEffect(() => {
    if (processedBooks.length === 0 && initialBooks.length > 0 && !initialBooks.every(b => b.imageChecked)) {
      return;
    }
    
    let newFilteredBooks = [...processedBooks];

    if (continent) {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.continent === continent
      );
    }
    if (country && selectedContinent !== 'Antarctica') {
      newFilteredBooks = newFilteredBooks.filter(
        (book) => book.country === country
      );
    }
    setFilteredBooks(newFilteredBooks);
  }, [continent, country, processedBooks, initialBooks, selectedContinent]);

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
                      onError={(e: any) => {
                        console.log("Image load error in Booklist for book:", book.title);
                        setFilteredBooks(prevBooks => prevBooks.map(b => b.isbn === book.isbn ? {...b, hasError: true} : b));
                        setProcessedBooks(prevBooks => prevBooks.map(b => b.isbn === book.isbn ? {...b, hasError: true} : b));
                      }}
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
                  className="absolute inset-0 bg-[#212121]/[0.8] p-4 flex flex-col rounded-lg z-10"
                  onClick={() => setShowDescriptionIsbn(null)} // Click on background closes
                >
                  <div
                    className="flex flex-col h-full" // Inner container for content + new button layout
                    onClick={(e) => e.stopPropagation()} // Prevent click on content from closing
                  >
                    <h4 className="font-bold text-lg mb-2 text-white">{book.title}</h4>
                    <p className="text-sm text-white flex-grow break-words overflow-hidden">
                      {book.description}
                    </p>
                    {/* New Close button layout mimicking the original DESCRIPTION button */}
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-4"> {/* Changed pt-4 to pt-6 */}
                      <button
                        className="bg-white text-black text-xs py-4 px-4 rounded-md hover:scale-105 transition-transform" /* Changed colors */
                        onClick={() => setShowDescriptionIsbn(null)}
                      >
                        CLOSE
                      </button>
                      <div></div> {/* Empty div to occupy the second column for layout consistency */}
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
