import booksData from "@/lib/books.json";
import { useState, useEffect } from "react";

interface BookListProps {
  continent?: string | null;
  country?: string | null;
}

const BookList: React.FC<BookListProps> = ({ continent, country }) => {
  const [books, setBooks] = useState(
    [...booksData]
      .sort(
        (a, b) =>
          new Date(a.published_on).getTime() -
          new Date(b.published_on).getTime()
      )
      .map((book) => ({ ...book, hasError: false }))
  );

  useEffect(() => {
    const checkImages = async () => {
      const updatedBooks = await Promise.all(
        books.map(async (book) => {
          if (book.image_url) {
            try {
              const response = await fetch(book.image_url);
              if (!response.ok) {
                return { ...book, hasError: true };
              }
            } catch (error) {
              return { ...book, hasError: true };
            }
          } else {
            return { ...book, hasError: true };
          }
          return book;
        })
      );
      setBooks(updatedBooks);
    };
    checkImages();
  }, []);

  let title = "BookList";

  if (continent) {
    title += ` - ${continent}`;
  }

  if (country) {
    title += ` - ${country}`;
  }

  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-white pt-8 mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {books.map((book) => (
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
                      console.log("Image load error in Booklist");
                      e.target.onerror = null;
                      e.target.src = "/file.svg";
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
              <button className="bg-black text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform">
                DESCRIPTION
              </button>
              <button className="bg-amber-500 text-white text-xs py-2 px-4 rounded-md hover:scale-105 transition-transform">
                AVAILABLE ON AMAZON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
