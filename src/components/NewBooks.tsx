import booksData from '@/lib/books.json';
import { useState, useEffect } from 'react';

// Define the book type based on books.json structure
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
  imageChecked?: boolean;
}

const NewBooks = () => {
  const initialBooks = [...booksData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)
    .map((book) => ({ ...book, hasError: false, imageChecked: false }));

  const [newBooks, setNewBooks] = useState<Book[]>(initialBooks);
  const [showDescriptionIsbn, setShowDescriptionIsbn] = useState<string | null>(null); // Added state for description overlay

  useEffect(() => {
    const booksToCheck = newBooks.filter(book => !book.imageChecked);
    if (booksToCheck.length === 0) return;

    const checkImages = async () => {
      const updatedBookPromises = booksToCheck.map(async (book) => {
        let currentHasError = false;
        if (book.image_url) {
          if (book.image_url.includes("example.com/images/book1.jpg")) {
            currentHasError = true;
          } else {
            try {
              const response = await fetch(book.image_url);
              if (!response.ok) {
                console.error(`Image load failed: ${book.image_url}`);
                currentHasError = true;
              }
            } catch (error) {
              console.error(`Image load failed: ${book.image_url}`, error);
              currentHasError = true;
            }
          }
        }
        return { ...book, hasError: currentHasError, imageChecked: true };
      });

      const checkedBooks = await Promise.all(updatedBookPromises);

      setNewBooks(prevBooks =>
        prevBooks.map(pb => {
          const updatedVersion = checkedBooks.find(cb => cb.isbn === pb.isbn);
          return updatedVersion || pb;
        })
      );
    };

    checkImages();
  }, []); // Removed newBooks from dependency array to avoid re-triggering image checks on setNewBooks for description

  const handleDescriptionToggle = (isbn: string) => {
    if (showDescriptionIsbn === isbn) {
      setShowDescriptionIsbn(null);
    } else {
      setShowDescriptionIsbn(isbn);
    }
  };

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold pt-8 mb-8 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {newBooks.map((book) => (
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
                  onError={() => {
                    setNewBooks((prevBooks) =>
                      prevBooks.map((b) =>
                        b.isbn === book.isbn ? { ...b, hasError: true, imageChecked: true } : b
                      )
                    );
                  }}
                />
              ) : book.image_url ? (
                <img
                  src="/window.svg"
                  alt="Fallback image"
                  className="w-full aspect-square object-contain rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex justify-center items-center">
                  <p className="text-gray-500">No image available</p>
                </div>
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
                onClick={() => handleDescriptionToggle(book.isbn)} // Added onClick handler
              >
                DESCRIPTION
              </button>
              <button
                className="bg-[#FF9900] text-white px-4 py-2 rounded text-xs hover:scale-105 transition-all duration-200"
              >
                AVAILABLE ON AMAZON
              </button>
            </div>
            {/* Copied Overlay JSX from BookList.tsx */}
            {showDescriptionIsbn === book.isbn && (
              <div
                className="absolute inset-0 bg-[#212121]/[0.8] p-4 flex flex-col rounded-lg z-10"
                onClick={() => setShowDescriptionIsbn(null)} // Click on background closes
              >
                <div
                  className="flex flex-col h-full"
                  onClick={(e) => e.stopPropagation()} // Prevent click on content from closing
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

export default NewBooks;
